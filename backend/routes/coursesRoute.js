const express = require("express");
const { generateCourse } = require("../controllers/coursesGenerateController.js");

const { protect } = require("../middleware/auth.js");

const router = express.Router();

router.post("/generate", protect, generateCourse);

module.exports = router;