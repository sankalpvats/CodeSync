const express = require("express");
const router = express.Router();

const { reviewCode } = require("../controllers/aiController");

router.post("/review", reviewCode);

module.exports = router;