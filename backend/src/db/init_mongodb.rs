use std::env;

use mongodb::{options::ClientOptions, Client};

use crate::error::{Error, Result};

pub async fn connect() -> Result<Client> {
    let connection_string = env::var("DATABASE_URL").map_err(|e| Error::Other(e.to_string()))?;

    let client_options = ClientOptions::parse(connection_string)
        .await
        .map_err(|_| Error::DatabaseConnectionFailed)?;

    let client = Client::with_options(client_options).unwrap();

    Ok(client)
}
