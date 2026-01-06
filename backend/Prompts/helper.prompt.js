const fs = require("fs");
const path = require("path");
const {
  findById,
  getModule,
  getLesson,
} = require("../repository/course.repository");

const getOutlinePrompt = ({ topic, description }) => {
  const filePath = path.join(__dirname, "./outline.prompt");
  const prompt = fs.readFileSync(filePath, "utf-8");

  const finalPrompt = prompt
    .replaceAll("{{topic}}", topic)
    .replaceAll("{{description}}", description);

  return finalPrompt;
};

const getLessonPrompt = async (courseId, moduleId, lessonId) => {


  const course = await findById(courseId);
  if (!course) return null;

  const module = await getModule(courseId, moduleId);
  if (!module) return null;

  const lesson = await getLesson(courseId, moduleId, lessonId);
  if (!lesson) return null;
  // console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");

  const filePath = path.join(__dirname, "./lesson.prompt");
  let prompt = fs.readFileSync(filePath, "utf-8");

  const finalPrompt = prompt
    .replaceAll("(replace when calling)", "")
    .replaceAll("{{course.title}}", course.title)
    .replaceAll("{{course.courseObjective}}", course.courseObjective)
    .replaceAll("{{course.durationDays}}", String(course.durationDays))
    .replaceAll("{{module.moduleIndex}}", String(module.moduleIndex))
    .replaceAll("{{module.title}}", module.title)
    .replaceAll("{{module.moduleObjective}}", module.moduleObjective)
    .replaceAll("{{module.prerequisites}}", JSON.stringify(module.prerequisites))
    .replaceAll(
      "{{module.coveredConcepts}}",
      JSON.stringify(module.coveredConcepts)
    )
    .replaceAll(
      "{{module.excludedConcepts}}",
      JSON.stringify(module.excludedConcepts)
    )
    .replaceAll("{{lesson.title}}", lesson.title)
    .replaceAll("{{lesson.briefDescription}}", lesson.briefDescription)
    .replaceAll("{{lesson.estimatedTime}}", String(lesson.estimatedTime))
    .replaceAll("{{lesson.deliverables}}", lesson.deliverables);

  // console.log("\n\n\n\n", finalPrompt, "\n\n\n\n\n");

  return finalPrompt;
};


const getTopicAndDesciptionExtractionPrompt = async ({ prompt }) => {
  const filePath = path.join(__dirname, "./extraction.prompt");
  const tempPrompt = fs.readFileSync(filePath, "utf-8");

  const finalPrompt = tempPrompt.replaceAll("{{prompt}}", prompt);
  return finalPrompt;

}

module.exports = { getOutlinePrompt, getLessonPrompt, getTopicAndDesciptionExtractionPrompt };
