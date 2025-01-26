const mongoose = require("mongoose");

function db() {
  // Connect to MongoDB
  mongoose
    .connect("mongodb://localhost:27017/chatapp")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Database Connection Error:", err);
    });

  // Define the message schema
  const messageSchema = new mongoose.Schema({
    username: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  });

  // Create the Message model
  mongoose.model("Message", messageSchema);
}

module.exports = db;
