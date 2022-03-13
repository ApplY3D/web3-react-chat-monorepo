import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { connectors } from '../connectors';

export default function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    connectors.Injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(connectors.Injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate]);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
