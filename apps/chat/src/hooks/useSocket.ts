import { io } from 'socket.io-client';

const socket = io('http://localhost:3334', {
  autoConnect: false,
});

socket.on('connected', console.log);

socket.on('connect_error', (err) => {
  console.log(err.message);
});

function connect({ jwt }: { jwt: string }) {
  socket.auth = { jwt };
  socket.connect();
}

function disconnect({ clearAuth }: { clearAuth: boolean }) {
  if (clearAuth) socket.auth = {};
  socket.disconnect();
}

export const useSocket = () => {
  return { connect, disconnect, socket };
};
