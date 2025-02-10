const express = require("express");
const app = express();
const port = process.env.port || 8080;

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("newuser", function ({ roomId, username }) {
    socket.join(roomId);
    console.log(`${username} joined Room ID: ${roomId}`);
    socket.to(roomId).emit("update", `${username} joined the conversation`);
  });
  socket.on("chat", function ({ roomId, username, text }) {
    // console.log(`[Room ${roomId}] ${username}: ${text}`);
    socket.to(roomId).emit("chat", { username, text });
  });
  socket.on("voice", function ({roomId, username, audio }) {
    socket.to(roomId).emit("voice", {username, audio});
  });
  socket.on("exituser", function ({ roomId, username }) {
    console.log(`${username} left Room ID: ${roomId}`);
    socket.to(roomId).emit("update", `${username} left the conversation`);
    socket.leave(roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
