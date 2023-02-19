const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const formatMessage = require("./utils/message");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// listen when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // ? Welcome current user
    socket.emit("message", formatMessage("chatBot", "Welcome to chatapp!"));

    // * A new user has joined the chat
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("chatBot", `A new user ${username} has joined`)
      );

    // Send user and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //
  // Listen for chatmessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // ! a user has been disconnected
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("chatBot", `${user.username} user has been disconnected`)
      );

      // Send user and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
const PORT = 8080 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server has started at port ${PORT}`);
});
