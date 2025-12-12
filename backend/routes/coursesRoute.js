const express = require("express");
const { generateCourse } = require("../controllers/coursesGenerateController.js");

const router = express.Router();

router.post("/generate", generateCourse);

module.exports = router;