const { Server } = require("socket.io");
const routes = require('./src/routes/routes.js');
require('dotenv').config();

const io = new Server(process.env.PORT, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
  }
});

// Initialize codeSessions and codeBlockStatus maps
const codeSessions = {};
const codeBlockStatus = {};

io.on('connection', (socket) => {
  console.log('A User connected:', socket.id);

  socket.on('joinSession', (sessionId) => {
    console.log(`[socket] joinSession: ${sessionId}`);
    socket.join(sessionId);
    socket.sessionId = sessionId;

    if (!codeBlockStatus[sessionId]) {
      codeBlockStatus[sessionId] = 'editing';
      socket.role = 'student';
      console.log(`Student ${socket.id} started editing session ${sessionId}`);
    } else {
      socket.role = 'mentor';
      console.log(`Mentor ${socket.id} joined session ${sessionId}`);
    }

    socket.emit('roleAssignment', socket.role);

    if (codeSessions[sessionId]) {
      socket.emit('codeUpdate', codeSessions[sessionId]);
    }

    io.emit('codeBlockStatusUpdate', codeBlockStatus);
  });

  socket.on('codeChange', (code) => {
    console.log("[socket] codeChange:", code);
    if (socket.sessionId) {
      codeSessions[socket.sessionId] = code;
      socket.to(socket.sessionId).emit('codeUpdate', code);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    if (socket.role === 'student' && socket.sessionId) {
      delete codeBlockStatus[socket.sessionId];
      io.emit('codeBlockStatusUpdate', codeBlockStatus);
    }
    delete socket.sessionId;
  });
});