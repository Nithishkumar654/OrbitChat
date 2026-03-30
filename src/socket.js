import { io } from "socket.io-client";

const socket = io("http://localhost:3500");

socket.on("connect", () => {
  const user = localStorage.getItem("user");
  if (user) socket.emit("new-connection", user);
});

export default socket;
