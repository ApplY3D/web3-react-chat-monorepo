import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useState } from 'react';

async function startLogin({ evm }: { evm: string }) {
  return fetch('http://localhost:3333/login-evm/message', { headers: { evm } })
    .then((r) => r.json())
    .catch((e) => console.log(e));
}

async function getJwtFromServer(data: { evm: string; signature: string }) {
  const { evm, signature } = data;

  return fetch('http://localhost:3333/login-evm', {
    method: 'POST',
    headers: {
      evm,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ signature }),
  })
    .then((r) => r.json())
    .catch((e) => console.log(e));
}

export const useAuth = () => {
  const [jwt, setJwt] = useState<string | null>(null);
  const { account, library, deactivate } = useWeb3React<Web3Provider>();

  const isWalletConnected = typeof account === 'string' && !!library;

  async function login() {
    const { message } = await startLogin({ evm: <string>account });
    let signature;

    try {
      signature = await library?.getSigner().signMessage(message);
    } catch (error) {
      console.log(error);
    }

    if (!signature) {
      return;
    }

    const { jwt } = await getJwtFromServer({ evm: <string>account, signature });
    setJwt(jwt);
  }

  async function logout() {
    deactivate();
    setJwt(null);
  }

  return { jwt, isWalletConnected, login, logout };
};
