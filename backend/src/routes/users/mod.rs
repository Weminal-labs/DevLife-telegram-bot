use axum::{
    routing::{get, post},
    Router,
};

use crate::controllers::users_controller::{
    create_user, delete_user, get_user_by_email, get_user_id, update_data_dev, update_ref,
    update_user,
};

pub fn user_router() -> Router {
    Router::new()
        .route("/create_user", post(create_user))
        .route("/delete_user", post(delete_user))
        .route("/get_user", post(get_user_id))
        .route("/update_user", post(update_user))
        .route("/update_ref", post(update_ref))
        .route("/get_user_by_email", post(get_user_by_email))
        .route("/update_data_dev",post(update_data_dev))
}
