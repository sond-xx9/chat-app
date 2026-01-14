const socket = io();
let pc;
let stream;
let voiceRoom;

function joinChat() {
  socket.emit("join_text", {
    username: chatName.value,
    room: chatRoom.value
  });
}

function send() {
  socket.emit("text_message", msg.value);
  msg.value = "";
}

socket.on("text_message", data => {
  messages.innerHTML += `<div><b>${data.user}:</b> ${data.text}</div>`;
});

async function joinVoice() {
  voiceRoom = document.getElementById("voiceRoom").value;

  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  pc = new RTCPeerConnection();

  stream.getTracks().forEach(t => pc.addTrack(t, stream));

  pc.onicecandidate = e => {
    if (e.candidate)
      socket.emit("ice", { room: voiceRoom, candidate: e.candidate });
  };

  pc.ontrack = e => {
    const audio = document.createElement("audio");
    audio.srcObject = e.streams[0];
    audio.autoplay = true;
  };

  socket.emit("join_voice", voiceRoom);
}

socket.on("user-joined", async () => {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit("offer", { room: voiceRoom, offer });
});

socket.on("offer", async data => {
  await pc.setRemoteDescription(data.offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit("answer", { room: voiceRoom, answer });
});

socket.on("answer", data => pc.setRemoteDescription(data.answer));
socket.on("ice", data => pc.addIceCandidate(data.candidate));
