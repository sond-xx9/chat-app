const socket = io();

const input = document.getElementById("input");
const messages = document.getElementById("messages");

socket.on("connect", () => {
  console.log("connected");
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value.trim() !== "") {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", (msg) => {
  const div = document.createElement("div");
  div.textContent = msg;
  messages.appendChild(div);
});
