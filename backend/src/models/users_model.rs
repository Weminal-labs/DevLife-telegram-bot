use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub wallet_address: String,
    pub email: Option<String>,
    pub team_id: Option<ObjectId>, // Team
    pub image: Option<String>,
    pub refs: Option<Vec<ObjectId>>, // Refs
    pub refs_as: Option<String>,
    pub refs_link: Option<String>,
    pub stamina: i32,
    pub is_online: bool,
}

#[derive(Serialize, Deserialize)]
pub struct CreateUserRequest {
    pub email: String,
    pub picture: String,
    pub family_name: String,
    pub given_name: String,
    pub wallet_address: String,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateUserRequest {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub email: Option<String>,
    pub team_id: Option<ObjectId>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DeleteUserRequest {
    #[serde(rename = "_id")]
    pub id: ObjectId,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GetUserRequest {
    #[serde(rename = "_id")]
    pub id: ObjectId,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GetUserByEmailRequest {
    pub email: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct UserDTO {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub email: Option<String>,
    pub team_id: Option<ObjectId>,
    pub image: Option<String>,
    pub wallet_address: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GenerateLinkReq {
    pub id: Option<ObjectId>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GenerateLinkResponse {
    pub generate_link: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct InviteRefUpdate {
    pub initiator_id: ObjectId,
    pub participant_id: ObjectId,
}

#[derive(Serialize, Deserialize, Debug, Clone)]

pub struct UpdateDataDevRequest {
    pub id_player: ObjectId,
    pub commits: u64,
    pub bugs: u64,
    pub stamina: i32,
}
