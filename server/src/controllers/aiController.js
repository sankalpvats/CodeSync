const axios = require("axios");

const PROMPTS = {
  review: (language, code) => `Review this ${language} code.

Return:
1. Overall Score
2. Bugs
3. Performance
4. Readability
5. Improved Code

${code}`,
  explain: (language, code) => `Explain this ${language} code in simple language.

${code}`,
  debug: (language, code) => `Find all bugs in this ${language} code and fix them.

${code}`,
  optimize: (language, code) => `Optimize this ${language} code for performance and readability.

${code}`,
};

const reviewCode = async (req, res) => {
  try {
    const { action, language, code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: "No code provided" });
    }
    if (!PROMPTS[action]) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    const prompt = PROMPTS[action](language || "plaintext", code);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3n-e4b-it",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      review: response.data.choices[0].message.content,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "AI Review Failed",
    });
  }
};

module.exports = { reviewCode };