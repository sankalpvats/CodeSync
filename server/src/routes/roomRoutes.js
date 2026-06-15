const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  createRoom,
  joinRoom,
  getRoom,
  updateCode,
} = require("../controllers/roomController");
const router = express.Router();

router.post(
  "/create",
  protect,
  createRoom
);
router.post(
  "/join",
  protect,
  joinRoom
);
router.get(
  "/:roomId",
  protect,
  getRoom
);
router.put(
  "/:roomId/code",
  protect,
  updateCode
);
module.exports = router;