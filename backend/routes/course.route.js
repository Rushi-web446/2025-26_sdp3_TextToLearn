const express = require("express");
const { generateTopicAndDesciption, generateOutline, generateLesson, generateYouTubeQueryController } = require("../controllers/course.generate.controller.js");
// const { protect } = require("../middleware/auth.js"); // Removed legacy auth
const { saveCourseOutlineToDB, getRecentCourses, getCourseDetails,
  completeLesson,
  getCurrentLessonContent,
  checkLessonExists,
  saveLesson,
  getYouTubeVideos,
} = require("../controllers/course.controller.js");

const checkJwt = require("../middleware/auth.middleware");
const syncUser = require("../middleware/user.sync.middleware");


const router = express.Router();

router.post("/extract", checkJwt, syncUser, generateTopicAndDesciption);
router.post("/generate/outline", checkJwt, syncUser, generateOutline);
router.post("/save/outline", checkJwt, syncUser, saveCourseOutlineToDB);

router.get("/recent", checkJwt, syncUser, getRecentCourses);
router.get("/details/:id", checkJwt, syncUser, getCourseDetails); // get current (module, lesson)
router.get("/check/lesson/:id", checkJwt, syncUser, checkLessonExists);


router.post("/generate/lesson", checkJwt, syncUser, generateLesson);
router.post("/save/lesson", checkJwt, syncUser, saveLesson);
router.get("/get/lesson/:id", checkJwt, syncUser, getCurrentLessonContent);

// router.post("/generate/YTQ", checkJwt, syncUser, generateYouTubeQueryController);
// router.post("/get/utube", checkJwt, syncUser, getYouTubeVideos);


router.post("/generate/YTQ", generateYouTubeQueryController);
router.post("/get/utube", getYouTubeVideos);




router.get("/complete/lesson/:id", checkJwt, syncUser, completeLesson);


// Mapped /generate to generateOutline to match Frontend Home.js call
router.post("/generate", checkJwt, syncUser, generateOutline);

// router.get("/:id/module/:moduleIndex/topic/:topicIndex", checkJwt, syncUser, protect, getTopicContent);
// router.post("/:id/complete-topic", checkJwt, syncUser, protect, completeTopicAndGetNext);
// router.post("/generate/:moduleIndex", checkJwt, syncUser, protect, generateCourseModule);


module.exports = router;