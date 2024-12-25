import { io } from "socket.io-client";

const SOCKET_URL = "https://dacs2-server-8.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
});
