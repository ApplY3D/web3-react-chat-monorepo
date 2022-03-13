import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { UserRejectedRequestError } from '@web3-react/injected-connector';
import { useEffect, useState } from 'react';
import { connectors } from '../connectors';
import useMetaMaskOnboarding from '../hooks/useMetaMaskOnboarding';

type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, chainId, account, setError, deactivate } =
    useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  if (error) {
    return error instanceof UnsupportedChainIdError ? (
      <div>Unsupported chain</div>
    ) : null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== 'string') {
    return (
      <div>
        {isWeb3Available ? (
          <button
            disabled={connecting}
            onClick={() => {
              setConnecting(true);

              activate(connectors.Injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
            }}
          >
            {isMetaMaskInstalled ? 'Connect to MetaMask' : 'Connect to Wallet'}
          </button>
        ) : (
          <button onClick={startOnboarding}>Install Metamask</button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <a
        {...{
          target: '_blank',
          rel: 'noopener noreferrer',
        }}
      >
        {account}
      </a>
      <button onClick={deactivate}>disconnect</button>
    </div>
  );
};

export default Account;
