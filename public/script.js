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

window.addEventListener("unload", () => {
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
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
