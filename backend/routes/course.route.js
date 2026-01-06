const express = require("express");
const { generateTopicAndDesciption, generateOutline, generateLesson } = require("../controllers/course.generate.controller.js");
const { protect } = require("../middleware/auth.js");
const { saveCourseOutlineToDB, getRecentCourses, getCourseDetails,
  completeLesson,
  getCurrentLessonContent,
  checkLessonExists,
  saveLesson,
} = require("../controllers/course.controller.js");


const router = express.Router();

router.post("/extract", protect, generateTopicAndDesciption);
router.post("/generate/outline", protect, generateOutline);
router.post("/generate/lesson", protect, generateLesson);
router.post("/save/outline", protect, saveCourseOutlineToDB);
router.get("/recent", protect, getRecentCourses);
router.get("/details/:id", protect, getCourseDetails);
router.get("/complete/lesson/:id", protect, completeLesson);

router.get("/get/lesson/:id", protect, getCurrentLessonContent);
router.get("/check/lesson/:id", protect, checkLessonExists);
router.post("/save/lesson", protect, saveLesson);





// router.get("/:id/module/:moduleIndex/topic/:topicIndex", protect, getTopicContent);
// router.post("/:id/complete-topic", protect, completeTopicAndGetNext);
// router.post("/generate", protect, generateCourse);
// router.post("/generate/:moduleIndex", protect, generateCourseModule);


module.exports = router;