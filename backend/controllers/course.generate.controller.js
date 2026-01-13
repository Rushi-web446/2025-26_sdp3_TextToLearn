const {
  generateOutlineService,
  generateLessonService,
  generateTopicAndDesciptionService,
  generateYouTubeQueryService,
} = require("../services/course.generate.service");

// [NEW] Import the YouTube video service
const { getYouTubeVideosService } = require("../services/YouTube.service");

const {
  getOutlinePrompt,
  getLessonPrompt,
  getTopicAndDesciptionExtractionPrompt,
  getYouTubeQueryPrompt,
} = require("../Prompts/helper.prompt");



const generateTopicAndDesciption = async (req, res) => {
  console.log("\n\n\n\n  --> reaching :  backend/controllers/course.generate.controller.js . \n\n\n");
  try {
    const prompt = await getTopicAndDesciptionExtractionPrompt(req.body);
    const data = await generateTopicAndDesciptionService({ prompt });
    return res.status(201).json({
      message: "course topic and descrptio generated Successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const generateOutline = async (req, res) => {
  console.log("\n\n\n\n  --> reaching :  backend/controllers/course.generate.controller.js . \n\n\n");
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
  console.log("\n\n\n\n  --> reaching :  backend/controllers/course.generate.controller.js . \n\n\n");
  try {
    const { courseId, moduleId, lessonId } = req.body;

    if (!courseId || !moduleId || !lessonId) {
      return res.status(400).json({
        message: "courseId, moduleId, lessonId are required",
      });
    }

    // 1. Generate Lesson Content
    const lessonPrompt = await getLessonPrompt(
      courseId,
      Number(moduleId),
      Number(lessonId)
    );

    if (!lessonPrompt) {
      return res.status(404).json({
        message: "Course / Module / Lesson not found",
      });
    }

    let data = await generateLessonService(lessonPrompt);

    // 2. Generate YouTube Query
    // We use the same IDs to get the prompt for the query
    const ytQueryPrompt = await getYouTubeQueryPrompt(
      courseId,
      Number(moduleId),
      Number(lessonId)
    );

    let queryData = null;
    if (ytQueryPrompt) {
      // Direct Service Call
      queryData = await generateYouTubeQueryService(ytQueryPrompt);
      data.ytvq = queryData;
    }

    // 3. Fetch YouTube Videos
    if (queryData && queryData.query) {
      // Direct Service Call
      // Note: The service expects just the query string if checking YouTube.service.js
      // But let's double check what queryData structure is. 
      // Based on generateYouTubeQueryService it returns JSON from LLM.
      // Based on YouTube.controller.js it expects req.body["data"]["query"].
      // So queryData most likely has a property 'query'.

      try {
        const yvData = await getYouTubeVideosService(queryData.query);
        data.ytv = yvData;
      } catch (ytError) {
        console.error("Failed to fetch YouTube videos:", ytError);
        // We don't fail the whole request if YT fails, just log it
        data.ytv = [];
      }
    }

    return res.status(201).json({
      message: "Lesson generated successfully",
      data,
    });
  } catch (error) {
    console.error("Error in generateLesson:", error);
    return res.status(400).json({ message: error.message });
  }
};



const generateYouTubeQueryController = async (req, res) => {
  console.log("\n\n\n\n  --> reaching :  backend/controllers/course.generate.controller.js . \n\n\n");

  console.log(`\n\n\n\n reaching ${__filename} \n\n\n\n`);

  try {
    const { courseId, moduleId, lessonId } = req.body;

    if (!courseId || !moduleId || !lessonId) {
      return res.status(400).json({
        message: "courseId, moduleId, lessonId are required",
      });
    }

    const prompt = await getYouTubeQueryPrompt(
      courseId,
      Number(moduleId),
      Number(lessonId)
    );

    if (!prompt) {
      return res.status(404).json({
        message: "Course / Module / Lesson not found",
      });
    }

    const data = await generateYouTubeQueryService(prompt);


    return res.status(201).json({
      message: "lesson generated sucessfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};






module.exports = { generateTopicAndDesciption, generateOutline, generateLesson, generateYouTubeQueryController };
