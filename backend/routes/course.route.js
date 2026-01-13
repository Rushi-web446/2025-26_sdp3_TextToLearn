const express = require("express");
const { generateTopicAndDesciption, generateOutline, generateLesson, generateYouTubeQueryController } = require("../controllers/course.generate.controller.js");
// const { protect } = require("../middleware/auth.js"); // Removed legacy auth
const { saveCourseOutlineToDB, getRecentCourses, getCourseDetails,
  completeLesson,
  getCurrentLessonContent,
  checkLessonExists,
  saveLesson,
} = require("../controllers/course.controller.js");


const router = express.Router();

router.post("/extract", generateTopicAndDesciption);
router.post("/generate/outline", generateOutline);
router.post("/generate/lesson", generateLesson);
router.post("/generate/YTQ", generateYouTubeQueryController);
router.post("/save/outline", saveCourseOutlineToDB);
router.get("/recent", getRecentCourses);
router.get("/details/:id", getCourseDetails);
router.get("/complete/lesson/:id", completeLesson);

router.get("/get/lesson/:id", getCurrentLessonContent);
router.get("/check/lesson/:id", checkLessonExists);
router.post("/save/lesson", saveLesson);

// Mapped /generate to generateOutline to match Frontend Home.js call
router.post("/generate", generateOutline);

// router.get("/:id/module/:moduleIndex/topic/:topicIndex", protect, getTopicContent);
// router.post("/:id/complete-topic", protect, completeTopicAndGetNext);
// router.post("/generate/:moduleIndex", protect, generateCourseModule);


module.exports = router;