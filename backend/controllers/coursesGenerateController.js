const Groq = require("groq-sdk").default;

const generateCourse = async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("\n\n User Prompt:", prompt, "\n\n");

    // Initialize Groq client 
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Call Groq API to extract topic and description
    const message = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Extract ONLY topic name and description from this prompt. Return valid JSON with exactly these two keys: "topicName" and "description". 

Prompt: "${prompt}"

Example format:
{"topicName": "Topic Name Here", "description": "Description/requirements here"}`
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    // Extract response text
    const responseText = message.choices[0].message.content;
    
    // Parse JSON response
    const extractedData = JSON.parse(responseText);

    console.log("\n\n\nExtracted Data:\n\n\n", extractedData);

    // Send ONLY topic and description to frontend
    res.status(200).json({
      success: true,
      data: {
        topicName: extractedData.topicName,
        description: extractedData.description
      }
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { generateCourse };