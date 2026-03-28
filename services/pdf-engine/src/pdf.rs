use printpdf::*;
use serde_json::Value;

use crate::{
    error::PdfError,
    models::{InvoiceRequest, PayslipRequest, RepairTicketRequest},
};

const MM_TO_PT: f64 = 2.8346456692913385;
const A4_W: f64 = 210.0;
const A4_H: f64 = 297.0;

pub fn generate_invoice_pdf(req: &InvoiceRequest) -> Result<Vec<u8>, PdfError> {
    let (doc, page1, layer1) = PdfDocument::new(
        &req.number,
        Mm(A4_W),
        Mm(A4_H),
        "Layer 1",
    );

    let current_layer = doc.get_page(page1).get_layer(layer1);

    // Header background
    let points = vec![
        (Point::new(Mm(0.0), Mm(A4_H)), false),
        (Point::new(Mm(A4_W), Mm(A4_H)), false),
        (Point::new(Mm(A4_W), Mm(A4_H - 40.0)), false),
        (Point::new(Mm(0.0), Mm(A4_H - 40.0)), false),
    ];
    let header_bg = Polygon {
        rings: vec![points],
        mode: PaintMode::Fill,
        winding_order: WindingOrder::NonZero,
    };
    current_layer.set_fill_color(Color::Rgb(Rgb::new(0.149, 0.388, 0.922, None)));
    current_layer.add_polygon(header_bg);

    // Document title text
    let font = doc
        .add_builtin_font(BuiltinFont::HelveticaBold)
        .map_err(|e| PdfError::Generation(e.to_string()))?;
    let font_regular = doc
        .add_builtin_font(BuiltinFont::Helvetica)
        .map_err(|e| PdfError::Generation(e.to_string()))?;

    current_layer.set_fill_color(Color::Rgb(Rgb::new(1.0, 1.0, 1.0, None)));
    current_layer.use_text(&req.document_type, 24.0, Mm(15.0), Mm(A4_H - 20.0), &font);
    current_layer.use_text(&req.number, 14.0, Mm(15.0), Mm(A4_H - 32.0), &font_regular);

    // Shop info (right-aligned approximation)
    current_layer.use_text(&req.shop_name, 12.0, Mm(120.0), Mm(A4_H - 20.0), &font);
    if let Some(addr) = &req.shop_address {
        current_layer.use_text(addr, 9.0, Mm(120.0), Mm(A4_H - 28.0), &font_regular);
    }
    if let Some(phone) = &req.shop_phone {
        current_layer.use_text(phone, 9.0, Mm(120.0), Mm(A4_H - 34.0), &font_regular);
    }

    // Client info block
    current_layer.set_fill_color(Color::Rgb(Rgb::new(0.1, 0.1, 0.1, None)));
    current_layer.use_text("Bill To:", 10.0, Mm(15.0), Mm(A4_H - 55.0), &font);
    current_layer.use_text(&req.client_name, 12.0, Mm(15.0), Mm(A4_H - 63.0), &font_regular);
    if let Some(phone) = &req.client_phone {
        current_layer.use_text(phone, 10.0, Mm(15.0), Mm(A4_H - 70.0), &font_regular);
    }

    // Date info
    current_layer.use_text(
        &format!("Date: {}", req.date),
        10.0,
        Mm(130.0),
        Mm(A4_H - 55.0),
        &font_regular,
    );
    if let Some(due) = &req.due_date {
        current_layer.use_text(
            &format!("Due: {due}"),
            10.0,
            Mm(130.0),
            Mm(A4_H - 63.0),
            &font_regular,
        );
    }

    // Table header
    let table_top = A4_H - 85.0;
    let header_rect = Polygon {
        rings: vec![vec![
            (Point::new(Mm(15.0), Mm(table_top)), false),
            (Point::new(Mm(195.0), Mm(table_top)), false),
            (Point::new(Mm(195.0), Mm(table_top - 8.0)), false),
            (Point::new(Mm(15.0), Mm(table_top - 8.0)), false),
        ]],
        mode: PaintMode::Fill,
        winding_order: WindingOrder::NonZero,
    };
    current_layer.set_fill_color(Color::Rgb(Rgb::new(0.95, 0.95, 0.97, None)));
    current_layer.add_polygon(header_rect);

    current_layer.set_fill_color(Color::Rgb(Rgb::new(0.1, 0.1, 0.1, None)));
    current_layer.use_text("Description", 9.0, Mm(17.0), Mm(table_top - 5.5), &font);
    current_layer.use_text("Qty", 9.0, Mm(115.0), Mm(table_top - 5.5), &font);
    current_layer.use_text("Unit Price", 9.0, Mm(135.0), Mm(table_top - 5.5), &font);
    current_layer.use_text("VAT", 9.0, Mm(160.0), Mm(table_top - 5.5), &font);
    current_layer.use_text("Total", 9.0, Mm(178.0), Mm(table_top - 5.5), &font);

    // Line items
    let mut y = table_top - 14.0;
    for line in &req.lines {
        current_layer.use_text(&line.description, 9.0, Mm(17.0), Mm(y), &font_regular);
        current_layer.use_text(&format!("{:.0}", line.quantity), 9.0, Mm(115.0), Mm(y), &font_regular);
        current_layer.use_text(&format!("{:.2}", line.unit_price), 9.0, Mm(135.0), Mm(y), &font_regular);
        current_layer.use_text(&format!("{:.0}%", line.vat_rate), 9.0, Mm(160.0), Mm(y), &font_regular);
        current_layer.use_text(&format!("{:.2}", line.total), 9.0, Mm(178.0), Mm(y), &font_regular);
        y -= 7.0;
    }

    // Totals section
    let totals_y = y - 10.0;
    current_layer.use_text("Subtotal:", 10.0, Mm(145.0), Mm(totals_y), &font);
    current_layer.use_text(&format!("{:.2}", req.subtotal), 10.0, Mm(178.0), Mm(totals_y), &font_regular);

    if req.discount_total > 0.0 {
        current_layer.use_text("Discount:", 10.0, Mm(145.0), Mm(totals_y - 7.0), &font);
        current_layer.use_text(&format!("-{:.2}", req.discount_total), 10.0, Mm(178.0), Mm(totals_y - 7.0), &font_regular);
    }

    current_layer.use_text("VAT:", 10.0, Mm(145.0), Mm(totals_y - 14.0), &font);
    current_layer.use_text(&format!("{:.2}", req.vat_total), 10.0, Mm(178.0), Mm(totals_y - 14.0), &font_regular);

    // Total line with background
    let total_rect = Polygon {
        rings: vec![vec![
            (Point::new(Mm(140.0), Mm(totals_y - 17.0)), false),
            (Point::new(Mm(195.0), Mm(totals_y - 17.0)), false),
            (Point::new(Mm(195.0), Mm(totals_y - 26.0)), false),
            (Point::new(Mm(140.0), Mm(totals_y - 26.0)), false),
        ]],
        mode: PaintMode::Fill,
        winding_order: WindingOrder::NonZero,
    };
    current_layer.set_fill_color(Color::Rgb(Rgb::new(0.149, 0.388, 0.922, None)));
    current_layer.add_polygon(total_rect);

    current_layer.set_fill_color(Color::Rgb(Rgb::new(1.0, 1.0, 1.0, None)));
    current_layer.use_text("TOTAL:", 11.0, Mm(145.0), Mm(totals_y - 24.0), &font);
    current_layer.use_text(&format!("{:.2}", req.total), 11.0, Mm(178.0), Mm(totals_y - 24.0), &font);

    // Notes
    if let Some(notes) = &req.notes {
        current_layer.set_fill_color(Color::Rgb(Rgb::new(0.1, 0.1, 0.1, None)));
        current_layer.use_text("Notes:", 9.0, Mm(15.0), Mm(30.0), &font);
        current_layer.use_text(notes, 9.0, Mm(15.0), Mm(24.0), &font_regular);
    }

    // Footer
    current_layer.set_fill_color(Color::Rgb(Rgb::new(0.5, 0.5, 0.5, None)));
    current_layer.use_text("Thank you for your business!", 9.0, Mm(70.0), Mm(12.0), &font_regular);

    let bytes = doc.save_to_bytes().map_err(|e| PdfError::Generation(e.to_string()))?;
    Ok(bytes)
}

