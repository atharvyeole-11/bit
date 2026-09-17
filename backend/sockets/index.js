const { Server } = require('socket.io');

let io;

const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);
    
    // Clients should join a room with their userId to receive personal notifications
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`[Socket.io] Socket ${socket.id} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  // Specific namespace for Queue updates
  const queueNamespace = io.of('/queue');
  queueNamespace.on('connection', (socket) => {
    console.log(`[Socket.io /queue] Client connected: ${socket.id}`);
  });

  return io;
};

const getIo = () => {
  if (!io) {
    console.warn('Socket.io not initialized yet');
  }
  return io;
};

module.exports = { initSockets, getIo };
