const { GoogleGenAI } =  require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateContent(prompts) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompts,
  });
 return response.text;
}

module.exports = generateContent;