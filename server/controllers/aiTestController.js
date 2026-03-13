import axios from "axios";

const models = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "openai/gpt-oss-120b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openrouter/hunter-alpha"
];

// Extract JSON safely
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export const testAI = async (req, res) => {
  try {

    const messages = [
      {
        role: "system",
        content: `
You are an Ayurvedic health assistant.

Respond ONLY in JSON format.

Schema:
{
  "symptom_summary": "",
  "dosha_imbalance": {
    "vata": "",
    "pitta": "",
    "kapha": ""
  },
  "herbal_remedies": [],
  "therapies": [],
  "diet_plan": [],
  "lifestyle_suggestions": [],
  "safety_notes": []
}
`
      },
      {
        role: "user",
        content: "Symptoms: insomnia, stress, restless sleep"
      }
    ];

    let lastError = null;

    for (const model of models) {
      try {

        console.log("Trying model:", model);

        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages,
            temperature: 0.3
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "PrakritiAI"
            },
            timeout: 20000
          }
        );

        let aiText = response.data.choices[0].message.content;

        const parsed = extractJSON(aiText);

        if (!parsed) {
          throw new Error("Invalid JSON response from model");
        }

        return res.json({
          success: true,
          modelUsed: model,
          data: parsed
        });

      } catch (err) {

        lastError = err.response?.data || err.message;

        console.log("Model failed:", model);
        console.log(lastError);

        continue;
      }
    }

    return res.status(500).json({
      success: false,
      error: "All models failed",
      details: lastError
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: "AI request failed"
    });
  }
};