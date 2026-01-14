const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// تقديم ملفات public
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // يبث للجميع
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("server running on port", PORT);
});
