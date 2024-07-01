import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
// import { socket } from "../socket";
import { useDevicePixelRatio } from "../hooks/useDevicePixelRatio";
import { useScreen } from "../hooks/useScreen";
import { createUser, updateDataDev } from "../api/socket-and-server-api";
// import { SocketServerEvents } from "../enums";
import ConnectLocks from "../layout/ConnectLocks";
import { walletCopy, walletCopyPL } from "../data/WalletData";
import Header from "../components/Header";
import { AuthContextData, useAuth } from "../contexts/AuthProvider";
import { SERVER_URL } from "../constants";
import { connectAccountAbstraction } from "../api/WalletAPI";
import { useLocation } from "react-router-dom";
import { updateTeamRespToDataMatchInGame } from "../utils";
import { RedirectResult, UpdateTeamResponse } from "../types";
import Knowledge from "../components/Knowledge";
import SubKnowledge from "../components/SubKnowledge";
import { BiconomySmartAccountV2 } from "@biconomy/account"; // Added this line

function Home() {
  const { redirectResult, setUser, user, setRedirectResult } =
    useAuth() as AuthContextData;

  const location = useLocation();
  const { address: initialAddress } = location.state || {};
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const savedAddress = localStorage.getItem("address");
    setAddress(savedAddress || initialAddress || "");
  }, [initialAddress]);

  const [loading, setLoading] = useState(false);
  const [updateTeamData, setUpdateTeamData] = useState<UpdateTeamResponse>();

  const [, setShowConfigurator] = useState(false);
  const [, setShowDisclosure] = useState(false);
  const [language, setLanguage] = useState("english");
  // const [publicAddress, setPublicAddress] = useState('');
  // const [smartAccount, setSmartAccount] = useState(null);

  const [smartWallet, setSmartWallet] = useState<BiconomySmartAccountV2 | null>(null); // Changed this line

  const [isUserCreated, setIsUserCreated] = useState(false);


  // load redirectResult from localStorage
  useEffect(() => {
    const redirectResultJson = localStorage.getItem("redirectResult");
    if (redirectResultJson) {
      setRedirectResult(JSON.parse(redirectResultJson));
    }
  }, [setRedirectResult]);

  const handleReturnToStartPage = () => {
    setShowConfigurator(false);
    setShowDisclosure(false);
  };

  const handleLanguageChange = () => {
    setLanguage(language === "english" ? "vietnamese" : "english");
  };

  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "build/Build/BuildLiveDev.loader.js",
    dataUrl: "build/Build/BuildLiveDev.data",
    frameworkUrl: "build/Build/BuildLiveDev.framework.js",
    codeUrl: "build/Build/BuildLiveDev.wasm",
  });

  const devicePixelRatio = useDevicePixelRatio();
  const { screenSize, isLargeScreen } = useScreen();

  // Unity event listeners
  useEffect(() => {
    addEventListener("UpdateDataDev", (data) => {
      // @ts-expect-error - TS doesn't know about the "UpdateDataDev" event
      updateDataDev(data, sendMessage, setUpdateTeamData, user?._id["$oid"]);
    });
    return () => {
      // @ts-expect-error - TS doesn't know about the "UpdateDataDev" event
      removeEventListener("UpdateDataDev", updateDataDev);
    };
  }, [addEventListener, removeEventListener, sendMessage, user?._id]);

  // HANDLE LOGIN
  useEffect(() => {
    // console.log(redirectResult);
    // console.log(address);

    // check if create user or not
    async function checkUserExist() {
      const resp = await fetch(`${SERVER_URL}/get_user_by_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: redirectResult?.oauth.userInfo.email,
          // email: "letung678978@gmail.com",
        }),
      });

      const data = await resp.json();

      console.log(data);

      if (data.StatusCode == 404) {
        const { address: connectedAddress, smartWallet } = await connectAccountAbstraction();
        await createUser(redirectResult as RedirectResult, connectedAddress);

        if (smartWallet) {
          setSmartWallet(smartWallet);
        }

        setIsUserCreated(true);

      } else {
        // console.log(data);
        setUser(data.user);

        // check if user has team
        if (data.user.team_id) {
          // console.log("I have team");
          // const resp2 = await fetch(`${SERVER_URL}/get_team_by_id`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     // email: redirectResult.oauth.userInfo.email,
          //     team_id: data.user.team_id["$oid"],
          //   }),
          // });
          // const data2: UpdateTeamResponse = await resp2.json();
          // // console.log(data2);
          // const obj = updateTeamRespToDataMatchInGame(
          //   data2,
          //   data.user._id["$oid"]
          // );
          // console.log(obj);
          // setUpdateTeamData(data2);
          // sendMessage("PlayerControll", "receiveJsonTeam", JSON.stringify(obj));
        } else {
          // console.log("I do not have team");
        }
      }
    }
    checkUserExist();
  }, []);

  useEffect(() => {
    async function setRoom() {
      if (user?.team_id) {
        const resp = await fetch(`${SERVER_URL}/get_team_by_id`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            team_id: user.team_id["$oid"],
          }),
        });

        const data: UpdateTeamResponse = await resp.json();

        console.log(data.team.total_commit);

        if (data.team.total_commit >= 500) {
          sendMessage("Room", "SetRoom", 1);
        } else if (data.team.total_commit >= 1500) {
          sendMessage("Room", "SetRoom", 2);
        } else {
          sendMessage("Room", "SetRoom", 0);
        }
      } else {
        sendMessage("Room", "SetRoom", 0);
      }
    }
    setRoom();
  }, [sendMessage, user?.team_id]);

  useEffect(() => {
    async function getUserData() {
      const resp = await fetch(`${SERVER_URL}/get_user_by_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: redirectResult?.oauth.userInfo.email,
          // email: "letung678978@gmail.com",
        }),
      });

      const data = await resp.json();

      if (data.StatusCode != 404) {
        console.log("Im here to set user");
        console.log(data);
        setUser(data.user);
      }
    }
    getUserData();
  }, [
    redirectResult,
    setUser,
    user,
    setRedirectResult,
    address,
    isUserCreated,
    isLoaded,
  ]);

  useEffect(() => {
    async function loadTeam() {
      console.log("loadteam", user);
      if (user?.team_id) {
        console.log("I have team");
        const resp2 = await fetch(`${SERVER_URL}/get_team_by_id`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // email: redirectResult.oauth.userInfo.email,
            team_id: user.team_id["$oid"],
          }),
        });

        const data2: UpdateTeamResponse = await resp2.json();

        // console.log(data2);

        const obj = updateTeamRespToDataMatchInGame(data2, user._id["$oid"]);

        console.log(obj);

        setUpdateTeamData(data2);

        console.log("Im sending message to game");

        sendMessage("PlayerControll", "receiveJsonTeam", JSON.stringify(obj));
      }
    }

    loadTeam();
  }, [sendMessage, user]);

  // SOCKET EVENT LISTENERS

  // useEffect(() => {
  //   // @ts-expect-error - later
  //   function onUpdateTeam(data) {
  //     console.log("onUpdateTeam", data);

  //     const obj = {
  //       team: {
  //         name: data.team.name,
  //         quantity: data.team.members.length,
  //         total_token: data.team.total_token,
  //         total_commit: data.team.total_commit,
  //         total_bug: data.team.total_bugs,
  //       },
  //       // @ts-expect-error - later
  //       users: data.users.map((user) => {
  //         console.log(user);
  //         return {
  //           id: user._id["$oid"],
  //           name: `${user.firstname} ${user.lastname}`,
  //           stamina: user.stamina,
  //           is_online: user.is_online,
  //         };
  //       }),
  //       id_user_playing: data.user._id["$oid"], // replace with id when login
  //     }; // UpdateTeamResponse (Rust type)

  //     console.log(obj);

  //     setUpdateTeamData(data);

  //     sendMessage("PlayerControll", "receiveJsonTeam", JSON.stringify(obj));
  //   }

  //   // function onCreateUser(data) {
  //   //   console.log("onCreateUser", data);
  //   //   setUser(data);
  //   // }

  //   socket.on(SocketServerEvents.UpdateTeam, onUpdateTeam);
  //   // socket.on(SocketServerEvents.CreateUserResponse, onCreateUser);

  //   return () => {
  //     socket.off(SocketServerEvents.UpdateTeam, onUpdateTeam);
  //     // socket.off(SocketServerEvents.CreateUserResponse, onCreateUser);
  //   };
  // }, [sendMessage]);

  useEffect(() => {
    const connectWallet = async () => {
      setLoading(true);
      try {
        const { address: connectedAddress, smartWallet } = await connectAccountAbstraction();
        setAddress(connectedAddress);
        if (smartWallet) {
          setSmartWallet(smartWallet);
        }
      } catch (err) {
        console.error("Error connecting wallet:", err);
      } finally {
        setLoading(false);
      }
    };
    if (!address) {
      connectWallet();
    }
  }, [address]);

  if (loading) {
    return (
      <>
        <div className="w-full mx-auto p-4 min-h-screen">
          <Header
            onLeftButtonClick={handleReturnToStartPage}
            onLanguageChange={handleLanguageChange}
            data={language === "english" ? walletCopy : walletCopyPL}
            language={language}
            publicAddress={address}
          />

          <div className="sm:flex-col flex mt-4 gap-2">
            <div className="sm:w-full w-1/2 p-2 nes-container bg-[#1d0f48] rounded-[24px] ">
              <div className="flex justify-center items-center border-orange">
                {!isLoaded && (
                  <p>
                    Loading Application...{" "}
                    {Math.round(loadingProgression * 100)}%
                  </p>
                )}
                <Unity
                  unityProvider={unityProvider}
                  style={{
                    // visibility: isLoaded ? "visible" : "hidden",
                    display: isLoaded ? "block" : "none",
                    width: `${
                      !isLargeScreen
                        ? screenSize.width / screenSize.height > 1 // rotate phone
                          ? screenSize.width
                          : screenSize.width - 50
                        : screenSize.width / 2.13
                    }px`,
                    height: `${
                      !isLargeScreen
                        ? screenSize.width / screenSize.height > 1 // rotate phone
                          ? screenSize.height - 70
                          : screenSize.height - 100
                        : screenSize.height / 1.6
                    }px`,
                  }}
                  devicePixelRatio={devicePixelRatio}
                />
              </div>
              {/* CONNECT */}
              <ConnectLocks
                updateTeamData={updateTeamData}
                setUpdateTeamData={setUpdateTeamData}
                sendMessage={sendMessage}
                address={address}
              />
            </div>

            <Knowledge address={address} />

            <div className="sm:w-full w-1/4 p-2 nes-container bg-[#7e56f3] rounded-[24px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-white mb-2">
                  <div>SUB-KNOWLEDGE</div>
                </div>
                <div className="p-2">
                  <div className="nes-balloon from-left nes-pointer p-2">
                    <div className="cursor-pointer">
                      <div className="text-red-500">Introduction</div>
                      <div className="text-black">
                        This game was designed to help you fun with the
                        hackathon concepts and learn more what blockchain is?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="nes-balloon from-left nes-pointer p-2">
                    <div className="cursor-pointer">
                      <div className="text-red-500">
                        How the game help you understand blockchain?
                      </div>
                      <div className="text-black">
                        We focus on providing insights into the Avax network.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* max-w-6xl */}
      <div className="w-full mx-auto p-4 min-h-screen">
        <Header
          onLeftButtonClick={handleReturnToStartPage}
          onLanguageChange={handleLanguageChange}
          data={language === "english" ? walletCopy : walletCopyPL}
          language={language}
          publicAddress={address}
        />

        <div className="sm:flex-col flex mt-4 gap-2">
          <div className="sm:w-full w-1/2 p-2 nes-container bg-[#1d0f48] rounded-[24px] ">
            <div className="flex justify-center items-center border-orange">
              {!isLoaded && (
                <p>
                  Loading Application... {Math.round(loadingProgression * 100)}%
                </p>
              )}
              <Unity
                unityProvider={unityProvider}
                style={{
                  // visibility: isLoaded ? "visible" : "hidden",
                  display: isLoaded ? "block" : "none",
                  width: `${
                    !isLargeScreen
                      ? screenSize.width / screenSize.height > 1 // rotate phone
                        ? screenSize.width
                        : screenSize.width - 50
                      : screenSize.width / 2.13
                  }px`,
                  height: `${
                    !isLargeScreen
                      ? screenSize.width / screenSize.height > 1 // rotate phone
                        ? screenSize.height - 70
                        : screenSize.height - 100
                      : screenSize.height / 1.6
                  }px`,
                }}
                devicePixelRatio={devicePixelRatio}
              />
            </div>
            {/* CONNECT */}
            <ConnectLocks
              updateTeamData={updateTeamData}
              setUpdateTeamData={setUpdateTeamData}
              sendMessage={sendMessage}
              address={address}
            />
          </div>


          <Knowledge address={address} smartWallet={smartWallet || undefined}/>
          <SubKnowledge/>

        </div>
      </div>
    </>
  );
}

export default Home;
