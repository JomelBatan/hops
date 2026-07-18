import { io, Socket } from "socket.io-client";
import { getToken } from "./api";

const SOCKET_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SOCKET_URL!
    : "http://localhost:5050";

let socket: Socket | null = null;

//Lazily create (and authenticate) the shared socket connection.

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: { token: getToken() },
      transports: ["websocket"],
    });
  }
  return socket;
}
export function connectSocket(): Socket {
  const s = getSocket();
  s.auth = { token: getToken() };
  if (!s.connected) s.connect();
  return s;
}
export function disconnectSocket() {
  if (socket) socket.disconnect();
}
