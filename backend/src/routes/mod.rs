use axum::Router;

pub mod teams;
pub mod users;

pub fn create_router() -> Router {
    Router::new().nest(
        "/v1/api/",
        Router::new()
            .merge(users::user_router())
            .merge(teams::team_router()),
    )
}
