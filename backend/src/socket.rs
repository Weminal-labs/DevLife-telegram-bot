use handler::{handle_create_team, handle_create_user, handle_update_data_dev};
use socketioxide::extract::SocketRef;
use tracing::info;

pub async fn on_connect(socket: SocketRef) {
    info!("socket connected {}", socket.id);

    socket.on("update-data-dev", handle_update_data_dev);
    socket.on("create-user", handle_create_user);
    socket.on("create-team", handle_create_team);
    socket.on("invite-user", handler::handle_invite_user);
}

mod handler {
    use axum::Extension;
    use futures::stream::StreamExt;
    use mongodb::{
        bson::{doc, oid::ObjectId, to_document},
        Database,
    };
    use socketioxide::extract::{Data, SocketRef};

    use crate::{
        controllers::users_controller::generate_link,
        error::Error,
        models::{
            team_model::{CreateTeamRequest, InviteUserRequest, Team},
            users_model::User,
        },
    };

    use super::model::{CreateUserRequest, UpdateDataDevRequest, UpdateTeamResponse};

    pub async fn handle_update_data_dev(socket: SocketRef, Data(data): Data<UpdateDataDevRequest>) {
        let db = socket
            .req_parts()
            .extensions
            .get::<Database>()
            .ok_or_else(|| Error::DatabaseConnectionFailed)
            .unwrap();

        let user_collection = db.collection::<User>("users");
        let team_collection = db.collection::<Team>("teams");

        // Get user
        let mut user = match user_collection
            .find_one(
                doc! {
                    "_id": data.id_player
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
        team.total_bugs += data.bugs;
        team.total_commit += data.commits;
        user.stamina += data.stamina;
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

        socket.emit("update-team", resp).ok();
    }

    pub async fn handle_create_user(socket: SocketRef, Data(data): Data<CreateUserRequest>) {
        let db = socket
            .req_parts()
            .extensions
            .get::<Database>()
            .ok_or_else(|| Error::DatabaseConnectionFailed)
            .unwrap();

        let collection = db.collection::<User>("users");

        let mut new_user = User {
            id: ObjectId::new(),
            wallet_address: data.wallet_address,
            firstname: Some(data.given_name),
            lastname: Some(data.family_name),
            email: Some(data.email),
            image: Some(data.picture),
            team_id: None,
            refs: Some(vec![]),
            stamina: 100,
            is_online: true,
            refs_link: None,
            refs_as: None,
        };

        let _ = collection.insert_one(new_user.clone(), None).await;

        // generate link ref can do in front end do not need in backend

        // Sau khi thêm user thành công, tạo link và cập nhật user
        let link = generate_link(Extension(db.clone()), new_user.id.clone())
            .await
            .unwrap();

        // Cập nhật user với refs_link đã được tạo
        let update_result = collection
            .update_one(
                doc! {"_id": new_user.id.clone()},
                doc! {"$set": {"refs_link": link.clone()}},
                None,
            )
            .await
            .unwrap();

        new_user.refs_link = Some(link);

        socket.emit("create-user-response", new_user).ok();
    }

    pub async fn handle_create_team(socket: SocketRef, Data(data): Data<CreateTeamRequest>) {
        let db = socket
            .req_parts()
            .extensions
            .get::<Database>()
            .ok_or_else(|| Error::DatabaseConnectionFailed)
            .unwrap();

        let team_collection = db.collection::<Team>("teams");
        let user_collection = db.collection::<User>("users");

        let new_team = Team {
            id: ObjectId::new(),
            total_token: 0,
            total_commit: 0,
            total_bugs: 0,
            name: data.team_name,
            captain_id: data.user_id,
            members: vec![data.user_id],
            followers: 0,
        };

        let insert_result = team_collection
            .insert_one(new_team.clone(), None)
            .await
            .unwrap();
        let mut user = match user_collection
            .find_one(
                doc! {
                    "_id": data.user_id
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
            .find_one_and_update(doc! {"_id": data.user_id}, user_doc, None)
            .await
        {
            Ok(user) => println!("User updated successfully"),
            Err(e) => panic!("Error updating user: {}", e),
        }

        let resp = UpdateTeamResponse {
            team: new_team,
            users: vec![user],
        };

        socket.emit("update-team", resp).ok();
    }

    pub async fn handle_invite_user(socket: SocketRef, Data(data): Data<InviteUserRequest>) {
        let db = socket
            .req_parts()
            .extensions
            .get::<Database>()
            .ok_or_else(|| Error::DatabaseConnectionFailed)
            .unwrap();

        let collection = db.collection::<Team>("teams");
        let filter = doc! {"_id": data.team_id.clone()};
        // let is_exists = check_user_exists(&db, data.user_id).await?;

        // error here
        // if !is_exists {
        //     return Err(APIError {
        //         message: "User not exist in the database".to_string(),
        //         status_code: StatusCode::CONFLICT,
        //     });
        // }
        let team_result = collection.find_one(filter, None).await;

        if let Some(mut team) = team_result.unwrap() {
            // let is_team_exists = check_team_exists(&db, team.id).await?;
            // if !is_team_exists {
            //     return Err(APIError {
            //         message: "Team not exist in the database".to_string(),
            //         status_code: StatusCode::CONFLICT,
            //     });
            // }

            //check wheather team is full
            // if team.is_full_users() {
            //     return Err(APIError {
            //         message: "Team is full".to_string(),
            //         status_code: StatusCode::CONFLICT,
            //     });
            // }

            let user_collection = db.collection::<User>("users");

            let user_result = user_collection
                .find_one(doc! {"email": data.user_email.clone()}, None)
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
                    .update_one(doc! {"email": data.user_email}, update, None)
                    .await;
                res.unwrap().modified_count;

                let res = collection
                    .replace_one(doc! {"_id": data.team_id.clone()}, team, None)
                    .await;
            };
        }

        let team_collection = db.collection::<Team>("teams");

        let mut team2 = match team_collection
            .find_one(
                doc! {
                    "_id": data.team_id
                },
                None,
            )
            .await
            .unwrap()
        {
            Some(user) => user,
            None => panic!("No user found"),
        };

        let user_collection = db.collection::<User>("users");

        let filter = doc! { "_id": { "$in": team2.clone().members } };

        let mut cursor = user_collection.find(filter, None).await.unwrap();

        let mut users: Vec<User> = vec![];

        while let Some(doc) = cursor.next().await {
            if let Ok(user) = doc {
                users.push(user);
            }
        }

        let resp = UpdateTeamResponse { team: team2, users };

        socket.emit("update-team", resp).ok();
    }
}

pub mod model {
    use mongodb::bson::oid::ObjectId;
    use serde::{Deserialize, Serialize};

    use crate::models::{team_model::Team, users_model::User};

    #[derive(Debug, Deserialize, Serialize)]
    pub struct UpdateDataDevRequest {
        pub id_player: ObjectId,
        pub commits: u64,
        pub bugs: u64,
        pub stamina: i32,
    }

    #[derive(Debug, Deserialize)]
    pub struct CreateUserRequest {
        pub email: String,
        pub picture: String,
        pub family_name: String,
        pub given_name: String,
        pub wallet_address: String,
    }

    #[derive(Debug, Serialize, Deserialize)]
    pub struct CreateUserResponse {
        pub user: User,
    }

    #[derive(Debug, Serialize)]
    pub struct UpdateTeamResponse {
        pub team: Team,
        pub users: Vec<User>,
        // id_user_playing: ObjectId, handle in front-end
    }
}
