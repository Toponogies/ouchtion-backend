import WebSocket, { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const socketServer = new WebSocketServer({
  port: process.env.WS_PORT
});

socketServer.on('connection', function (client) {
  console.log('Client connects successfully.');

  client.on('message', function (message) {
    console.log('received: %s', message);
  });

});

console.log(`WebSocket Server is running at ws://localhost:${process.env.WS_PORT}`);

export function broadcastAll(message) {
  for (let c of socketServer.clients) {
    if (c.readyState === WebSocket.OPEN) {
      c.send(message);
    }
  }
}

export default socketServer;