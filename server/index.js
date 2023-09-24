const { Server } = require("socket.io");
const codeBlocks = require("./src/models/codeBlocks")
require('dotenv').config();

const io = new Server(process.env.PORT, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
  }
});
console.log(`Server and Socket.io listening on port ${process.env.PORT}`);

// Initialize codeSessions and codeBlockStatus maps
const codeSessions = {};
const codeBlockStatus = {};

io.on('connection', (socket) => {
  socket.emit('connected_to_server', true);
  console.log('A User connected:', socket.id);

  socket.emit('fetch_all_code_blocks', codeBlocks);
  
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

  socket.on('disconnect_from_session', () => {
    console.log('A user disconnected:', socket.id);
    if (socket.role === 'student' && socket.sessionId) {
      delete codeBlockStatus[socket.sessionId];
      io.emit('codeBlockStatusUpdate', codeBlockStatus);
    }
    delete socket.sessionId;
  });
});