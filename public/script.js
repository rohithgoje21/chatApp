const socket = io();

let uname;

document
  .querySelector(".join-screen #join-chat")
  .addEventListener("click", function () {
    const username = document
      .querySelector(".join-screen #username-input")
      .value.trim();
    if (username !== "") {
      socket.emit("newuser", username);
      uname = username;
      document.querySelector(".join-screen").classList.remove("active");
      document.querySelector(".chat-screen").classList.add("active");
      document.querySelector(".join-screen #username-input").value = "";
    }
  });
document
  .querySelector(".chat-screen #exit-chat")
  .addEventListener("click", function () {
    socket.emit("exituser", uname);
    document.querySelector(".chat-screen").classList.remove("active");
    document.querySelector(".join-screen").classList.add("active");
  });


// socket.on("newuser", function (username) {
//   document.querySelector(".chat-screen.update").innerHTML += `<li>${username}</li>`;
// });

// socket.on("exituser", function (username) {
//   document.querySelector(`.chat-screen.update li:contains(${username})`).remove();
// });