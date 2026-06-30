const express = require("express");
const router = express.Router();
console.log("Auth Routes Loaded");
const {
  registerUser,
  loginUser,
  googleLogin,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
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