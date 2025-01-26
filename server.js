const express = require("express");
const db = require("./database/create");

const app = express();
const port = process.env.port || 8080;

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// Initialize database connection
const mongoose = require("mongoose");
db(); // Connect to the database

// Import the Message model
const Message = mongoose.model("Message");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("newuser", async (username) => {
    console.log(`${username} joined the conversation`);
    socket.broadcast.emit("update", `${username} joined the conversation`);

    try {
      const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
      socket.emit("chat-history", messages.reverse());
    } catch (error) {
      console.error("Error retrieving chat history:", error);
    }
  });
  // Save and broadcast new messages
  socket.on("chat", async (message) => {
    // console.log("Message from", message.username, ":", message.text);
    socket.broadcast.emit("chat", message);

    try {
      const newMessage = new Message({
        username: message.username,
        text: message.text,
      });
      await newMessage.save(); // Save the message to MongoDB
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
  // Notify others when a user exits
  socket.on("exituser", (username) => {
    console.log(`${username} left the conversation`);
    socket.broadcast.emit("update", `${username} left the conversation`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
