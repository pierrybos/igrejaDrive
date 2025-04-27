// /src/socket.ts
import { io, Socket } from 'socket.io-client'

// URL do seu servidor de sockets (em dev local ou em produção via env var)
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

export const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket'], // força WebSocket
  autoConnect: true,
})
