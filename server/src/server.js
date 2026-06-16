const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const Room = require("./models/Room");
const http = require("http");
const codeRoutes = require("./routes/codeRoutes");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

// Middleware first
app.use(cors());
app.use(express.json());

// Routes after middleware
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/code", codeRoutes);
app.get("/", (req, res) => {
    res.send("CodeSync Backend Running");
});

connectDB();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const roomUsers = {};
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

 socket.on("join-room", ({ roomId, username }) => {
  socket.join(roomId);

  if (!roomUsers[roomId]) {
    roomUsers[roomId] = [];
  }

  const alreadyExists = roomUsers[roomId].some(
    (user) => user.socketId === socket.id
  );

  if (!alreadyExists) {
    roomUsers[roomId].push({
      socketId: socket.id,
      username,
    });
  }

  console.log(
    "Room users:",
    roomUsers[roomId]
  );

  io.to(roomId).emit(
    "room-users",
    roomUsers[roomId]
  );
});
socket.on(
  "input-change",
  ({ roomId, input }) => {
    socket.to(roomId).emit(
      "receive-input",
      input
    );
  }
);
socket.on("output-change", ({ roomId, output }) => {
  socket.to(roomId).emit("receive-output", output);
});
  socket.on("code-change", async ({ roomId, code }) => {
  try {
    socket.to(roomId).emit(
      "receive-code",
      code
    );

    await Room.findOneAndUpdate(
      { roomId },
      { code }
    );

  } catch (error) {
    console.error(error);
  }
});
socket.on(
  "language-change",
  ({ roomId, language }) => {
    socket.to(roomId).emit(
      "receive-language",
      language
    );
  }
);
  socket.on("disconnect", () => {
  console.log("User Disconnected:", socket.id);

  for (const roomId in roomUsers) {
    roomUsers[roomId] = roomUsers[roomId].filter(
      (user) => user.socketId !== socket.id
    );

    io.to(roomId).emit(
      "room-users",
      roomUsers[roomId]
    );
  }
});
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});