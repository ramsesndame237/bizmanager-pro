use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum PdfError {
    #[error("PDF generation failed: {0}")]
    Generation(String),
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
}

impl IntoResponse for PdfError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            PdfError::InvalidInput(msg) => (StatusCode::BAD_REQUEST, msg.clone()),
            PdfError::Generation(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg.clone()),
            PdfError::Io(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
        };

        (status, Json(json!({ "error": message }))).into_response()
    }
}
