import { io } from 'socket.io-client';

let socket;

export const initSocket = (token) => {
  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token }
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};