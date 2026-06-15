const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");
const createRoom = async (req, res) => {
  try {
    const roomId = uuidv4();

    const room = await Room.create({
      roomId,
      createdBy: req.user.id,
      participants: [req.user.id],
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Prevent duplicate participants
    const alreadyJoined = room.participants.some(
  participant =>
    participant.toString() === req.user.id
);

if (!alreadyJoined) {
  room.participants.push(req.user.id);
  await room.save();
}

    res.status(200).json({
      message: "Joined room successfully",
      room,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId })
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json(room);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const updateCode = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { code } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomId },
      { code },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json({
      message: "Code updated successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  updateCode,
};