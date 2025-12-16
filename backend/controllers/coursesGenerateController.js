const Groq = require("groq-sdk").default;
const { getOutline } = require("./getOutline");

const generateCourse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt required" });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
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
`
        }
      ],
      temperature: 0.3
    });

    const extracted = JSON.parse(
      response.choices[0].message.content
    );

    // 🔑 Pass values safely
    await getOutline(extracted.topicName, extracted.description);

    res.status(200).json({
      success: true,
      data: extracted
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { generateCourse };
