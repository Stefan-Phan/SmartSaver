let ioInstance;

function initSocket(server) {
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userID) => {
      socket.join(userID);
      console.log(`User ${userID} joined room ${userID}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  ioInstance = io;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized");
  }
  return ioInstance;
}

module.exports = { initSocket, getIO };
