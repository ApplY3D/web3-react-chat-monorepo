import { Web3Provider } from '@ethersproject/providers';
import { NETWORKS } from '../constants/networks';

export const switchNetwork = async (data: {
  networkId: number;
  library?: Web3Provider;
  account: string;
}) => {
  const { networkId, account, library } = data;

  const params = NETWORKS[networkId];

  const convertToHexStr = (num: number) => num.toString(16);
  const chainId = `0x${convertToHexStr(networkId)}`;

  try {
    await library?.send('wallet_switchEthereumChain', [{ chainId }, account]);
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await library?.send('wallet_addEthereumChain', [params, account]);
      } catch (addError) {
        console.error(`Add chain error ${addError}`);
      }
    }
    console.error(`Switch chain error ${switchError}`);
  }
};
