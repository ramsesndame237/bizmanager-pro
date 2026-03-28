use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct InvoiceLine {
    pub description: String,
    pub quantity: f64,
    pub unit_price: f64,
    pub discount: f64,
    pub vat_rate: f64,
    pub total: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InvoiceRequest {
    pub number: String,
    pub date: String,
    pub due_date: Option<String>,
    pub document_type: String, // "INVOICE" | "QUOTE" | "CREDIT_NOTE"
    pub client_name: String,
    pub client_address: Option<String>,
    pub client_phone: Option<String>,
    pub lines: Vec<InvoiceLine>,
    pub subtotal: f64,
    pub discount_total: f64,
    pub vat_total: f64,
    pub total: f64,
    pub paid_amount: Option<f64>,
    pub notes: Option<String>,
    pub shop_name: String,
    pub shop_address: Option<String>,
    pub shop_phone: Option<String>,
    pub shop_email: Option<String>,
    pub logo_base64: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PayslipRequest {
    pub employee_name: String,
    pub employee_id: String,
    pub position: String,
    pub month: String, // "2026-03"
    pub base_salary: f64,
    pub bonuses: f64,
    pub overtime: f64,
    pub gross: f64,
    pub social_security: f64,
    pub income_tax: f64,
    pub other_deductions: f64,
    pub advances: f64,
    pub net: f64,
    pub shop_name: String,
    pub shop_address: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RepairTicketRequest {
    pub ticket_number: String,
    pub date: String,
    pub client_name: String,
    pub client_phone: String,
    pub device_brand: String,
    pub device_model: String,
    pub imei: Option<String>,
    pub fault_description: String,
    pub estimated_cost: Option<f64>,
    pub tracking_url: String,
    pub shop_name: String,
    pub shop_phone: String,
    pub shop_address: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PdfResponse {
    pub pdf_base64: String,
    pub filename: String,
    pub size_bytes: usize,
}
