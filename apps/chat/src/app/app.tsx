import { Web3ReactProvider } from '@web3-react/core';
import Account from './login-page';
import getLibrary from '../getLibrary';
import useEagerConnect from '../hooks/useEagerConnect';

export const App = () => {
  const triedToEagerConnect = useEagerConnect();

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Account triedToEagerConnect={triedToEagerConnect} />
    </Web3ReactProvider>
  );
};

export default App;
