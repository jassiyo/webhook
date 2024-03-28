const express = require('express');
const { Server } = require('ws');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');
const app = express();
const PORT = 6001;
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log("Received webhook data:", req.body);
  res.json({"status": "success", "message": "Webhook received"});
});

// Create an HTTP server and run Express app on it
const server = http.createServer(app);

// Attach WebSocket server to the same HTTP server
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Echo the message back to the client
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send a message to the client
  ws.send('Welcome to the WebSocket server!');
  });

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Press CTRL+C to quit');
});





const ws = new WebSocket('ws://localhost:6001');

ws.on('message', (message) => {
  console.log('Received message:', message);
  if (typeof message === 'string' && !message.startsWith('Echo:')) {
    console.log('Message from server:', message.toString());
    // Send a POST request to the Flask server
    axios.post('http://localhost:6000/webhook', {
      message: message
    })
    .then(response => {
      console.log('Response from Flask:', response.data);
      // Optionally, you can send the Flask response back to the WebSocket client
      ws.send(`Response from Flask: ${JSON.stringify(response.data)}`);
    })
    .catch(error => {
      console.error('Error contacting Flask server:', error);
    });
  }
});