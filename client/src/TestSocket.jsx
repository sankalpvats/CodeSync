import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL
);

function TestSocket() {
  useEffect(() => {
    console.log("Socket ID:", socket.id);

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      socket.emit("join-room", "test-room");
    });

    socket.on("user-joined", (id) => {
      console.log("New user joined:", id);
    });
  }, []);

  return <h1>Socket Connected</h1>;
}

export default TestSocket;