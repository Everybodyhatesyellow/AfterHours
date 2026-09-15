import { io, type Socket } from "socket.io-client";

// The server URL is injected at build time. During local dev this points at
// the backend's dev server; in production it's your deployed server's URL.
const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SERVER_URL, { autoConnect: true, transports: ["websocket"] });
  }
  return socket;
}

/** Thin promise wrapper around Socket.IO's ack callback pattern. */
export function emitWithAck<T = any>(event: string, payload: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    getSocket().emit(event, payload, (response: T & { ok: boolean; error?: string }) => {
      if (!response) return reject(new Error("No response from server."));
      if (!response.ok) return reject(new Error(response.error ?? "Something went wrong."));
      resolve(response);
    });
  });
}
