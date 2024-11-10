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
  socket.on("newuser", function (username) {
    console.log(username+" joined the conversation");
    socket.broadcast.emit("update", username + " joined the conversation");
  });
  socket.on("chat", function(message) {
    console.log("Message from", message.username, ":", message.text);
    socket.broadcast.emit("chat", message);
  });
  socket.on("exituser", function (username) {
    console.log(username+" left the conversation");
    socket.broadcast.emit("update", username + " left the conversation");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});