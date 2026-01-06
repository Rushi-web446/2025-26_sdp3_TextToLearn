const {
  saveCourseOutlineToDBService,
  getRecentCoursesService,
  completeLessonService,
  getCourseDetailsWithProgressService,

  getLessonContentService,
  checkLessonExistsService,
  saveLessonService,
} = require("../services/course.service");


const saveCourseOutlineToDB = async (req, res) => {
  try {
    console.log("))))))))))))))))))))))))))))))))))))))))))))))))))))))");
    const { outline, data } = req.body;
    const userId = req.user.id;

    // Support both formats: { outline: { data: ... } } or { data: ... }
    const actualOutline = outline?.data || data || outline;

    const savedCourse = await saveCourseOutlineToDBService({
      outline: actualOutline,
      userId,
    });

    return res.status(201).json({
      message: "Course outline saved successfully",
      courseId: savedCourse._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: error.message || "Saving course outline failed",
    });
  }
};

const getRecentCourses = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT middleware

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
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

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
  try {
    const courseId = req.params.id;
    const userId = req.user.id; // 🔐 trusted

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
    const courseId = req.params;
    const userId = req.user.id;

    const { moduleIndex, lessonIndex } = req.body;

    const data = await getLessonContentService({
      courseId,
      userId,
      moduleIndex: parseInt(moduleIndex),
      lessonIndex: parseInt(lessonIndex),
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

const checkLessonExists = async (req, res) => {
  try {
    const courseId = req.params;
    const userId = req.user.id;

    const { moduleIndex, lessonIndex } = req.body;

    const result = await checkLessonExistsService({
      courseId,
      userId,
      moduleIndex: parseInt(moduleIndex),
      lessonIndex: parseInt(lessonIndex),
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

    // We prefer the authenticated user
    const userId = req.user.id;

    // However, if the frontend sends userId and it's mostly for validation or admin purposes, we could check it.
    // For now, we trust req.user.id as the owner source of truth.
    // Also user requested: "requested with lessonobject , courseid, userid, moduleid, lessonid"
    // We expect `lesson` to be the "lessonobject".
    // We expect `moduleIndex` to come from `moduleid` (or named moduleIndex in body).
    // The user said "moduleid" in the prompt, but the repo uses "moduleIndex". 
    // I will look for both to be safe/helpful.

    const mIndex = moduleIndex || req.body.moduleid || req.body.moduleId;
    const lIndex = lessonIndex || req.body.lessonid || req.body.lessonId;
    const cId = courseId || req.body.courseid || req.body.courseId;
    const lObj = lesson || req.body.lessonobject;

    const saved = await saveLessonService({
      courseId: cId,
      userId,
      moduleIndex: mIndex,
      lessonIndex: lIndex,
      lesson: lObj,
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
};
