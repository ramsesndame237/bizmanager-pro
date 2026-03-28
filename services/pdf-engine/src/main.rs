mod handlers;
mod models;
mod pdf;
mod error;

use axum::{
    routing::{get, post},
    Router,
};
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "pdf_engine=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = Router::new()
        .route("/health", get(handlers::health))
        .route("/generate/invoice", post(handlers::generate_invoice))
        .route("/generate/quote", post(handlers::generate_quote))
        .route("/generate/payslip", post(handlers::generate_payslip))
        .route("/generate/repair-ticket", post(handlers::generate_repair_ticket))
        .route("/generate/report/:report_type", post(handlers::generate_report))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{port}");

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    info!("PDF engine listening on {addr}");

    axum::serve(listener, app).await?;
    Ok(())
}
