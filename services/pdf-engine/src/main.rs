use axum::{
    extract::Json,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::CorsLayer;

#[derive(Debug, Serialize)]
struct HealthResponse {
    status: String,
    version: String,
}

#[derive(Debug, Deserialize)]
struct PdfRequest {
    template: String,
    data: serde_json::Value,
}

#[derive(Debug, Serialize)]
struct PdfResponse {
    url: String,
}

async fn health() -> impl IntoResponse {
    Json(HealthResponse {
        status: "ok".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn generate_pdf(_payload: Json<PdfRequest>) -> impl IntoResponse {
    // TODO: Implement PDF generation (Issue #18)
    (
        StatusCode::NOT_IMPLEMENTED,
        Json(serde_json::json!({ "error": "PDF generation not yet implemented" })),
    )
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".to_string()),
        )
        .init();

    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("PORT must be a valid number");

    let app = Router::new()
        .route("/health", get(health))
        .route("/pdf/generate", post(generate_pdf))
        .layer(CorsLayer::permissive());

    let addr = format!("0.0.0.0:{port}");
    tracing::info!("PDF engine listening on {addr}");

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
