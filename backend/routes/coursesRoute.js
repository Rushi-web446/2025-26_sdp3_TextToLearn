const express = require("express");
const { generateCourse, generateCourseModule } = require("../controllers/coursesGenerateController.js");
const { getRecentCourses, getCourseDetails, getTopicContent, completeTopicAndGetNext } = require("../controllers/courseController.js");

const { protect } = require("../middleware/auth.js");

const router = express.Router();

router.get("/recent", protect, getRecentCourses);
router.get("/:id", protect, getCourseDetails);
router.get("/:id/module/:moduleIndex/topic/:topicIndex", protect, getTopicContent);
router.post("/:id/complete-topic", protect, completeTopicAndGetNext);
router.post("/generate", protect, generateCourse);
router.post("/generate/:moduleIndex", protect, generateCourseModule);


module.exports = router;