import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useState } from 'react';

async function startLogin() {
  return 'Message from server to sign with uniq ID';
}

async function getJwtFromServer() {
  return 'JWT';
}

export const useAuth = () => {
  const [jwt, setJwt] = useState<string | null>(null);
  const { account, library, deactivate } = useWeb3React<Web3Provider>();

  const isWalletConnected = typeof account === 'string' && !!library;

  async function login() {
    const message = await startLogin();
    let signature;

    try {
      signature = await library?.getSigner().signMessage(message);
    } catch (error) {
      console.log(error);
    }

    if (!signature) {
      return;
    }

    const jwt = await getJwtFromServer();
    setJwt(jwt);
  }

  async function logout() {
    deactivate();
    setJwt(null);
  }

  return { jwt, isWalletConnected, login, logout };
};
