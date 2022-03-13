import { useContext } from 'react';
import { SocketContext } from '../app/app';

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};
