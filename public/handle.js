(function () {
  const app = document.querySelector(".app-container");
  const socket = io();

  let curruser;

  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", function () {
      let username = app.querySelector(".join-screen #username").value;
      if (username.length == 0) {
        return;
      }
      socket.emit("new-user", username);
      curruser = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
    });

  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", function () {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
        return;
      }
      displayMessage("my", {
        username: curruser,
        text: message,
      });
      socket.emit("chat", {
        username: curruser,
        text: message,
      });
      app.querySelector(".chat-screen #message-input").value = "";
    });

  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", function () {
      socket.emit("exit-user", curruser);
      window.location.href = window.location.href;
      socket.emit("exit-user", curruser);
    });

  socket.on("update", function (update) {
    displayMessage("update", update);
  });

  socket.on("chat", function (message) {
    displayMessage("other", message);
  });

  function displayMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let element = document.createElement("div");
      element.setAttribute("class", "message my-message");
      element.innerHTML = `
				<div>
					<div class="name">You</div>
					<div class="text">${message.text}</div>
				</div>
			`;
      messageContainer.appendChild(element);
    } else if (type == "other") {
      let element = document.createElement("div");
      element.setAttribute("class", "message other-message");
      element.innerHTML = `
				<div>
					<div class="name">${message.username}</div>
					<div class="text">${message.text}</div>
				</div>
			`;
      messageContainer.appendChild(element);
    } else if (type == "update") {
      let element = document.createElement("div");
      element.setAttribute("class", "update");
      element.innerText = message;
      console.log(`Message is ${message}`);
      messageContainer.appendChild(element);
    }
    // scroll chat to end
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
