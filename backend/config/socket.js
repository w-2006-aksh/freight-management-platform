const { Server } = require("socket.io");

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected!`);

    socket.on("join-user-room", (userId) => {
      console.log(`user ${userId} joined their room`);
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.id} just disconnected!`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initSocket, getIO };
