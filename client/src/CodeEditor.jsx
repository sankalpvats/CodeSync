import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

function CodeEditor() {
  const [code, setCode] = useState("");

  useEffect(() => {
    socket.emit("join-room", "test-room");

   socket.on("receive-code", (newCode) => {
  console.log("Received:", newCode);
  setCode(newCode);
});

    return () => {
      socket.off("receive-code");
    };
  }, []);

 const handleChange = (e) => {
  const newCode = e.target.value;

  console.log("Sending:", newCode);

  setCode(newCode);

  socket.emit("code-change", {
    roomId: "test-room",
    code: newCode,
  });
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>CodeSync</h1>

      <textarea
        value={code}
        onChange={handleChange}
        rows={20}
        cols={80}
      />
    </div>
  );
}

export default CodeEditor;