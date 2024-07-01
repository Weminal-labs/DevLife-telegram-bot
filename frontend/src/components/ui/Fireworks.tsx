import React from 'react';
import { Hex, encodeFunctionData } from "viem";
import { realbuilderSBTabi } from "../../abi/RealBuilderSBT";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import { PaymasterMode, BiconomyPaymaster } from "@biconomy/paymaster";
import type { UserOperationStruct } from "@alchemy/aa-core";

interface FireworksProps {
  role: string;
  roleImage: string;
  onClaim: () => void;
  smartWallet?: BiconomySmartAccountV2;
  address?: string;
}

const Fireworks: React.FC<FireworksProps> = ({ role, roleImage, smartWallet, address, onClaim }) => {

  const handleClaim = async () => {
    if (!smartWallet || !address) {
      onClaim();
      return;
    }

    try {
      const nftAddress = "0xb1f798Ea3086e5E55A3616852a25037f2B79B1Dd";
      const nftData = encodeFunctionData({
        abi: realbuilderSBTabi,
        functionName: "safeMint",
        args: [address as Hex, roleImage as Hex],
      });

      const userOperation: Partial<UserOperationStruct> = {
        factory: nftAddress,
        callData: nftData,
        callGasLimit: "0x5208",
      };

      const paymasterServiceData = {
        mode: PaymasterMode.SPONSORED,
        calculateGasLimits: true,
      };

      const paymaster = new BiconomyPaymaster(import.meta.env.VITE_BICONOMY_PAYMASTER_API_KEY);

      console.log("API Key:", import.meta.env.VITE_BICONOMY_PAYMASTER_API_KEY);
      console.log("User Operation:", userOperation);

      const paymasterAndDataResponse = await paymaster.getPaymasterAndData(userOperation, paymasterServiceData);
      const paymasterAndData = await paymasterAndDataResponse.paymasterAndData;

      const userOpResponse = await smartWallet.sendTransaction({
        ...userOperation,
         //@ts-expect-error - later
        paymasterAndData,
      });

      const { transactionHash } = await userOpResponse.waitForTxHash();
      console.log("Transaction Hash:", transactionHash);

      const userOpReceipt = await userOpResponse.wait();

      if (userOpReceipt.success === 'true') {
        console.log("UserOp Receipt:", userOpReceipt);
        console.log("Transaction Receipt:", userOpReceipt.receipt);
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
    } finally {
      onClaim();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="text-white text-4xl mb-4">Congratulations!</div>
      <img src={roleImage} alt={role} className="w-1/5 h-auto mb-4" />
      <div className="text-white text-2xl mb-4">{role}</div>
      <button onClick={handleClaim} className="nes-btn is-primary">Claim</button>
    </div>
  );
};

export default Fireworks;
