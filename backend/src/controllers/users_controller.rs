use std::env;

use crate::{
    middlewares::error::APIError,
    models::{
        team_model::Team,
        users_model::{
            CreateUserRequest, DeleteUserRequest, GenerateLinkReq, GenerateLinkResponse,
            GetUserByEmailRequest, GetUserRequest, InviteRefUpdate, UpdateDataDevRequest,
            UpdateUserRequest, User,
        },
    },
    socket::model::UpdateTeamResponse,
};
use axum::{http::StatusCode, response::IntoResponse, Extension, Json};
use dotenv::dotenv;
use futures::StreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId, to_document},
    Database,
};
use serde_json::json;
pub async fn create_user(
    Extension(db): Extension<Database>,
    Json(payload): Json<CreateUserRequest>,
) -> Result<impl IntoResponse, APIError> {
    let collection = db.collection::<User>("users");

    let mut new_user = User {
        id: ObjectId::new(),
        wallet_address: payload.wallet_address,
        firstname: Some(payload.given_name),
        lastname: Some(payload.family_name),
        email: Some(payload.email),
        image: Some(payload.picture),
        team_id: None,
        refs: Some(vec![]),
        stamina: 100,
        is_online: true,
        refs_link: None,
        refs_as: None,
    };

    match collection.insert_one(new_user.clone(), None).await {
        Ok(_) => {
            // Sau khi thêm user thành công, tạo link và cập nhật user
            let link = generate_link(Extension(db.clone()), new_user.id.clone()).await?;

            // Cập nhật user với refs_link đã được tạo
            let update_result = collection
                .update_one(
                    doc! {"_id": new_user.id.clone()},
                    doc! {"$set": {"refs_link": link}},
                    None,
                )
                .await;

            match update_result {
                Ok(_) => Ok(Json(json!({
                    "message": "User created successfully"
                }))),
                Err(e) => Err(APIError {
                    message: format!("Failed to update user: {}", e.to_string()),
                    status_code: StatusCode::INTERNAL_SERVER_ERROR,
                }),
            }
        }
        Err(e) => Err(APIError {
            message: format!("Database error: {}", e.to_string()),
            status_code: StatusCode::INTERNAL_SERVER_ERROR,
        }),
    }
}

pub async fn update_user(
    Extension(db): Extension<Database>,
    Json(payload): Json<UpdateUserRequest>,
) -> Result<impl IntoResponse, APIError> {
    let collection = db.collection::<User>("users");

    let is_exist = check_user_exists(&db, payload.id).await?;
    if !is_exist {
        return Err(APIError {
            message: "User not exist in database".to_string(),
            status_code: StatusCode::NOT_FOUND,
        });
    }

    let update = doc! {
        "$set":{
        "firstname": payload
        .firstname,
        "lastname" : payload
        .lastname,
        "email": payload
        .email,
        "team_id": payload
        .team_id,
        }
    };

    let filter = doc! {"_id": payload.id.clone()};

    match collection.update_one(filter, update, None).await {
        Ok(update_result) => {
            if update_result.modified_count == 1 {
                Ok(Json(json!({
                    "message": "User updated successfully"
                })))
            } else {
                Err(APIError {
                    message: "User not found".to_string(),
                    status_code: StatusCode::NOT_FOUND,
                })
            }
        }
        Err(e) => Err(APIError {
            message: format!("Database error: {}", e.to_string()),
            status_code: StatusCode::INTERNAL_SERVER_ERROR,
        }),
    }
}
pub async fn delete_user(
    Extension(db): Extension<Database>,
    Json(payload): Json<DeleteUserRequest>,
) -> Result<impl IntoResponse, APIError> {
    let collection = db.collection::<User>("users");
    let filter = doc! {"_id": payload.id.clone()};
    let is_exist = check_user_exists(&db, payload.id).await?;
    if !is_exist {
        return Err(APIError {
            message: "User not exist in database".to_string(),
            status_code: StatusCode::NOT_FOUND,
        });
    }
    match collection.delete_one(filter, None).await {
        Ok(delete_result) => {
            if delete_result.deleted_count == 1 {
                Ok(Json(json!(
                    {
                        "message": "User deleted successfully"
                    }
                )))
            } else {
                // No document matched the filter
                Err(APIError {
                    message: "User not found".to_string(),
                    status_code: StatusCode::NOT_FOUND,
                })
            }
        }
        Err(e) => {
            eprintln!("Database error: {:?}", e.to_string());
            Err(APIError {
                message: "Failed to delete user".to_string(),
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
            })
        }
    }
}

