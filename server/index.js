const express = require('express');
const app = express();
const routes = require('./api/routes/routes.js');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

app.use(express.json());

// Mount the routes
app.use('/api', routes);

// Allow the ui app to make cross-origin requests.
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Initialize codeSessions and codeBlockStatus maps
const codeSessions = {};
const codeBlockStatus = {};

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinSession', (sessionId) => {
    console.log(`[socket] joinSession: ${sessionId}`);
    socket.join(sessionId);
    socket.sessionId = sessionId;

    if (!codeBlockStatus[sessionId]) {
      codeBlockStatus[sessionId] = 'editing';
      socket.role = 'student';
    } else {
      socket.role = 'mentor';
    }

    socket.emit('roleAssignment', socket.role);

    if (codeSessions[sessionId]) {
      socket.emit('codeUpdate', codeSessions[sessionId]);
    }
  });

  // Handle events from the client
  socket.on('codeChange', (id, code) => {
    console.log("[socket] codeChange:", code)
    if (socket.sessionId) {
      codeSessions[socket.sessionId] = code;
      socket.to(socket.sessionId).emit('codeUpdate', code);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete socket.sessionId;
  });
});

const port = process.env.SERVER_PORT;

http.listen(port, () => {
  console.log(`Server and Socket.io listening on port ${port}`);
});