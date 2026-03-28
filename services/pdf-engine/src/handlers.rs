use axum::{
    body::Bytes,
    extract::Path,
    http::{header, StatusCode},
    response::{IntoResponse, Response},
    Json,
};
use serde_json::{json, Value};
use tracing::info;

use crate::{
    error::PdfError,
    models::{InvoiceRequest, PayslipRequest, PdfResponse, RepairTicketRequest},
    pdf,
};

pub async fn health() -> impl IntoResponse {
    Json(json!({
        "status": "ok",
        "service": "pdf-engine",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

pub async fn generate_invoice(
    Json(payload): Json<InvoiceRequest>,
) -> Result<impl IntoResponse, PdfError> {
    info!("Generating invoice PDF: {}", payload.number);
    let pdf_bytes = pdf::generate_invoice_pdf(&payload)?;
    let filename = format!("{}.pdf", payload.number);
    Ok(pdf_response(pdf_bytes, filename))
}

pub async fn generate_quote(
    Json(payload): Json<InvoiceRequest>,
) -> Result<impl IntoResponse, PdfError> {
    info!("Generating quote PDF: {}", payload.number);
    let pdf_bytes = pdf::generate_invoice_pdf(&payload)?;
    let filename = format!("{}.pdf", payload.number);
    Ok(pdf_response(pdf_bytes, filename))
}

pub async fn generate_payslip(
    Json(payload): Json<PayslipRequest>,
) -> Result<impl IntoResponse, PdfError> {
    info!("Generating payslip PDF for: {}", payload.employee_name);
    let pdf_bytes = pdf::generate_payslip_pdf(&payload)?;
    let filename = format!("payslip-{}-{}.pdf", payload.employee_id, payload.month);
    Ok(pdf_response(pdf_bytes, filename))
}

pub async fn generate_repair_ticket(
    Json(payload): Json<RepairTicketRequest>,
) -> Result<impl IntoResponse, PdfError> {
    info!("Generating repair ticket PDF: {}", payload.ticket_number);
    let pdf_bytes = pdf::generate_repair_ticket_pdf(&payload)?;
    let filename = format!("ticket-{}.pdf", payload.ticket_number);
    Ok(pdf_response(pdf_bytes, filename))
}

pub async fn generate_report(
    Path(report_type): Path<String>,
    Json(payload): Json<Value>,
) -> Result<impl IntoResponse, PdfError> {
    info!("Generating report PDF: {report_type}");
    let pdf_bytes = pdf::generate_report_pdf(&report_type, &payload)?;
    let filename = format!("report-{report_type}.pdf");
    Ok(pdf_response(pdf_bytes, filename))
}

fn pdf_response(bytes: Vec<u8>, filename: String) -> Response {
    (
        StatusCode::OK,
        [
            (header::CONTENT_TYPE, "application/pdf"),
            (
                header::CONTENT_DISPOSITION,
                &format!("attachment; filename=\"{filename}\""),
            ),
        ],
        Bytes::from(bytes),
    )
        .into_response()
}