pub async fn get_user_id(
    Extension(db): Extension<Database>,
    Json(payload): Json<GetUserRequest>,
) -> Result<impl IntoResponse, APIError> {
    let collection = db.collection::<User>("users");
    let filter = doc! {"_id":payload.id.clone()};
    let is_exists = check_user_exists(&db, payload.id).await?;
    if !is_exists {
        return Err(APIError {
            message: "User not exist in database".to_string(),
            status_code: StatusCode::NOT_FOUND,
        });
    }
    match collection.find_one(filter, None).await {
        Ok(Some(user)) => Ok(Json(user)),
        Ok(None) => Err(APIError {
            message: "User not found".to_string(),
            status_code: StatusCode::NOT_FOUND,
        }),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            Err(APIError {
                message: "Failed to find user".to_string(),
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
            })
        }
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

pub async fn get_user_by_email(
    Extension(db): Extension<Database>,
    Json(payload): Json<GetUserByEmailRequest>,
) -> Result<impl IntoResponse, APIError> {
    let collection = db.collection::<User>("users");
    let filter = doc! {"email": payload.email.clone()};
    let is_exists = check_user_exists_by_email(&db, payload.email).await?;
    if !is_exists {
        return Err(APIError {
            message: "User not exist in database".to_string(),
            status_code: StatusCode::NOT_FOUND,
        });
    }
    match collection.find_one(filter, None).await {
        Ok(Some(user)) => Ok(Json(json!({
            "user": user,
        }))),
        Ok(None) => Err(APIError {
            message: "User not found".to_string(),
            status_code: StatusCode::NOT_FOUND,
        }),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            Err(APIError {
                message: "Failed to find user".to_string(),
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
            })
        }
    }
}

pub async fn generate_link(
    Extension(db): Extension<Database>,
    id: ObjectId,
) -> Result<String, APIError> {
    let collection = db.collection::<User>("users");
    let filter = doc! {"_id": id.clone()};

    match collection.find_one(filter, None).await {
        Ok(Some(user_data)) => {
            dotenv().ok();
            let domain_url = env::var("DOMAIN_URL").expect("DOMAIN_URL must be set");

            let link = format!("{}/user/{}", domain_url, id.to_string());

            Ok(link)
        }
        Ok(None) => Err(APIError {
            message: "User not found".to_string(),
            status_code: StatusCode::NOT_FOUND,
        }),
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            Err(APIError {
                message: "Failed to find user".to_string(),
                status_code: StatusCode::INTERNAL_SERVER_ERROR,
            })
        }
    }
}
// pub async fn generate_link(db: &Database, user_id: &str) -> Option<String> {
//     dotenv().ok();
//     let domain_url = env::var("DOMAIN_URL").expect("DOMAIN_URL must be set");
//     let collection = db.collection::<User>("users");
//     let filter = doc! {"_id": user_id };

//     match collection.find_one(filter, None).await {
//         Ok(Some(user_data)) => {
//             let link = format!("{}/user/{}", domain_url, user_data.id.to_string());
//             Some(link)
//         }

