import styled from 'styled-components';
import { ethers } from 'ethers';
import 'react-toastify/dist/ReactToastify.css';
import {
  createSmartAccountClient,
  LightSigner,
} from '@biconomy/account';
import { magic } from '../lib/magic';
import { BiconomySmartAccountV2 } from '@biconomy/account';

const StatusText = styled.h1`
  font-family: 'PixelText7';
  font-size: 0.55rem;
`;

type EthereumAddress = string & { __brand: 'EthereumAddress' };

const chains = {
  chainId: 43114,
  name: 'Avalanche (C-Chain)',
  providerUrl: 'https://api.avax.network/ext/bc/C/rpc',
  incrementCountContractAdd: import.meta.env.VITE_INCREMENT_COUNT_CONTRACT_ADDRESS,
  biconomyPaymasterApiKey: import.meta.env.VITE_BICONOMY_PAYMASTER_API_KEY,
  explorerUrl: 'https://subnets.avax.network/c-chain',
};

export const connectAccountAbstraction = async (): Promise<{ address: EthereumAddress | ''; status: string | JSX.Element, smartWallet?: BiconomySmartAccountV2 }> => {
  try {
    // // Nhận kết quả xác thực từ Magic OAuth
    // const result = await magic.oauth.getRedirectResult();
    // console.log("Magic OAuth result:", result);

    // @ts-expect-error - later
    const web3Provider = new ethers.providers.Web3Provider(magic.rpcProvider, "any");

    const config = {
      biconomyPaymasterApiKey: chains.biconomyPaymasterApiKey,
      bundlerUrl: import.meta.env.VITE_BUNDLER_URL,
    };

    const smartWallet = await createSmartAccountClient({
      signer: web3Provider.getSigner() as LightSigner,
      biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
      bundlerUrl: config.bundlerUrl,
      rpcUrl: chains.providerUrl,
      chainId: chains.chainId,
    });

    const address = (await smartWallet.getAccountAddress()) as EthereumAddress;
    console.log("Smart wallet address:", address);

    return {
      address,
      status: '',
      smartWallet, // Return smartWallet
    };
  } catch (err) {
    console.error("Error connecting account abstraction:", err);
    return {
      address: '',
      status: (
        <StatusText>
          {err instanceof Error ? err.message : 'Error message in English'}
        </StatusText>
      ),
    };
  }
};