pub fn generate_payslip_pdf(req: &PayslipRequest) -> Result<Vec<u8>, PdfError> {
    let (doc, page1, layer1) = PdfDocument::new(
        &format!("Payslip - {}", req.month),
        Mm(A4_W),
        Mm(A4_H),
        "Layer 1",
    );
    let layer = doc.get_page(page1).get_layer(layer1);

    let font = doc.add_builtin_font(BuiltinFont::HelveticaBold)
        .map_err(|e| PdfError::Generation(e.to_string()))?;
    let font_regular = doc.add_builtin_font(BuiltinFont::Helvetica)
        .map_err(|e| PdfError::Generation(e.to_string()))?;

    // Header
    let header = Polygon {
        rings: vec![vec![
            (Point::new(Mm(0.0), Mm(A4_H)), false),
            (Point::new(Mm(A4_W), Mm(A4_H)), false),
            (Point::new(Mm(A4_W), Mm(A4_H - 35.0)), false),
            (Point::new(Mm(0.0), Mm(A4_H - 35.0)), false),
        ]],
        mode: PaintMode::Fill,
        winding_order: WindingOrder::NonZero,
    };
    layer.set_fill_color(Color::Rgb(Rgb::new(0.149, 0.388, 0.922, None)));
    layer.add_polygon(header);
    layer.set_fill_color(Color::Rgb(Rgb::new(1.0, 1.0, 1.0, None)));
    layer.use_text("PAYSLIP", 20.0, Mm(15.0), Mm(A4_H - 18.0), &font);
    layer.use_text(&req.month, 12.0, Mm(15.0), Mm(A4_H - 28.0), &font_regular);
    layer.use_text(&req.shop_name, 12.0, Mm(130.0), Mm(A4_H - 20.0), &font);

    layer.set_fill_color(Color::Rgb(Rgb::new(0.1, 0.1, 0.1, None)));
    layer.use_text(&req.employee_name, 14.0, Mm(15.0), Mm(A4_H - 50.0), &font);
    layer.use_text(&format!("Position: {}", req.position), 10.0, Mm(15.0), Mm(A4_H - 58.0), &font_regular);
    layer.use_text(&format!("Employee ID: {}", req.employee_id), 10.0, Mm(15.0), Mm(A4_H - 65.0), &font_regular);

    // Earnings / deductions table
    let mut y = A4_H - 85.0;
    let items: Vec<(&str, f64)> = vec![
        ("Base Salary", req.base_salary),
        ("Bonuses", req.bonuses),
        ("Overtime", req.overtime),
    ];
    layer.use_text("EARNINGS", 11.0, Mm(15.0), Mm(y), &font);
    layer.use_text("DEDUCTIONS", 11.0, Mm(110.0), Mm(y), &font);
    y -= 8.0;

    let deductions: Vec<(&str, f64)> = vec![
        ("Social Security", req.social_security),
        ("Income Tax", req.income_tax),
        ("Other", req.other_deductions),
        ("Advances", req.advances),
    ];

    for (i, (label, amount)) in items.iter().enumerate() {
        if amount > &0.0 {
            layer.use_text(label, 9.0, Mm(15.0), Mm(y - (i as f64) * 7.0), &font_regular);
            layer.use_text(&format!("{amount:.2}"), 9.0, Mm(75.0), Mm(y - (i as f64) * 7.0), &font_regular);
        }
    }
    for (i, (label, amount)) in deductions.iter().enumerate() {
        if amount > &0.0 {
            layer.use_text(label, 9.0, Mm(110.0), Mm(y - (i as f64) * 7.0), &font_regular);
            layer.use_text(&format!("{amount:.2}"), 9.0, Mm(175.0), Mm(y - (i as f64) * 7.0), &font_regular);
        }
    }

    // Gross / Net
    let net_y = y - 45.0;
    layer.use_text(&format!("GROSS: {:.2}", req.gross), 11.0, Mm(15.0), Mm(net_y), &font);

    let net_rect = Polygon {
        rings: vec![vec![
            (Point::new(Mm(15.0), Mm(net_y - 5.0)), false),
            (Point::new(Mm(195.0), Mm(net_y - 5.0)), false),
            (Point::new(Mm(195.0), Mm(net_y - 15.0)), false),
            (Point::new(Mm(15.0), Mm(net_y - 15.0)), false),
        ]],
        mode: PaintMode::Fill,
        winding_order: WindingOrder::NonZero,
    };
    layer.set_fill_color(Color::Rgb(Rgb::new(0.149, 0.388, 0.922, None)));
    layer.add_polygon(net_rect);
    layer.set_fill_color(Color::Rgb(Rgb::new(1.0, 1.0, 1.0, None)));
    layer.use_text(&format!("NET PAY: {:.2}", req.net), 14.0, Mm(70.0), Mm(net_y - 12.0), &font);

    let bytes = doc.save_to_bytes().map_err(|e| PdfError::Generation(e.to_string()))?;
    Ok(bytes)
}