//         _ => {
//             eprintln!("User not found or database error");
//             None
//         }
//     }
// }
async fn check_id_exists(db: &Database, id: Option<&ObjectId>) -> Result<bool, APIError> {
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
pub async fn update_ref(
    Extension(db): Extension<Database>,
    Json(payload): Json<InviteRefUpdate>,
) -> Result<(), APIError> {
    let collection = db.collection::<User>("users");
    let update_initiator_result = collection
        .update_one(
            doc! {"_id": payload.initiator_id },
            // doc! {"$set": {"refs_link": payload.initiator_id.to_string()}}, // Giả sử refs_link là String
            doc! { "$push": { "refs": payload.participant_id } },
            None,
        )
        .await
        .map_err(|e| APIError {
            message: format!("Lỗi khi cập nhật initiator: {}", e),
            status_code: StatusCode::INTERNAL_SERVER_ERROR,
        })?;
    let update_participant_result = collection
        .update_one(
            doc! {"_id": payload.participant_id },
            // doc! {"$set": {"refs_as": payload.initiator_id}},
            doc! {"$set":{"refs_as":payload.initiator_id}},
            None,
        )
        .await
        .map_err(|e| APIError {
            message: format!("Lỗi khi cập nhật participant: {}", e),
            status_code: StatusCode::INTERNAL_SERVER_ERROR,
        })?;
    Ok(())
}

// pub async fn ref_user(
//     Extension(db): Extension<Database>,
//     Json(payload):Json<InviteRefUpdate>
// ) -> Result<(), APIError> {
//     let collection = db.collection::<User>("users");
//     let initiator_id = payload.initiator_id;
//     let participant_id = payload.participant_id;
//     // Bước 1: Cập nhật ref_as của người tham gia
//     let filter_participant = doc! { "_id": participant_id };
//     let update_participant = doc! { "$set": { "ref_as": Some(initiator_id) } };

//     let update_ref_as_result = collection.update_one(
//         filter_participant.clone(),
//         update_participant,
//         None,
//     ).await;

//     match update_ref_as_result {
//         Ok(result) if result.modified_count > 0 => {
//             // Bước 2: Nếu cập nhật ref_as thành công, cập nhật user_list của người khởi tạo
//             let filter_initiator = doc! { "_id": initiator_id };
//             let update_initiator = doc! { "$push": { "user_list": participant_id } };

//             let update_user_list_result = collection.update_one(
//                 filter_initiator,
//                 update_initiator,
//                 None,
//             ).await;

//             match update_user_list_result {
//                 Ok(result) if result.modified_count > 0 => {
//                     // Cả hai cập nhật đều thành công
//                     Ok(())
//                 },
//                 Ok(_) | Err(_) => {
//                     // Nếu cập nhật user_list thất bại, roll back (cập nhật lại ref_as về None)
//                     let rollback_update = doc! { "$set": { "ref_as":  None::<ObjectId> } };
//                     let _ = collection.update_one(
//                         filter_participant,
//                         rollback_update,
//                         None,
//                     ).await;

//                     Err(APIError {
//                         message: "Failed to update user_list, rolled back ref_as".to_string(),
//                         status_code: StatusCode::INTERNAL_SERVER_ERROR,
//                     })
//                 }
//             }
//         },
//         Ok(_) | Err(_) => {
//             // Nếu cập nhật ref_as thất bại
//             Err(APIError {
//                 message: "Failed to update ref_as".to_string(),
//                 status_code: StatusCode::INTERNAL_SERVER_ERROR,
//             })
//         }
//     }
// }

pub async fn update_data_dev(
    Extension(db): Extension<Database>,
    Json(payload): Json<UpdateDataDevRequest>,
) -> Result<Json<UpdateTeamResponse>, APIError> {
    let user_collection = db.collection::<User>("users");
    let team_collection = db.collection::<Team>("teams");

    // Get user
    let mut user = match user_collection
        .find_one(
            doc! {
                "_id": payload.id_player
            },
            None,
        )
        .await
        .unwrap()
    {
        Some(user) => user,
        None => panic!("No user found"),
    };

    // Get team of user
    let mut team = match team_collection
        .find_one(
            doc! {
                "_id": user.team_id
            },
            None,
        )
        .await
        .unwrap()
    {
        Some(user) => user,
        None => panic!("No user found"),
    };

    // Update user and team
    team.total_bugs += payload.bugs;
    team.total_commit += payload.commits;
    user.stamina += payload.stamina;
    if user.stamina < 0 {
        user.stamina = 0;
    }

    // update user
    let user_doc = to_document(&user).unwrap();
    let user_doc = doc! {"$set": user_doc};

    match user_collection
        .find_one_and_update(doc! {"_id": user.id}, user_doc, None)
        .await
    {
        Ok(user) => println!("User updated successfully"),
        Err(e) => panic!("Error updating user: {}", e),
    }

    // update team
    let team_doc = to_document(&team).unwrap();
    let team_doc = doc! {"$set": team_doc};

    match team_collection
        .find_one_and_update(doc! {"_id": team.id}, team_doc, None)
        .await
    {
        Ok(user) => println!("User updated successfully"),
        Err(e) => panic!("Error updating user: {}", e),
    }

    // get list user info
    let filter = doc! { "_id": { "$in": team.clone().members } };

    let mut cursor = user_collection.find(filter, None).await.unwrap();

    let mut users: Vec<User> = vec![];

    while let Some(doc) = cursor.next().await {
        if let Ok(user) = doc {
            users.push(user);
        }
    }

    let resp = UpdateTeamResponse {
        team: team,
        users: users,
    };

    Ok(Json(resp))
}
