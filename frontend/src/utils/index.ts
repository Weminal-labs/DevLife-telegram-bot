import { UpdateTeamDataUnity, UpdateTeamResponse } from "../types";

export function updateTeamRespToDataMatchInGame(
  data: UpdateTeamResponse,
  id_user_playing: string
): UpdateTeamDataUnity {
  const obj = {
    team: {
      name: data.team.name,
      quantity: data.team.members.length,
      total_token: data.team.total_token,
      total_commit: data.team.total_commit,
      total_bug: data.team.total_bugs,
    },
    users: data.users.map((user) => {
      return {
        id: user._id["$oid"],
        name: `${user.firstname}`,
        stamina: user.stamina,
        is_online: user.is_online,
      };
    }),
    id_user_playing,
  };

  return obj;
}
