import { FormEvent, useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

export const Chat = () => {
  const { socket } = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket?.on('CHAT:NEW_MESSAGE', (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket?.off('CHAT:NEW_MESSAGE');
    };
  }, []);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((prev) => [...prev, message]);
    socket.emit('CHAT:NEW_MESSAGE', message);
  };

  return (
    <div>
      <h2>messages:</h2>
      {messages.map((m, i) => (
        <h4 key={i}>{m}</h4>
      ))}

      {/* {socket?.connected ? ( */}
      <form onSubmit={sendMessage} action="">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
        />
        <button>send</button>
      </form>
      {/* ) : (
        <h3>Login to send messages</h3>
      )} */}
    </div>
  );
};
