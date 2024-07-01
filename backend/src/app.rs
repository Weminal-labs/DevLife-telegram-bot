use std::env;

use axum::http::header::CONTENT_TYPE;
use axum::http::HeaderValue;
use axum::{Extension, Router};
use socketioxide::SocketIo;
use tower::ServiceBuilder;
use tower_http::cors::{Any, CorsLayer};
use tower_http::{compression::CompressionLayer, trace::TraceLayer};

use crate::db::init_mongodb::connect;
use crate::error::{Error, Result};
use crate::routes::create_router;
use crate::socket::on_connect;

pub async fn get_app() -> Result<Router> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    // init db
    let client = connect().await?;

    let database_name = env::var("DATABASE_NAME").map_err(|e| Error::Other(e.to_string()))?;
    let db = client.database(database_name.as_str());

    // init socketio
    let (socket_layer, io) = SocketIo::new_layer();

    io.ns("/", on_connect);

    // init routes
    let app = create_router().layer(
        // init middlewares
        ServiceBuilder::new()
            .layer(
                CorsLayer::new()
                    .allow_origin(Any)
                    .allow_methods(Any)
                    .allow_headers([CONTENT_TYPE]),
            )
            .layer(CompressionLayer::new())
            // .layer(TraceLayer::new_for_http())
            .layer(Extension(db))
            .layer(socket_layer),
    );

    Ok(app)
}
