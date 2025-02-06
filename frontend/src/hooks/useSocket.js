import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (token) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = io(import.meta.env.VITE_API_URL, {
        auth: { token }
      });
      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token]);

  return socket;
};