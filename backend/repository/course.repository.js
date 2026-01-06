const Course = require("../models/course");

const findById = async (courseId) => {
  return Course.findById(courseId);
};

const getModule = async (courseId, moduleIndex) => {
  const course = await Course.findById(courseId);
  if (!course) return null;

  return course.modules.find(
    (m) => m.moduleIndex === Number(moduleIndex)
  );
};

const getLesson = async (courseId, moduleIndex, lessonIndex) => {
  const course = await Course.findById(courseId);
  if (!course) return null;

  const module = course.modules.find(
    (m) => m.moduleIndex === Number(moduleIndex)
  );
  if (!module) return null;


  return module.lessons.find(
    (l) => l.lessonIndex === Number(lessonIndex)
  );
};


const saveCourseOutlineToDB = async (course) => {
  const newCourse = await Course.create(course);
  return newCourse._id;
}


const findRecentCoursesByUser = async (userId, limit = 3) => {
  return await Course.find({ userId })
    .sort({ lastAccessedAt: -1 })
    .limit(limit)
    .select("title description lastAccessedAt");
};


const updateLastAccessed = async (courseId) => {
  return await Course.updateOne(
    { _id: courseId },     
    { $set: { lastAccessedAt: new Date() } }
  );
};



const markLessonCompleted = async ({
  courseId,
  userId,
  moduleIndex,
  lessonIndex,
}) => {
  const course = await Course.findOne({ _id: courseId, userId });
  if (!course) return null;

  const module = course.modules.find(
    (m) => m.moduleIndex === moduleIndex
  );
  if (!module) throw new Error("Module not found");

  const lesson = module.lessons.find(
    (l) => l.lessonIndex === lessonIndex
  );
  if (!lesson) throw new Error("Lesson not found");

  // Mark lesson completed
  lesson.isCompleted = true;

  // If all lessons completed → mark module completed
  const allLessonsCompleted = module.lessons.every(
    (l) => l.isCompleted
  );
  if (allLessonsCompleted) {
    module.isCompleted = true;
  }

  await course.save();
  return course;
};


const findLessonForUser = async ({
  courseId,
  userId,
  moduleIndex,
  lessonIndex,
}) => {
  const course = await Course.findOne({ _id: courseId, userId });
  if (!course) return null;

  const module = course.modules.find(
    (m) => m.moduleIndex === moduleIndex
  );
  if (!module) return null;

  const lesson = module.lessons.find(
    (l) => l.lessonIndex === lessonIndex
  );
  if (!lesson) return null;

  return {
    course,
    module,
    lesson,
  };
};

const checkLessonExistsForUser = async ({
  courseId,
  userId,
  moduleIndex,
  lessonIndex,
}) => {
  const course = await Course.findOne(
    {
      _id: courseId,
      userId,
      "modules.moduleIndex": moduleIndex,
      "modules.lessons.lessonIndex": lessonIndex,
    },
    { _id: 1 }
  );

  return !!course;
};

const saveLesson = async (
  courseId,
  userId,
  moduleIndex,
  lessonIndex,
  lessonObj
) => {
  // 1️⃣ Find course (ONLY ObjectId here)
  const course = await Course.findOne({ _id: courseId, userId });
  if (!course) return null;

  // 2️⃣ Find module by moduleIndex
  const module = course.modules.find(
    (m) => m.moduleIndex === Number(moduleIndex)
  );
  if (!module) return null;

  // 3️⃣ Find lesson by lessonIndex
  const lesson = module.lessons.find(
    (l) => l.lessonIndex === Number(lessonIndex)
  );
  if (!lesson) return null;

  // 4️⃣ Update lesson fields safely
  Object.assign(lesson, lessonObj);

  // 5️⃣ Mark lesson as generated if content exists
  if (lessonObj.content) {
    lesson.isGenerated = true;
  }

  // 6️⃣ Save parent document
  await course.save();

  return lesson;
};




module.exports = {
  findById,
  getModule,
  getLesson,
  saveCourseOutlineToDB,
  findRecentCoursesByUser,
  updateLastAccessed,
  markLessonCompleted,
    findLessonForUser,
  checkLessonExistsForUser,
saveLesson,
};
