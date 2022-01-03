import { Server } from "socket.io";

var io = null;
exports.getIO = function () {
  return io;
};

exports.initialize = function(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
    }
  });
  // add consumer if need
  io.on("connection", (socket) => {
    console.log("New socket connection ");
  });
};