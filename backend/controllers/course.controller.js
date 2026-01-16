const {
  saveCourseOutlineToDBService,
  getRecentCoursesService,
  completeLessonService,
  getCourseDetailsWithProgressService,

  getLessonContentService,
  checkLessonExistsService,
  saveLessonService,
  getYouTubeVideosService,
} = require("../services/course.service");


const saveCourseOutlineToDB = async (req, res) => {
  try {
    const outline = req.body;
    const userId = req.appUser._id;

    console.log("OUTLINE RECEIVED:", JSON.stringify(outline, null, 2));

    const savedCourseId = await saveCourseOutlineToDBService({
      outline,
      userId,
    });

    return res.status(201).json({
      message: "Course outline saved successfully",
      courseId: savedCourseId,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Saving course outline failed",
    });
  }
};


const getRecentCourses = async (req, res) => {
  console.log("\n\n\n\n  --> reaching :  backend/controllers/course.controller.js . \n\n\n");
  try {
    const userId = req.appUser._id; // comes from JWT middleware

    const courses = await getRecentCoursesService(userId);

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("ERROR FETCHING RECENT COURSES:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCourseDetails = async (req, res) => {
  console.log("\n\n\n\n  --> reaching :  backend/controllers/course.controller.js . \n\n\n");
  try {
    const courseId = req.params.id;
    const userId = req.appUser._id;

    const result = await getCourseDetailsWithProgressService(courseId, userId);

    return res.status(200).json({
      success: true,
      course: result.course,
      progress: result.progress,
    });
  } catch (error) {
    console.error("ERROR FETCHING COURSE DETAILS:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const completeLesson = async (req, res) => {
  console.log("\n\n\n\n  --> reaching :  backend/controllers/course.controller.js . \n\n\n");
  try {
    const courseId = req.params.id;
    const userId = req.appUser._id; // 🔐 trusted

    const { moduleIndex, lessonIndex } = req.body;

    const result = await completeLessonService({
      courseId,
      userId,
      moduleIndex,
      lessonIndex,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("ERROR COMPLETING LESSON:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getCurrentLessonContent = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.appUser._id;
    const { moduleIndex, lessonIndex } = req.query;

    if (moduleIndex === null || lessonIndex === null) {
      return res.status(400).json({
        success: false,
        message: "moduleIndex and lessonIndex required",
      });
    }

    const data = await getLessonContentService({
      courseId,
      userId,
      moduleIndex: Number(moduleIndex),
      lessonIndex: Number(lessonIndex),
    });

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("ERROR FETCHING LESSON CONTENT:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


const getYouTubeVideos = async (req, res) => {
  try {
    const query = req.body?.data?.query;
    if (!query) throw new Error("Query missing");

    const videos = await getYouTubeVideosService(query);
    return res.status(200).json(videos);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};




const checkLessonExists = async (req, res) => {
  console.log("➡️ CHECK LESSON EXISTS");

  try {
    const courseId = req.params.id; // ✅ FIX
    const userId = req.appUser._id;

    const { moduleIndex, lessonIndex } = req.query; // ✅ GET → query

    if (moduleIndex === null || lessonIndex === null) {
      return res.status(400).json({
        success: false,
        message: "moduleIndex and lessonIndex required",
      });
    }

    const result = await checkLessonExistsService({
      courseId,
      userId,
      moduleIndex: Number(moduleIndex),
      lessonIndex: Number(lessonIndex),
    });

    return res.status(200).json({
      success: true,
      exists: result.exists,
    });
  } catch (error) {
    console.error("ERROR CHECKING LESSON:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const saveLesson = async (req, res) => {
  try {
    const { courseId, moduleIndex, lessonIndex, lesson } = req.body;
    const userId = req.appUser._id;

    if (!courseId || moduleIndex === null || lessonIndex === null || !lesson) {
      return res.status(400).json({
        success: false,
        message: "Missing required lesson data",
      });
    }

    const saved = await saveLessonService({
      courseId,
      userId,
      moduleIndex: Number(moduleIndex),
      lessonIndex: Number(lessonIndex),
      lesson,
    });

    return res.status(200).json({
      success: true,
      message: "Lesson saved successfully",
      lesson: saved,
    });
  } catch (error) {
    console.error("ERROR SAVING LESSON:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  saveCourseOutlineToDB,
  getRecentCourses,
  getCourseDetails,
  completeLesson,
  getCurrentLessonContent,
  checkLessonExists,
  saveLesson,
  getYouTubeVideos,
};
