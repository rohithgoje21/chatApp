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
  console.log("A user connected", socket.id);
  socket.broadcast.emit("user-connect", socket.id+" joined the conversation");
  socket.on("chat-message", (msg) => {
    console.log("Message from", socket.id, ":", msg);
    io.emit("chat-message", msg);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    socket.broadcast.emit("user-disconnect", socket.id+" left the conversation");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
