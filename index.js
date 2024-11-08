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




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });