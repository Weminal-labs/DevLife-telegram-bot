use crate::{
    middlewares::error::APIError,
    models::{
        team_model::{CreateTeamRequest, GetTeamByIdRequest, InviteUserRequest, Team},
        users_model::User,
    },
    socket::model::UpdateTeamResponse,
};
use axum::{http::StatusCode, response::IntoResponse, Extension, Json};
use futures::stream::StreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId, to_document},
    Database,
};
use serde_json::json;

pub async fn create_team(
    Extension(db): Extension<Database>,
    Json(payload): Json<CreateTeamRequest>,
) -> Result<Json<UpdateTeamResponse>, APIError> {
    // => check wheather user in team before

    let team_collection = db.collection::<Team>("teams");
    let user_collection = db.collection::<User>("users");

    let new_team = Team {
        id: ObjectId::new(),
        total_token: 0,
        total_commit: 0,
        total_bugs: 0,
        name: payload.team_name,
        captain_id: payload.user_id,
        members: vec![payload.user_id],
        followers: 0,
    };

    let insert_result = team_collection
        .insert_one(new_team.clone(), None)
        .await
        .unwrap();
    let mut user = match user_collection
        .find_one(
            doc! {
                "_id": payload.user_id
            },
            None,
        )
        .await
        .unwrap()
    {
        Some(user) => user,
        None => panic!("No user found"),
    };

    // update team_id of captain
    user.team_id = Some(insert_result.inserted_id.as_object_id().unwrap().clone());

    let user_doc = to_document(&user).unwrap();
    let user_doc = doc! {"$set": user_doc};
    match user_collection
        .find_one_and_update(doc! {"_id": payload.user_id}, user_doc, None)
        .await
    {
        Ok(user) => println!("User updated successfully"),
        Err(e) => panic!("Error updating user: {}", e),
    }

    let collection = db.collection::<Team>("teams");
    let filter = doc! {"_id": new_team.id};
    let team = collection.find_one(filter, None).await.unwrap().unwrap();

    let user_collection = db.collection::<User>("users");

    let filter = doc! { "_id": { "$in": team.clone().members } };

    let mut cursor = user_collection.find(filter, None).await.unwrap();

    let mut users: Vec<User> = vec![];

    while let Some(doc) = cursor.next().await {
        if let Ok(user) = doc {
            users.push(user);
        }
    }

    let resp = UpdateTeamResponse { team, users };

    Ok(Json(resp))
}

pub async fn get_team_by_id(
    Extension(db): Extension<Database>,
    Json(payload): Json<GetTeamByIdRequest>,
) -> Result<Json<UpdateTeamResponse>, APIError> {
    let collection = db.collection::<Team>("teams");
    let filter = doc! {"_id": payload.team_id};
    let team = collection.find_one(filter, None).await;

    match team {
        Ok(Some(team)) => {
            let user_collection = db.collection::<User>("users");

            let filter = doc! { "_id": { "$in": team.clone().members } };

            let mut cursor = user_collection.find(filter, None).await.unwrap();

            let mut users: Vec<User> = vec![];

            while let Some(doc) = cursor.next().await {
                if let Ok(user) = doc {
                    users.push(user);
                }
            }

            let resp = UpdateTeamResponse { team, users };
            Ok(Json(resp))
        }
        Ok(None) => Err(APIError {
            message: "Team not found".to_string(),
            status_code: StatusCode::NOT_FOUND,
        }),
        Err(e) => Err(APIError {
            message: format!("Database error: {}", e),
            status_code: StatusCode::INTERNAL_SERVER_ERROR,
        }),
    }
}

pub async fn invite_user(
    Extension(db): Extension<Database>,
    Json(payload): Json<InviteUserRequest>,
) -> Result<Json<UpdateTeamResponse>, APIError> {
    let collection = db.collection::<Team>("teams");
    let filter = doc! {"_id": payload.team_id.clone()};
    let is_exists = check_user_exists_by_email(&db, payload.user_email.clone()).await?;

    // error here
    if !is_exists {
        return Err(APIError {
            message: "User not exist in the database".to_string(),
            status_code: StatusCode::CONFLICT,
        });
    }
    let team_result = collection.find_one(filter.clone(), None).await;

    if let Some(mut team) = team_result.unwrap() {
        let is_team_exists = check_team_exists(&db, team.id).await?;
        if !is_team_exists {
            return Err(APIError {
                message: "Team not exist in the database".to_string(),
                status_code: StatusCode::CONFLICT,
            });
        }

        //check wheather team is full
        if team.is_full_users() {
            return Err(APIError {
                message: "Team is full".to_string(),
                status_code: StatusCode::CONFLICT,
            });
        }

        let user_collection = db.collection::<User>("users");

        let user_result = user_collection
            .find_one(doc! {"email": payload.user_email.clone()}, None)
            .await;

        if let Some(user) = user_result.unwrap() {
            team.members.push(user.id);

            // => update user info (team_id)
            let update = doc! {
                "$set":{
                "team_id": team.id.clone(),
                }
            };
            let res = user_collection
                .update_one(doc! {"email": payload.user_email}, update, None)
                .await;
            res.unwrap().modified_count;
            let res = collection
                .replace_one(doc! {"_id": payload.team_id.clone()}, team, None)
                .await;
            println!("Replaced documents: {}", res.unwrap().modified_count);
        };
    }

    let team = collection.find_one(filter, None).await;

    match team {
        Ok(Some(team)) => {
            let user_collection = db.collection::<User>("users");

            let filter = doc! { "_id": { "$in": team.clone().members } };

            let mut cursor = user_collection.find(filter, None).await.unwrap();

            let mut users: Vec<User> = vec![];

            while let Some(doc) = cursor.next().await {
                if let Ok(user) = doc {
                    users.push(user);
                }
            }

            let resp = UpdateTeamResponse { team, users };
            Ok(Json(resp))
        }
        Ok(None) => Err(APIError {
            message: "Team not found".to_string(),
            status_code: StatusCode::NOT_FOUND,
        }),
        Err(e) => Err(APIError {
            message: format!("Database error: {}", e),
            status_code: StatusCode::INTERNAL_SERVER_ERROR,
        }),
    }
}

async fn check_team_exists(db: &Database, id: ObjectId) -> Result<bool, APIError> {
    let collection = db.collection::<Team>("teams");
    let filter = doc! { "_id": id };

    match collection.find_one(filter, None).await {
        Ok(Some(_)) => Ok(true),
        Ok(None) => Ok(false),
        Err(e) => Err(APIError {
            message: format!("Database error: {}", e),
            status_code: StatusCode::INTERNAL_SERVER_ERROR,
        }),
    }
}

async fn check_user_exists(db: &Database, id: ObjectId) -> Result<bool, APIError> {
    let collection = db.collection::<User>("users");
    let filter = doc! { "_id": id };

    match collection.find_one(filter, None).await {
        Ok(Some(_)) => Ok(true),
        Ok(None) => Ok(false),
        Err(e) => Err(APIError {
            message: format!("Database error: {}", e),
            status_code: StatusCode::INTERNAL_SERVER_ERROR,
        }),
    }
}

async fn check_user_exists_by_email(db: &Database, email: String) -> Result<bool, APIError> {
    let collection = db.collection::<User>("users");
    let filter = doc! { "email": email };

    match collection.find_one(filter, None).await {
        Ok(Some(_)) => Ok(true),
        Ok(None) => Ok(false),
        Err(e) => Err(APIError {
            message: format!("Database error: {}", e),
            status_code: StatusCode::INTERNAL_SERVER_ERROR,
        }),
    }
}
