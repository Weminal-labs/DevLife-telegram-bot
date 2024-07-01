import React, { useEffect, useState } from "react";
import {
  ChangeGroupNameModal,
  ChangeNameModal,
  FindGroupModal,
  LeaveGroupModal,
} from "./ActionModal";
import { ethers } from "ethers";
import { realbuilderSBTabi } from "../abi/RealBuilderSBT";
import { User } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  currentUser?: User; // Người dùng hiện tại đang xem modal
  addressUser?: string; // Địa chỉ ví của team
}

const removeVietnameseTones = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

const ProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  currentUser,
  addressUser,
}) => {
  const [nftImages, setNftImages] = useState<string[]>([]);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const rpcUrl =
          "https://subnets.avacloud.io/d495721e-9157-49c8-90cd-ae9a39d4a68f";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        console.log(provider);

        // Địa chỉ của contract ERC-721
        const erc721ContractAddress =
          "0xaf2159ef7b5C571AE371B0F2b727CB7cA864dC3c";

        // Tạo đối tượng Contract với ERC-721 contract address và ABI
        const contract = new ethers.Contract(
          erc721ContractAddress,
          realbuilderSBTabi,
          provider
        );

        // Gọi hàm getSoulboundNFTs để lấy danh sách các token ID mà địa chỉ ví sở hữu
        const check = await contract.getSoulboundNFTs(addressUser);
        if (check != null) {
          const imageUrl =
            "https://green-necessary-dormouse-499.mypinata.cloud/ipfs/QmWwybBHitTfTDgQMFcK4AYAES1NgXD6moYoa6rMpLXY71?fbclid=IwZXh0bgNhZW0CMTAAAR0w-LUSApyNJ2T6KzXYUJKIYumxglnovLGzXOieHYqUxNsBzsam1X-eNuE_aem_iK-4PlWcNlrhh-03iTfTMg";
          setNftImages([imageUrl]);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    if (user) {
      fetchNFTs();
    }
  }, [user, addressUser]);

  console.log("Address User:", addressUser);

  if (!isOpen || !user) return null;

  const isCurrentUser = currentUser?._id["$oid"] === user._id["$oid"];

  const handleAction = (type: string) => {
    setActionType(type);
    setShowActionModal(true);
  };

  const handleCloseActionModal = () => {
    setShowActionModal(false);
  };
  // Các hàm xử lý chức năng (ví dụ: đổi tên, tìm group, rời group, đổi tên group nếu là mentor)
  const handleChangeName = async () => {
    // Mock logic for changing name, typically involves an API call
    console.log("Changing name...");
    // Close modal after action
    handleCloseActionModal();
  };

  const handleFindGroup = async () => {
    // Mock logic for finding a group
    console.log("Finding group...");
    // Close modal after action
    handleCloseActionModal();
  };

  const handleLeaveGroup = async () => {
    // Mock logic for leaving a group
    console.log("Leaving group...");
    // Close modal after action
    handleCloseActionModal();
  };

  const handleChangeGroupName = async () => {
    // Mock logic for changing group name, this would typically be allowed only for mentors
    console.log("Changing group name...");
    // Close modal after action
    handleCloseActionModal();
  };

  const renderActionModal = () => {
    switch (actionType) {
      case "changeName":
        return (
          <ChangeNameModal
            handle={handleChangeName}
            onClose={handleCloseActionModal}
          />
        );
      case "findGroup":
        return (
          <FindGroupModal
            handle={handleFindGroup}
            onClose={handleCloseActionModal}
          />
        );
      case "leaveGroup":
        return (
          <LeaveGroupModal
            handle={handleLeaveGroup}
            onClose={handleCloseActionModal}
          />
        );
      case "changeGroupName":
        return (
          <ChangeGroupNameModal
            handle={handleChangeGroupName}
            onClose={handleCloseActionModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center z-50 items-center">
      <div className="nes-container is-rounded is-dark m-4 max-h-[80%] w-[80%] sm:w-[90%] md:w-[85%] lg:w-[70%] xl:w-[60%] flex flex-col justify-center items-center relative shadow-lg">
        <img
          src={user.image}
          alt="Avatar"
          className="absolute -top-20 w-40 h-40 rounded-full object-cover border-4 border-white shadow-sm"
        />
        <h2 className=" text-xl font-bold text-white" style={{ marginTop: '12vh' }}>
          {removeVietnameseTones(user.firstname + " " + user.lastname)} #{user._id["$oid"]}
        </h2>
        <p className="text-md md:text-lg text-white mt-2">
          Group: {user.team_id["$oid"]}
        </p>
        {/* Thêm các input và button cho các chức năng cập nhật thông tin, rời nhóm, v.v. */}
        <div className="absolute top-4 right-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-sky-200 font-bold py-2 px-4 rounded-full"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="h-full text-sky-200 ">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="text-center md:text-left">
              {/* Nội dung modal */}
              <p>Wallet Address: {addressUser}</p>
              {isCurrentUser && user.refs && (
                <>
                  <h3>Referral List:</h3>
                  <ul className="text-sky-200">
                    {user.refs.map((id, index) => (
                      <li className="text-sky-200" key={index}>
                        {id}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="w-full text-center flex items-center justify-center">
              <span>Your SoulBound NFT on DevLife Subnet</span>
              <span className="ml-2 mr-10 text-3xl">👉</span>
              {nftImages.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`NFT ${index + 1}`}
                  className="w-40 h-40 m-2 rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
          {isCurrentUser && (
            <div className="flex gap-2 m-2">
              <button className="nes-btn" onClick={() => handleAction('changeName')}>Change Name</button>
              <button className="nes-btn" onClick={() => handleAction('findGroup')}>Find Group</button>
              <button className="nes-btn" onClick={() => handleAction('leaveGroup')}>Leave Group</button>
              {/* {user.isMentor && <button className="nes-btn" onClick={() => handleAction('changeGroupName')}>Change Group Name</button>} */}
            </div>
          )}

          {/* <div className="mt-4 flex flex-wrap justify-center">
            {nftImages.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`NFT ${index + 1}`}
                className="w-20 h-20 m-2 rounded-lg object-cover"
              />
            ))}
          </div> */}
        </div>

        {showActionModal && (
          <div className="absolute inset-0 bg-white p-4 rounded-lg shadow-lg m-4 flex flex-col justify-center items-center dark:bg-gray-700 stroke-lime-50 border border-solid border-sky-50">
          {renderActionModal()}
        </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
