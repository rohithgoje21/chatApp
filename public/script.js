const socket = io();

let uname;

document
  .querySelector(".join-screen #join-chat")
  .addEventListener("click", function () {
    const username = document
      .querySelector(".join-screen #username-input")
      .value.trim();
    if (username !== "") {
      uname = username;
      socket.emit("newuser", uname);
      displaymessage("update", {
        username: uname,
        text: " joined the conversation",
      });
      document.querySelector(".join-screen").classList.remove("active");
      document.querySelector(".chat-screen").classList.add("active");
    }
    document.querySelector(".join-screen #username-input").value = "";
  });

document
  .querySelector(".chat-screen #send-message")
  .addEventListener("click", function () {
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
  });

document
  .querySelector(".chat-screen #exit-chat")
  .addEventListener("click", function () {
    socket.emit("exituser", uname);
    displaymessage("update", {
      username: uname,
      text: " left the conversation",
    });
    document.querySelector(".chat-screen").classList.remove("active");
    document.querySelector(".join-screen").classList.add("active");
  });

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

    othermessage.appendChile(div);
    document.querySelector(".chat-screen .messages").appendChild(othermessage);
  } else {
    let update = document.createElement("div");
    update.classList.add("update");
    update.textContent = message.username + message.text;
    document.querySelector(".chat-screen .messages").appendChild(update);
  }
}
