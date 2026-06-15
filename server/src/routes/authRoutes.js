const express = require("express");
console.log("Auth Routes Loaded");
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working" });
});
router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json({
      message: "Protected Route",
      user: req.user,
    });
  }
);
module.exports = router;