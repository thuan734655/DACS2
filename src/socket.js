import { io } from 'socket.io-client';

const SOCKET_URL = 'https://dacs2-server-5.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true
});
