const {
  generateOutlineService,
  generateLessonService,
  generateTopicAndDesciptionService,
} = require("../services/course.generate.service");


const {
  getOutlinePrompt,
  getLessonPrompt,
  getTopicAndDesciptionExtractionPrompt,
} = require("../Prompts/helper.prompt");




const generateTopicAndDesciption = async (req, res) => {
  try {
    const prompt = await getTopicAndDesciptionExtractionPrompt(req.body);
    const data = await generateTopicAndDesciptionService({prompt});
    return res.status(201).json({
      message:"course topic and descrptio generated Successfully",
      data,
    });
  } catch(error) {
    return res.status(400).json({ message: error.message});
  }
};

const generateOutline = async (req, res) => {
  try {
    const prompt = await getOutlinePrompt(req.body);
    if (!prompt) return null;

    const data = await generateOutlineService({ prompt });
    return res.status(201).json({
      message: "course Outline Generated sucsessfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const generateLesson = async (req, res) => {
  try {
    const { courseId, moduleId, lessonId } = req.body;

    if (!courseId || !moduleId || !lessonId) {
      return res.status(400).json({
        message: "courseId, moduleId, lessonId are required",
      });
    }

    const prompt = await getLessonPrompt(
      courseId,
      Number(moduleId),
      Number(lessonId)
    );

    if (!prompt) {
      return res.status(404).json({
        message: "Course / Module / Lesson not found",
      });
    }
    
    
    const data = await generateLessonService(prompt);

    console.log("\n\n\n\n 777777777777777777(((((((((  \n\n\n\n");
    console.log("\n\n &&&& \n\n\n", data);

    return res.status(201).json({
      message: "lesson generated sucessfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


module.exports = { generateTopicAndDesciption, generateOutline, generateLesson };
