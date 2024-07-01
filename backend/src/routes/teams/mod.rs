use axum::{
    routing::{get, post},
    Router,
};

use crate::controllers::team_controller::{create_team, invite_user, get_team_by_id};

pub fn team_router() -> Router {
    Router::new()
        .route("/team_invite", post(invite_user))
        .route("/create_team", post(create_team))
        .route("/get_team_by_id", post(get_team_by_id))
}
