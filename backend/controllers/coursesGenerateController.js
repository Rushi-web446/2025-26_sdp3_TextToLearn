const Groq = require("groq-sdk").default;
const { getOutline } = require("./getOutline");
const Course = require("../models/course");
const User = require("../models/user");

const generateCourse = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.id; // From protect middleware

    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt required" });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `
Extract ONLY topicName and description.
Return valid JSON only.

Prompt: "${prompt}"

Example:
{"topicName":"Topic","description":"Description"}
`,
        },
      ],
      temperature: 0.3,
    });

    const extracted = JSON.parse(response.choices[0].message.content);

    // 🔑 Robust JSON Extraction
    const extractJSON = (str) => {
      try {
        const jsonMatch = str.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch (e) {
        return null;
      }
    };

    let content = await getOutline(extracted.topicName, extracted.description);
    let parsedContent = extractJSON(content);

    if (!parsedContent) {
      console.error("CRITICAL: Failed to parse AI response into JSON. Raw content:", content);
      return res.status(500).json({
        success: false,
        message: "Failed to generate valid course structure. Please try again.",
        raw: content
      });
    }

    // 💾 Save to Database
    const structuredModules = parsedContent.modules.map((mod) => ({
      ...mod,
      topics: mod.topics.map((topic) => ({ title: topic, content: "" })),
    }));

    const newCourse = new Course({
      course: parsedContent.course,
      modules: structuredModules,
      userId: userId,
    });

    await newCourse.save();

    // 🔄 Link to User
    await User.findByIdAndUpdate(userId, {
      $push: { courses: newCourse._id },
    });

    console.log("SUCCESSFULLY SAVED COURSE TO DB");

    res.status(200).json({
      success: true,
      ...parsedContent,
    });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { generateCourse };
