// server.js
const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = {
  board: Array(5).fill(null).map(() => Array(5).fill('')),
  currentPlayer: 'A',
  history: [],
  winner: null,
};

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send initial game state to the new client
  ws.send(JSON.stringify({ type: 'INIT', data: gameState }));

  ws.on('message', (message) => {
    console.log('Received:', message);
    const { type, payload } = JSON.parse(message);

    if (type === 'MOVE') {
      handleMove(payload.character, payload.move);
    }
  });

  const handleMove = (character, move) => {
    // Implement move handling logic here
    // Update gameState based on the move

    // Notify all clients about the move
    broadcast({
      type: 'UPDATE',
      data: gameState,
    });
  };

  const broadcast = (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});
