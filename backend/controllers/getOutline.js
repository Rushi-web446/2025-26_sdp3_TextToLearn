const Groq = require("groq-sdk").default;
const fs = require("fs");
const path = require("path");

// Load outline prompt
const prompt = fs.readFileSync(
  path.join(__dirname, "../Prompts/first.txt"),
  "utf-8"
);

const getOutline = async (topicName, description) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `
Topic: ${topicName}
Description: ${description}

${prompt}

Return valid JSON only.
`
      }
    ],
    max_tokens: 3000,
    temperature: 0.3
  });

  // 🔐 GUARANTEED CONTENT
  const raw = response?.choices?.[0]?.message?.content;
  let content =
    raw && raw.trim().length > 0
      ? raw
      : JSON.stringify(response, null, 2);


      content = content.replace(/```json|```/g, "").trim();

  // const outputPath = path.join(__dirname, "../output.json");
  // fs.writeFileSync(outputPath, content, "utf-8");

  // console.log("✅ Outline saved:", outputPath);

  return content;
};

module.exports = { getOutline };









// const Groq = require("groq-sdk").default;
// const fs = require("fs");
// const path = require("path");

// // Load outline prompt
// const prompt = fs.readFileSync(
//   path.join(__dirname, "../Prompts/first.txt"),
//   "utf-8"
// );

// const getOutline = async (topicName, description) => {
//   const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY
//   });

//   const response = await groq.chat.completions.create({
//     model: "llama-3.1-8b-instant",
//     messages: [
//       {
//         role: "user",
//         content: `
// Topic: ${topicName}
// Description: ${description}

// ${prompt}

// Return valid JSON only.
// `
//       }
//     ],
//     max_tokens: 3000,
//     temperature: 0.3
//   });

//   // 🔐 GUARANTEED CONTENT
//   const raw = response?.choices?.[0]?.message?.content;
//   let content =
//     raw && raw.trim().length > 0
//       ? raw
//       : JSON.stringify(response, null, 2);

//       content = content.replace(/```json|```/g, "").trim();



//       return content;

// };

// module.exports = { getOutline };
