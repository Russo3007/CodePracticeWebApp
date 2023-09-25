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
    /*STOPED HERE: check what join do*/
    socket.join(sessionId);
    socket.sessionId = sessionId;

    if (!codeBlockStatus[sessionId]) {
      socket.role = 'mentor';
      codeBlockStatus[sessionId] = 'mentoring';
      console.log(`Mentor ${socket.id} joined session ${sessionId}`);
    } else {
      socket.role = 'student';
      codeBlockStatus[sessionId] = 'editing';
      console.log(`Student ${socket.id} started editing session ${sessionId}`);
    }

    socket.emit('roleAssignment', socket.role);

    if (codeSessions[sessionId]) {
      socket.emit('codeUpdate', codeSessions[sessionId]);
    }

    io.emit('codeBlockStatusUpdate', codeBlockStatus);
  });

  socket.on('codeChange', (code) => {
    console.log("[socket]: ${socket.id} edit code.");
    if (socket.sessionId) {
      codeSessions[socket.sessionId] = code;
      socket.to(socket.sessionId).emit('codeUpdate', code);
    }
  });
  
  const handleClientDisconnectedFromSession = (socket) => {
    if (socket.role === 'mentor' && socket.sessionId) {
      delete codeBlockStatus[socket.sessionId];
      //io.emit('codeBlockStatusUpdate', codeBlockStatus);
    } else if (socket.role === 'student' && codeBlockStatus[socket.sessionId]) {
      codeBlockStatus[socket.sessionId] = 'mentoring';
    }
    console.log(`user '${socket.id}' disconnected from session: ${socket.sessionId}`);
    delete socket.sessionId;
  };

  socket.on("disconnect", () => {
    handleClientDisconnectedFromSession(socket);
    console.log(`A user with id : ${socket.id} disconnected`);
  });
});