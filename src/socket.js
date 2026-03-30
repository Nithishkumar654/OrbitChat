import { io } from "socket.io-client";

const socket = io("https://orbitchat-38y6.onrender.com");

socket.on("connect", () => {
  const user = localStorage.getItem("user");
  if (user) socket.emit("new-connection", user);
});

export default socket;
