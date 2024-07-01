use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;
use thiserror::Error;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Database connection failed")]
    DatabaseConnectionFailed,

    #[error("{0}")]
    Other(String),
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        #[derive(Serialize)]
        struct ErrorResponse {
            code: String,
            message: String,
        }

        let msg = match self {
            Error::DatabaseConnectionFailed => self.to_string(),
            Error::Other(_) => self.to_string(),
        };
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                code: "500".to_string(),
                message: msg,
            }),
        )
            .into_response()
    }
}
