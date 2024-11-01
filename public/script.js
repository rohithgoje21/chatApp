const socket = io();
const messages = document.getElementById("messages");
const form = document.getElementById("inputMsgForm");
const input = document.getElementById("input");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value;
  if (message) {
    socket.emit("chat-message", message);
    input.value = "";
  }
});

socket.on("user-connect", (message) => {
  messages.innerHTML += `<div class="alert alert-success" role="alert" style="width: fit-content">
  Id: ${message}
</div>`
});

socket.on("chat-message", (message) => {
    messages.innerHTML += `<div class="card" style="width: fit-content">
    <div class="card-header">Id: ${socket.id}</div>
    <div class="card-body">${message}</div>
  </div>`;
});

socket.on("user-disconnect", (message) => {
    messages.innerHTML += `<div class="alert alert-danger" role="alert" style="width: fit-content">
    Id: ${message}
  </div>`
});
