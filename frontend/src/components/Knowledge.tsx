import { useState, useEffect } from 'react';
import { questions } from './utils/Questions';
import Fireworks from './ui/Fireworks';
import { BiconomySmartAccountV2 } from "@biconomy/account";
import { ethers } from 'ethers';
import { realbuilderSBTabi } from '../abi/RealBuilderSBT';

const getFontSize = (text: string) => {
  return text.length > 20 ? 'text-sm' : 'text-base';
};

interface Knowledge {
  address?: string; // Thêm thuộc tính address
  smartWallet?: BiconomySmartAccountV2;
}

const Knowledge = ({
  address,
  smartWallet
}: Knowledge) => {
  console.log("Knowledge", address);
  const [currentQuestion, setCurrentQuestion] = useState<number>(() => {
    const savedQuestion = localStorage.getItem('currentQuestion');
    return savedQuestion ? JSON.parse(savedQuestion) : 0;
  });
  const [score, setScore] = useState<number>(() => {
    const savedScore = localStorage.getItem('score');
    return savedScore ? JSON.parse(savedScore) : 0;
  });
  const [exp, setExp] = useState<number>(() => {
    const savedExp = localStorage.getItem('exp');
    return savedExp ? JSON.parse(savedExp) : 0;
  });
  const [showFireworks, setShowFireworks] = useState<boolean>(() => {
    const savedShowFireworks = localStorage.getItem('showFireworks');
    return savedShowFireworks ? JSON.parse(savedShowFireworks) : false;
  }); // State to show fireworks
  const [newRole, setNewRole] = useState<string>(() => {
    const savedRole = localStorage.getItem('newRole');
    return savedRole ? savedRole : '';
  }); // State to store new role
  const [nfts, setNfts] = useState<any[]>([]); // State to store NFTs

  useEffect(() => {
    localStorage.setItem('currentQuestion', JSON.stringify(currentQuestion));
    localStorage.setItem('score', JSON.stringify(score));
    localStorage.setItem('exp', JSON.stringify(exp));
    localStorage.setItem('showFireworks', JSON.stringify(showFireworks));
    localStorage.setItem('newRole', newRole);
  }, [currentQuestion, score, exp, showFireworks, newRole]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const rpcUrl =
          "https://api.avax-test.network/ext/bc/C/rpc";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        console.log(provider);

        // Địa chỉ của contract ERC-721
        const erc721ContractAddress =
          "0x4d757023780C7Ff62B65CFcB6E9EABa8D8216194";

        // Tạo đối tượng Contract với ERC-721 contract address và ABI
        const contract = new ethers.Contract(
          erc721ContractAddress,
          realbuilderSBTabi,
          provider
        );

        // Gọi hàm getSoulboundNFTs để lấy danh sách các token ID mà địa chỉ ví sở hữu
        const check = await contract.getSoulboundNFTs(address);
        console.log(check);

        // Nếu mảng check rỗng, hiển thị NFT dựa trên vai trò của người chơi
        if (check.length === 0) {
          const role = getRole(score);
          const roleNFTs = {
            "Newbie": [0],
            "Intern": [0, 1],
            "Fresher": [0, 1, 2],
            "Junior": [0, 1, 2, 3],
            "Senior": [0, 1, 2, 3, 4]
          };
          setNfts(roleNFTs[role]);
        } else {
          // Cập nhật state với danh sách NFT
          setNfts(check);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    if (address) {
      fetchNFTs();
    }
  }, [address, score]);

  console.log("ffffffffffffffffffffffffffffffffff",nfts)

  const handleAnswerClick = (answer: string) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setExp(exp + 10); // Increase exp if answered correctly
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  const getRole = (score: number) => {
    if (score < 10) return "Newbie";
    if (score < 30) return "Intern";
    if (score < 60) return "Fresher";
    if (score < 90) return "Junior";
    return "Senior";
  };

  const getRoleImage = (role: string) => {
    switch (role) {
      case "Newbie":
        return "https://crimson-fascinating-vulture-838.mypinata.cloud/ipfs/QmdUJsAXS69wSSB4ZZ1za3joDRVZYNHiCY6b73SSZZhnAn";
      case "Intern":
        return "https://crimson-fascinating-vulture-838.mypinata.cloud/ipfs/QmQWqxaB7bCw8g1tKWiTjebqVx8daUeQye927xRqUxTqG3";
      case "Fresher":
        return "https://crimson-fascinating-vulture-838.mypinata.cloud/ipfs/QmZDN3vswpT2Sj2sPAEgfhgjAtSPCR36mu7mnVbJ3cDj4N";
      case "Junior":
        return "https://crimson-fascinating-vulture-838.mypinata.cloud/ipfs/QmRdQdKedGoJBmyCBLVihbTnMix1mRDd12oCyUiR1wPyMS";
      case "Senior":
        return "https://crimson-fascinating-vulture-838.mypinata.cloud/ipfs/QmWqCUXkhy4AARzNwieY9obTuiqx9jHBTmpYcWcKKFzD9D";
      default:
        return "https://green-necessary-dormouse-499.mypinata.cloud/ipfs/QmWwybBHitTfTDgQMFcK4AYAES1NgXD6moYoa6rMpLXY71?fbclid=IwZXh0bgNhZW0CMTAAAR0w-LUSApyNJ2T6KzXYUJKIYumxglnovLGzXOieHYqUxNsBzsam1X-eNuE_aem_iK-4PlWcNlrhh-03iTfTMg";
    }
  };

  useEffect(() => {
    const role = getRole(score);
    if (role !== newRole) {
      setNewRole(role);
      setShowFireworks(true); // Show fireworks when role changes
    }
  }, [score]); // Only depend on score

  const handleClaim = () => {
    setShowFireworks(false); // Hide fireworks when claim button is clicked
  };

  const role = getRole(score);
  const roleImage = getRoleImage(role);

  return (
    <div className="sm:w-full w-1/4 p-2 nes-container bg-[#de90bd] rounded-[24px] flex flex-col justify-between">
      {showFireworks && (
        <Fireworks role={newRole} roleImage={getRoleImage(newRole)} onClaim={handleClaim} smartWallet={smartWallet} address={address}/>
      )}
      <div>
        <div className="flex justify-between items-center text-white mb-2">
          <div>KNOWLEDGE</div>
        </div>
        {currentQuestion < questions.length ? (
          <>
            <div className="nes-balloon from-left nes-pointer p-2">
              <div className="text-black cursor-pointer">{questions[currentQuestion].question}</div>
            </div>
            <div className="flex justify-end">
              <div className="p-2">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`ml-5 text-black cursor-pointer ${getFontSize(answer)}`}
                    onClick={() => handleAnswerClick(answer)}
                    style={{ color: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'][index % 5] }}
                  >
                    <li className='nes-balloon from-right nes-pointer'>
                      {answer}
                    </li>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex justify-center items-center'>
              <img
                src={roleImage}
                alt={role}
                className="mt-4 rounded-lg"
                style={{ width: "40%", height: "auto" }}
              />
            </div>

            <div className='flex justify-center items-center'>
              <div className="text-white mt-5 text-center">
                {role}. Exp: {exp}
              </div>
            </div>

            
          </>
        ) : (
          <div className='mt-5 flex flex-col gap-20%'>
            <div className='flex flex-col justify-center items-center text-sm'>
              <div className="text-white">
                You have completed all the questions!<br />
                Correct answers: {score}.<br />
                Incorrect answers: {questions.length - score}
              </div>
              <img
                src={roleImage}
                alt={role}
                className="mt-4 rounded-lg"
                style={{ width: "40%", height: "auto" }}
              />
              <div className='flex justify-center items-center'>
                <div className="text-white mt-5 text-center">
                  {role}. Exp: {exp}
                </div>
              </div>
              <div className="mt-5 w-full">
                <table className="w-full text-white text-center">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Certified NFTs have been claimed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">
                        <div className="grid grid-cols-3 gap-2 justify-center">
                          {nfts.includes(0) && (
                            <div className="flex flex-col items-center">
                              <img src="/assets/UI/newbie.png" alt="Newbie" className="pixel-image" style={{ width: "100px", height: "100px" }} />
                              <span className="text-white mt-2">Newbie</span>
                            </div>
                          )}
                          {nfts.includes(1) && (
                            <div className="flex flex-col items-center">
                              <img src="/assets/UI/intern.png" alt="Intern" className="pixel-image" style={{ width: "100px", height: "100px" }} />
                              <span className="text-white mt-2">Intern</span>
                            </div>
                          )}
                          {nfts.includes(2) && (
                            <div className="flex flex-col items-center">
                              <img src="/assets/UI/fresher.png" alt="Fresher" className="pixel-image" style={{ width: "100px", height: "100px" }} />
                              <span className="text-white mt-2">Fresher</span>
                            </div>
                          )}
                          {nfts.includes(3) && (
                            <div className="flex flex-col items-center">
                              <img src="/assets/UI/junior.png" alt="Junior" className="pixel-image" style={{ width: "100px", height: "100px" }} />
                              <span className="text-white mt-2">Junior</span>
                            </div>
                          )}
                          {nfts.includes(4) && (
                            <div className="flex flex-col items-center">
                              <img src="/assets/UI/senior.png" alt="Senior" className="pixel-image" style={{ width: "100px", height: "100px" }} />
                              <span className="text-white mt-2">Senior</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Knowledge;
