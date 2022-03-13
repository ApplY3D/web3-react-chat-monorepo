import { verifyMessage } from '@ethersproject/wallet';

export const verifySignature = async (data: {
  message: string;
  address: string;
  signature: string;
}) => {
  const { address, message, signature } = data;

  try {
    const signerAddr = verifyMessage(message, signature);
    if (signerAddr !== address) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};
