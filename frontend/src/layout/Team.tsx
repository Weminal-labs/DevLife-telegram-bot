import React, { useState } from "react";
import { AuthContextData, useAuth } from "../contexts/AuthProvider";
import { SERVER_URL } from "../constants";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { UpdateTeamResponse, User } from "../types";
import ProfileModal from "../components/ProfileModal";

interface TeamProps {
  updateTeamData: UpdateTeamResponse | undefined;
  setUpdateTeamData: React.Dispatch<
    React.SetStateAction<UpdateTeamResponse | undefined>
  >;
  sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: ReactUnityEventParameter,
    address?: string,
  ) => void;
  address?: string;
}

export const Team = ({
  updateTeamData,
  setUpdateTeamData,
  sendMessage,
  address,
}: TeamProps) => {
  console.log("Address Team:", address);

  const [teamName, setTeamName] = useState<string>("");
  const [emailUserInvite, setEmailUserInvite] = useState<string>("");
  const { user, setUser } = useAuth() as AuthContextData;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // data đưa vào Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const members = updateTeamData?.users;

  const handleCreateTeam = async () => {
    console.log("handleCreateTeam");
    // const data = {
    //   team_name: teamName,
    //   user_id: user._id,
    // };
    // socket.emit(SocketClientEvents.CreateTeam, data);

    console.log(user?._id["$oid"], "create team");

    try {
      const resp = await fetch(`${SERVER_URL}/create_team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_name: teamName,
          user_id: user?._id["$oid"],
        }),
      });

      const data: UpdateTeamResponse = await resp.json();

      // @ts-expect-error - type later
      setUser((prev) => {
        return {
          ...prev,
          team_id: {
            $oid: data.team._id["$oid"],
          },
        };
      });

      setUpdateTeamData(data);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUserToGroup = async () => {
    // Logic để thêm user vào nhóm, ví dụ gọi API
    console.log("Adding user to group...");
    // Sau khi thêm thành công, cập nhật state để hiển thị
    // Giả sử đây là response sau khi thêm thành viên mới
    // const newUser: Profile = {
    //   id: 10, // Giả sử ID người dùng hiện tại
    //   name: "User new",
    //   avatarUrl: "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=",
    //   group: "Team",
    //   wallet_address: "0x123456789",
    //   isMentor: true,
    //   ref_list: ["User 2", "User 3"],
    //   groupMembers: [
    //     { id: 4, name: "User 4", role: "Member" },
    //     { id: 5, name: "User 5", role: "Member" },
    //   ],
    // };
    // data khi them mot nguoi choi moi vao team
    // setTeamAvatars([...teamAvatars, newUser]);

    // const resp = await fetch("http://localhost:3000/v1/api/get_user", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     id: user._id["$oid"],
    //   }),
    // });

    // const data = await resp.json();

    // console.log(data)

    // socket.emit(SocketClientEvents.InviteUser, {
    //   team_id: user.team_id["$oid"],
    //   // team_id: data.team_id["$oid"],
    //   user_id: idUserInvite,
    // });

    try {
      const resp = await fetch(`${SERVER_URL}/team_invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_id: user?.team_id["$oid"],
          user_email: emailUserInvite,
        }),
      });

      const data = await resp.json();

      console.log(data);

      const obj = {
        team: {
          name: data.team.name,
          quantity: data.team.members.length,
          total_token: data.team.total_token,
          total_commit: data.team.total_commit,
          total_bug: data.team.total_bugs,
        },
        // @ts-expect-error - later
        users: data.users.map((user) => {
          console.log(user);
          return {
            id: user._id["$oid"],
            name: `${user.firstname} ${user.lastname}`,
            // stamina: user.stamina,
            stamina: 100,
            is_online: user.is_online,
          };
        }),
        id_user_playing: user?._id["$oid"], // replace with id when login
      }; // UpdateTeamResponse (Rust type)

      console.log(obj);

      setUpdateTeamData(data);

      sendMessage("PlayerControll", "receiveJsonTeam", JSON.stringify(obj));
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-1/4 p-2 overflow-hidden overflow-y-scroll">
      <h2 className="text-xl font-bold mb-4 overflow-hidden">Team Name</h2>

      {!user?.team_id && (
        <>
          <div>
            <input
              value={teamName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTeamName(event.target.value);
              }}
              className="bg-white text-black w-full"
              type="text"
            />
          </div>
          <div>
            <button className="my-2 w-full" onClick={handleCreateTeam}>
              Create team
            </button>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-2">
        {/* Ô đầu tiên là chính mình */}

        {/* {isHasTeam &&
	  teamAvatars.map((avatar) => (
		<div
		  key={avatar.id}
		  className="relative cursor-pointer"
		  onClick={() => openModal(avatar)}
		>
		  <img
			src={`${avatar.avatarUrl}${avatar.name}`}
			alt={avatar.name}
			className="w-full h-auto rounded-full mb-1 transition-transform duration-300 hover:scale-110 object-cover"
			style={{ maxHeight: "100px", maxWidth: "100%" }} // Điều chỉnh kích thước tối đa cho ảnh
		  />
		</div>
	  ))} */}

        {members &&
          members?.length > 0 &&
          members.map((member) => (
            <div
              key={member._id["$oid"]}
              className="relative cursor-pointer"
              onClick={() => openModal(member)}
            >
              <img
                src={member.image}
                alt={member.firstname}
                className="w-full h-auto rounded-full mb-1 transition-transform duration-300 hover:scale-110 object-cover"
                style={{ maxHeight: "100px", maxWidth: "100%" }} // Điều chỉnh kích thước tối đa cho ảnh
              />
            </div>
          ))}
      </div>
      {/* Nếu team chưa đầy, hiển thị nút '+' để thêm user */}
      {members && members?.length <= 3 && (
        <div className="mt-2 w-full">
          <input
            alt="User id"
            className="bg-white text-black w-full"
            type="text"
            value={emailUserInvite}
            onChange={(evt) => {
              setEmailUserInvite(evt.target.value);
            }}
          />
          <span
            className="flex justify-center items-center w-8 h-auto rounded-full bg-dark p-1 transition-transform duration-300 hover:scale-110 border border-solid border-sky-50"
            onClick={handleAddUserToGroup}
            style={{ maxHeight: "100px", maxWidth: "100%" }} // Điều chỉnh kích thước tối đa cho ảnh
          >
            +
          </span>
        </div>
      )}

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(!isModalOpen)}
        user={selectedUser}
        currentUser={user}
        addressUser={address}
      />
    </div>
  );
};
