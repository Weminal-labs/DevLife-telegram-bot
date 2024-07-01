import React from "react";
import { Team } from "./Team";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { UpdateTeamResponse } from "../types";

interface ConnectLocksProps {
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
  address?: string; // Thêm thuộc tính address
}

const ConnectLocks = ({
  updateTeamData,
  setUpdateTeamData,
  sendMessage,
  address,
}: ConnectLocksProps) => {
  console.log("Address ConnectLocks:", address);


  return (
    <div className="mt-2 p-2 light-bg ">
      {/* Left side */}
      <div className="flex mb-2 h-full">
        <Team
          updateTeamData={updateTeamData}
          setUpdateTeamData={setUpdateTeamData}
          sendMessage={sendMessage}
          address={address}
        />

        {/*<div className="self-center mx-2 border-r border-white h-[60%]"></div>*/}
        {/* Right side */}
        {/* <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(!isModalOpen)}
          user={selectedUser}
          currentUser={currentUser}
        /> */}
      </div>
    </div>
  );
};
export default ConnectLocks;
