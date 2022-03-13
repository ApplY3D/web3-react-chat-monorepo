import { Web3ReactProvider } from '@web3-react/core';
import Account from './login-page';
import getLibrary from '../getLibrary';
import useEagerConnect from '../hooks/useEagerConnect';
import { Chat } from './chat';
import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3334', {
  autoConnect: false,
});

function connect({ jwt }: { jwt: string }) {
  socket.auth = { jwt };
  socket.connect();
}

function disconnect({ clearAuth }: { clearAuth: boolean }) {
  if (clearAuth) socket.auth = {};
  socket.disconnect();
}

export const SocketContext = createContext({
  socket,
  connected: false,
  connect,
  disconnect,
});

export const App = () => {
  const triedToEagerConnect = useEagerConnect();
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket.on('connected', (data) => {
      setSocketConnected(true);
      console.log(data);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('connect_error', (err: any) => {
      setSocketConnected(false);
      console.log(err.message);
    });

    return () => {
      socket.off('connected');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, connect, connected: socketConnected, disconnect }}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        <Account triedToEagerConnect={triedToEagerConnect} />
        <Chat />
      </Web3ReactProvider>
    </SocketContext.Provider>
  );
};

export default App;
