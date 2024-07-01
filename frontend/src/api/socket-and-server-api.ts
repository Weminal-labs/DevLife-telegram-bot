import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { SERVER_URL } from "../constants";
// import { SocketClientEvents } from "../enums";
// import { socket } from "../socket";
import { updateTeamRespToDataMatchInGame } from "../utils";
import { RedirectResult, UpdateTeamResponse } from "../types";

/**
 *
 * @param {string} data - The data from the Unity game, format JSON
 */
export async function updateDataDev(
  data: string,
  sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: ReactUnityEventParameter
  ) => void,
  setUpdateTeamData: React.Dispatch<
    React.SetStateAction<UpdateTeamResponse | undefined>
  >,
  id_user_playing: string
) {
  console.log("updateDataDev", data);
  // socket.emit(SocketClientEvents.UpdateDataDev, JSON.parse(data)); // Send data to the server

  const resp = await fetch(`${SERVER_URL}/update_data_dev`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });

  const respData = await resp.json();

  const obj = updateTeamRespToDataMatchInGame(respData, id_user_playing);

  setUpdateTeamData(respData);

  sendMessage("PlayerControll", "receiveJsonTeam", JSON.stringify(obj));
}

/**
 *
 * @param redirectResult - The data from login function
 * @param address - The wallet address from login function
 */
export async function createUser(
  redirectResult: RedirectResult,
  address: string
) {
  try {
    const createUserRequest = {
      email: redirectResult.oauth.userInfo.email,
      picture: redirectResult.oauth.userInfo.picture,
      family_name: redirectResult.oauth.userInfo.familyName,
      given_name: redirectResult.oauth.userInfo.givenName,
      wallet_address: address,
    };

    const resp = await fetch(`${SERVER_URL}/create_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createUserRequest),
    });

    const respData = await resp.json();

    console.log(respData);
  } catch (error) {
    console.log("createUser", error);
  }

  // socket.emit(SocketClientEvents.CreateUser, createUserRequest);
}
