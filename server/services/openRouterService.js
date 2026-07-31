const axios = require("axios");

const askAi = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is empty or invalid.");
    }

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY environment variable is not defined.");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-distill-llama-70b",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.YOUR_SITE_NAME || "My Application",
        },
      }
    );

    let content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error("AI returned an empty response.");
    }

    // Strips out DeepSeek R1 reasoning/thinking tags <think>...</think> if present
    content = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    return content;
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.error?.message || error.message || "OpenRouter API Error"
    );
  }
};

module.exports = { askAi };