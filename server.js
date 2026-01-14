const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", socket => {

  socket.on("join_text", ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;
  });

  socket.on("text_message", msg => {
    io.to(socket.room).emit("text_message", {
      user: socket.username,
      text: msg
    });
  });

  socket.on("join_voice", room => {
    socket.join(room);
    socket.to(room).emit("user-joined");
  });

  socket.on("offer", data => socket.to(data.room).emit("offer", data));
  socket.on("answer", data => socket.to(data.room).emit("answer", data));
  socket.on("ice", data => socket.to(data.room).emit("ice", data));
});

server.listen(process.env.PORT || 3000);
