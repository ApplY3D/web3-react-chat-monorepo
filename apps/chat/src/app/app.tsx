import { useEffect, useState } from 'react';
import { Message } from '@blockchain-chat/api-interfaces';
import { Web3ReactProvider } from '@web3-react/core';
import Account from './login-page';
import getLibrary from '../getLibrary';
import useEagerConnect from '../hooks/useEagerConnect';

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });
  const triedToEagerConnect = useEagerConnect();

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Account triedToEagerConnect={triedToEagerConnect} />
    </Web3ReactProvider>
  );
};

export default App;