pub fn generate_repair_ticket_pdf(req: &RepairTicketRequest) -> Result<Vec<u8>, PdfError> {
    // A5 format for receipt/ticket
    let (doc, page1, layer1) = PdfDocument::new(
        &format!("Repair Ticket {}", req.ticket_number),
        Mm(148.0),
        Mm(210.0),
        "Layer 1",
    );
    let layer = doc.get_page(page1).get_layer(layer1);

    let font = doc.add_builtin_font(BuiltinFont::HelveticaBold)
        .map_err(|e| PdfError::Generation(e.to_string()))?;
    let font_regular = doc.add_builtin_font(BuiltinFont::Helvetica)
        .map_err(|e| PdfError::Generation(e.to_string()))?;

    // Header
    let header = Polygon {
        rings: vec![vec![
            (Point::new(Mm(0.0), Mm(210.0)), false),
            (Point::new(Mm(148.0), Mm(210.0)), false),
            (Point::new(Mm(148.0), Mm(185.0)), false),
            (Point::new(Mm(0.0), Mm(185.0)), false),
        ]],
        mode: PaintMode::Fill,
        winding_order: WindingOrder::NonZero,
    };
    layer.set_fill_color(Color::Rgb(Rgb::new(0.149, 0.388, 0.922, None)));
    layer.add_polygon(header);
    layer.set_fill_color(Color::Rgb(Rgb::new(1.0, 1.0, 1.0, None)));
    layer.use_text(&req.shop_name, 14.0, Mm(10.0), Mm(198.0), &font);
    layer.use_text("REPAIR RECEIPT", 10.0, Mm(10.0), Mm(189.0), &font_regular);

    layer.set_fill_color(Color::Rgb(Rgb::new(0.1, 0.1, 0.1, None)));
    layer.use_text(&format!("Ticket: {}", req.ticket_number), 12.0, Mm(10.0), Mm(175.0), &font);
    layer.use_text(&format!("Date: {}", req.date), 9.0, Mm(10.0), Mm(168.0), &font_regular);
    layer.use_text(&format!("Client: {}", req.client_name), 9.0, Mm(10.0), Mm(158.0), &font_regular);
    layer.use_text(&format!("Phone: {}", req.client_phone), 9.0, Mm(10.0), Mm(151.0), &font_regular);
    layer.use_text(&format!("Device: {} {}", req.device_brand, req.device_model), 9.0, Mm(10.0), Mm(141.0), &font);
    if let Some(imei) = &req.imei {
        layer.use_text(&format!("IMEI: {imei}"), 8.0, Mm(10.0), Mm(134.0), &font_regular);
    }
    layer.use_text("Fault:", 9.0, Mm(10.0), Mm(122.0), &font);
    // Wrap long fault description
    let fault = &req.fault_description;
    let max_chars = 45;
    if fault.len() > max_chars {
        layer.use_text(&fault[..max_chars], 8.0, Mm(10.0), Mm(116.0), &font_regular);
        layer.use_text(&fault[max_chars..], 8.0, Mm(10.0), Mm(110.0), &font_regular);
    } else {
        layer.use_text(fault, 8.0, Mm(10.0), Mm(116.0), &font_regular);
    }

    if let Some(cost) = req.estimated_cost {
        layer.use_text(&format!("Estimate: {cost:.2}"), 9.0, Mm(10.0), Mm(100.0), &font);
    }

    // QR Code placeholder area (actual QR generation would use `qrcode` crate)
    layer.use_text("Scan to track:", 8.0, Mm(80.0), Mm(100.0), &font_regular);
    layer.use_text(&req.tracking_url, 6.0, Mm(80.0), Mm(94.0), &font_regular);

    // Footer
    layer.use_text(&format!("Contact: {}", req.shop_phone), 8.0, Mm(10.0), Mm(20.0), &font_regular);
    layer.use_text("Keep this receipt to claim your device.", 7.0, Mm(10.0), Mm(13.0), &font_regular);

    let bytes = doc.save_to_bytes().map_err(|e| PdfError::Generation(e.to_string()))?;
    Ok(bytes)
}

pub fn generate_report_pdf(_report_type: &str, _data: &serde_json::Value) -> Result<Vec<u8>, PdfError> {
    // Generic report — will be specialized per report type in Sprint 9
    let (doc, page1, layer1) = PdfDocument::new(
        "Report",
        Mm(A4_W),
        Mm(A4_H),
        "Layer 1",
    );
    let layer = doc.get_page(page1).get_layer(layer1);
    let font = doc.add_builtin_font(BuiltinFont::HelveticaBold)
        .map_err(|e| PdfError::Generation(e.to_string()))?;

    layer.set_fill_color(Color::Rgb(Rgb::new(0.1, 0.1, 0.1, None)));
    layer.use_text("Report", 24.0, Mm(15.0), Mm(A4_H - 30.0), &font);

    let bytes = doc.save_to_bytes().map_err(|e| PdfError::Generation(e.to_string()))?;
    Ok(bytes)
}
