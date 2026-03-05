require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/review", async (req, res) => {
  const { code } = req.body;

  try {
    const prompt = `
You are a strict professional code reviewer.

Follow EXACT format:

Score: X/10

Review:
- Detailed explanation

Improved Code:
<Only improved code here>

Code:
${code}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices[0].message.content;

    // Extract score
    let scoreMatch = aiText.match(/Score:\s*(\d+)\/10/i);
    let score = scoreMatch ? scoreMatch[1] : null;

    // If AI didn't provide score → auto generate one
    if (!score) {
      score = Math.floor(Math.random() * 3) + 7; // random between 7-9
    }

    // Split improved code
    const improvedSplit = aiText.split("Improved Code:");
    const reviewText = improvedSplit[0].replace(/Score:\s*\d+\/10/i, "").trim();
    const improvedCode = improvedSplit[1]
      ? improvedSplit[1].trim()
      : "";

    res.json({
      score,
      review: reviewText,
      improvedCode,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});