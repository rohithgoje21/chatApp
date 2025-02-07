const socket = io();

let uname;

document
  .querySelector(".join-screen #join-chat")
  .addEventListener("click", joinUser);

document
  .querySelector(".chat-screen #send-message")
  .addEventListener("click", sendMessage);

document
  .querySelector(".chat-screen #exit-chat")
  .addEventListener("click", exitUser);

function displaymessage(type, message) {
  if (type == "my") {
    let mymessage = document.createElement("div");
    mymessage.classList.add("my-message", "message");

    let name = document.createElement("div");
    name.classList.add("name");
    name.textContent = "You";

    let text = document.createElement("div");
    text.classList.add("text");
    text.textContent = message.text;

    let div = document.createElement("div");
    div.append(name, text);

    mymessage.appendChild(div);
    document.querySelector(".chat-screen .messages").appendChild(mymessage);
  } else if (type == "other") {
    let othermessage = document.createElement("div");
    othermessage.classList.add("other-message", "message");

    let name = document.createElement("div");
    name.classList.add("name");
    name.textContent = message.username;

    let text = document.createElement("div");
    text.classList.add("text");
    text.textContent = message.text;

    let div = document.createElement("div");
    div.append(name, text);

    othermessage.appendChild(div);
    document.querySelector(".chat-screen .messages").appendChild(othermessage);
  } else if (type == "update") {
    let update = document.createElement("div");

    if (message.includes("left")) {
      update.classList.add("update", "alert-danger");
      update.textContent = message;
    } else {
      update.classList.add("update", "alert-success");
      update.textContent = message;
    }
    document.querySelector(".chat-screen .messages").appendChild(update);
  }
  autoScroll();
}

socket.on("update", function (message) {
  displaymessage("update", message);
});
socket.on("chat", function (message) {
  displaymessage("other", message);
});

window.addEventListener("beforeunload", () => {
  socket.emit("exituser", uname);
});

function joinUser() {
  const username = document
    .querySelector(".join-screen #username-input")
    .value.trim();
  if (username !== "") {
    uname = username;
    socket.emit("newuser", uname);
    document.querySelector(".join-screen").classList.remove("active");
    document.querySelector(".chat-screen").classList.add("active");
  }
  document.querySelector(".join-screen #username-input").value = "";
}

function sendMessage() {
  let message = document
    .querySelector(".chat-screen #message-input")
    .value.trim();
  if (message !== "") {
    displaymessage("my", { username: uname, text: message });
    socket.emit("chat", {
      username: uname,
      text: message,
    });
  }
  document.querySelector(".chat-screen #message-input").value = "";
}

function exitUser() {
  socket.emit("exituser", uname);
  document.querySelector(".chat-screen").classList.remove("active");
  document.querySelector(".join-screen").classList.add("active");
}

document
  .querySelector(".join-screen #username-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      joinUser();
    }
  });

document
  .querySelector(".chat-screen #message-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
function autoScroll() {
  let container = document.querySelector(".chat-screen .messages");
  container.scrollTop = container.scrollHeight;
}

let mediaRecorder;
let audioChunks = [];
const recordBtn = document.querySelector("#record-voice");

// Start/Stop Recording
recordBtn.addEventListener("click", async () => {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    startRecording();
  } else {
    stopRecording();
  }
});

// Function to Start Recording
async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const audioURL = reader.result;
      socket.emit("voice", { username: uname, audio: audioURL });
      displayVoiceMessage("my", { username: uname, audio: audioURL });
    };
  };

  mediaRecorder.start();
  recordBtn.classList.add("recording");
}

// Function to Stop Recording
function stopRecording() {
  mediaRecorder.stop();
  recordBtn.classList.remove("recording");
}

// Function to Display Voice Messages
function displayVoiceMessage(type, message) {
  let audioMessage = document.createElement("div");
  audioMessage.classList.add(
    type === "my" ? "my-message" : "other-message",
    "message"
  );

  let name = document.createElement("div");
  name.classList.add("name");
  name.textContent = type === "my" ? "You" : message.username;

  let audioElement = document.createElement("audio");
  audioElement.controls = true;
  audioElement.src = message.audio;

  let div = document.createElement("div");
  div.append(name, audioElement);
  audioMessage.appendChild(div);
  document.querySelector(".chat-screen .messages").appendChild(audioMessage);
  autoScroll();
}

// Receive Voice Messages
socket.on("voice", (message) => {
  displayVoiceMessage("other", message);
});
