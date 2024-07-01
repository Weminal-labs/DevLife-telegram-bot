use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Team {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub name: String,
    pub captain_id: ObjectId,
    pub total_token: u64,
    pub total_commit: u64,
    pub total_bugs: u64,
    pub members: Vec<ObjectId>,
    pub followers: u64,
}

#[derive(Serialize, Deserialize)]
pub struct CreateTeamRequest {
    pub team_name: String,
    pub user_id: ObjectId, // captain
}

#[derive(Serialize, Deserialize)]
pub struct InviteUserRequest {
    pub user_email: String,
    pub team_id: ObjectId,
}

#[derive(Serialize, Deserialize)]
pub struct GetTeamByIdRequest {
    pub team_id: ObjectId,
}

impl Team {
    pub fn is_full_users(&self) -> bool {
        self.members.len() == 4
    }

    pub fn is_user_in_team(&self, user_id: ObjectId) -> bool {
        for id in &self.members {
            if *id == user_id {
                return true;
            }
        }
        false
    }
}
