import axios from "axios";
import SymptomReport from "../models/SymptomReport.js";


const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

const models = [
  "nvidia/nemotron-3.5-super-vl:free",
  "nvidia/nemotron-3.5-lightning:free",
  "liquid/lfm-2.5-2.6b:free",
  "google/gemma-4-26b-a4b-it:free",
  "openrouter/free",
];

const DEFAULT_INVALID_SYMPTOM_EXAMPLES = [
  "burning sensation in chest after meals",
  "mouth ulcers with pain and burning",
  "restless sleep and anxiety at night",
  "bloating and constipation for 2 weeks",
  "joint pain with morning stiffness",
];

function isMeaningfulSymptomsText(text) {
  if (!text || typeof text !== "string") return false;
  const s = text.trim();
  if (s.length < 3) return false;

  const letters = (s.match(/[a-z]/gi) || []).length;
  if (letters === 0) return false;

  // Reject obvious keyboard-mash / repeating characters.
  if (/(.)\1{3,}/i.test(s)) return false;

  // If it's a single long token, require some vowel presence.
  const hasSpace = /\s/.test(s);
  if (!hasSpace && s.length > 10) {
    const vowels = (s.match(/[aeiou]/gi) || []).length;
    const vowelRatio = vowels / Math.max(1, letters);
    if (vowelRatio < 0.2) return false;
  }

  return true;
}

function extractJSON(text) {
  if (!text || typeof text !== "string") return null;

  // Strip reasoning blocks <think>...</think> if returned by reasoning models
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    // Attempt minor fixes like trailing commas
    try {
      const sanitized = match[0].replace(/,\s*([}\]])/g, "$1");
      return JSON.parse(sanitized);
    } catch {
      return null;
    }
  }
}

async function validateSymptomsInput({
  openRouterApiKey,
  symptoms,
  additional_details,
  timeoutMs = 15000,
}) {
  const systemPrompt = `You are validating whether the user provided real health symptoms.

Return ONLY valid JSON.

Schema:
{
  "valid": true|false,
  "message": "",
  "examples": [""]
}

Rules:
- valid=false if the input looks like random letters/gibberish, contains no symptom meaning, or is too vague to analyze.
- If valid=false, provide a helpful message and 3-6 example symptom phrases.
- If valid=true, message can be empty and examples can be an empty array.`;

  const userPrompt = `Text to validate:
Symptoms: ${String(symptoms || "")}
Additional details: ${String(additional_details || "")}`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const response = await axios.post(
        OPENROUTER_ENDPOINT,
        {
          model,
          messages,
          temperature: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${openRouterApiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "PrakritiAI",
          },
          timeout: timeoutMs,
        }
      );

      const aiText = response?.data?.choices?.[0]?.message?.content;
      const parsed = extractJSON(aiText);
      if (!parsed || typeof parsed.valid !== "boolean") {
        throw new Error("Invalid JSON validation response from model");
      }

      const examples = Array.isArray(parsed.examples)
        ? parsed.examples.filter(Boolean).slice(0, 6)
        : [];

      return {
        status: "success",
        valid: parsed.valid,
        message: typeof parsed.message === "string" ? parsed.message : "",
        examples,
      };
    } catch (error) {
      lastError = error.response?.data || error.message;
      continue;
    }
  }

  // All models failed (network, timeouts, rate limits, 5xx, or 4xx)
  return {
    status: "unavailable",
    error: lastError,
  };
}


/**
 * AI Symptom Analysis
 */
export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, age, gender, duration, severity, additional_details } =
      req.body;

    if (!symptoms || !age || !gender) {
      return res.status(400).json({
        message: "symptoms, age, and gender are required",
      });
    }

    // Fast local heuristic: reject obvious keyboard mash immediately without waiting for AI
    if (!isMeaningfulSymptomsText(symptoms)) {
      return res.status(422).json({
        detail: {
          message:
            "No recognized symptoms were found in your input. Please describe symptoms using clear phrases.",
          examples: DEFAULT_INVALID_SYMPTOM_EXAMPLES,
        },
      });
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return res.status(500).json({
        message: "OPENROUTER_API_KEY is not configured",
      });
    }

    const validation = await validateSymptomsInput({
      openRouterApiKey,
      symptoms,
      additional_details,
    });

    // If all validation AI models were down or unreachable
    if (validation.status === "unavailable") {
      return res.status(503).json({
        message: "Please try again later. We are facing temporary downtime.",
        code: "AI_UNAVAILABLE",
        details: validation.error,
      });
    }

    // If AI explicitly analyzed and determined symptoms are invalid/unrecognized
    if (!validation.valid) {
      return res.status(422).json({
        detail: {
          message:
            validation.message ||
            "No recognized symptoms were found in your input. Please describe symptoms using clear phrases.",
          examples:
            validation.examples.length > 0
              ? validation.examples
              : DEFAULT_INVALID_SYMPTOM_EXAMPLES,
        },
      });
    }

    const systemPrompt = `You are an Ayurvedic wellness assistant.

Return ONLY valid JSON (no markdown, no extra text).

The JSON MUST follow this schema and key names exactly:
{
  "detected_conditions": [""],
  "dosha_imbalance": ["Vata"|"Pitta"|"Kapha"|"Mixed"],
  "immediate_solutions": [""],
  "remedies": [
    {
      "title": "",
      "description": "",
      "usage": "",
      "dosha_effect": [""],
      "contraindications": [""]
    }
  ],
  "lifestyle_tips": [""],
  "disclaimer": "",

  "reasoning": "",
  "severity": "mild"|"moderate"|"severe"|"unknown",
  "diet_tips": [""],
  "therapies": [{"name":"","description":""}],
  "safety_notes": [""],
  "cautions": [""],
  "dosha_scores": {"Vata": 0, "Pitta": 0, "Kapha": 0}
}

Rules:
- Always include all top-level keys (use empty arrays/strings if unsure).
- Keep dosha_scores integers 0-10.
- immediate_solutions must provide exactly 1-3 short, actionable, first-aid style remedies for quick relief right now.
- Remedies must be objects (not strings). Use 3-7 remedies.
- Use the provided Duration and Severity (1-10) to calibrate the response: longer/higher severity should lead to more cautious safety notes, clearer reasoning, and more supportive lifestyle/diet guidance.
- Safety: include a clear disclaimer and non-alarming safety notes; advise consulting a clinician for serious symptoms.`;

    const userPrompt = `User input:
Symptoms: ${String(symptoms)}
Age: ${Number(age)}
Gender: ${String(gender)}
Duration: ${String(duration || "")}
Severity (1-10): ${Number.isFinite(Number(severity)) ? Number(severity) : ""}
Additional details: ${String(additional_details || "")}`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    let aiResponse = null;
    let lastError = null;

    for (const model of models) {
      try {
        const response = await axios.post(
          OPENROUTER_ENDPOINT,
          {
            model,
            messages,
            temperature: 0.3,
          },
          {
            headers: {
              Authorization: `Bearer ${openRouterApiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "PrakritiAI",
            },
            timeout: 20000,
          }
        );

        const aiText = response?.data?.choices?.[0]?.message?.content;
        const parsed = extractJSON(aiText);
        if (!parsed) {
          throw new Error("Invalid JSON response from model");
        }

        aiResponse = parsed;
        break;
      } catch (error) {
        lastError = error.response?.data || error.message;
        continue;
      }
    }

    if (!aiResponse) {
      return res.status(503).json({
        message: "Please try again later. We are facing temporary downtime.",
        code: "AI_UNAVAILABLE",
        details: lastError || "All models failed",
      });
    }

    let report = null;

    // Save only if logged in
    if (req.user) {
      try {
        report = await SymptomReport.create({
          user: req.user._id,
          symptoms,
          age: Number.isFinite(Number(age)) ? Number(age) : undefined,
          gender: typeof gender === "string" ? gender.trim().toLowerCase() : undefined,
          duration: typeof duration === "string" ? duration.trim() : "",
          severity: Number.isFinite(Number(severity)) ? Number(severity) : undefined,
          additionalDetails:
            typeof additional_details === "string" ? additional_details.trim() : "",
          dosha: aiResponse?.dosha_imbalance?.[0] || "Mixed",
          reasoning: aiResponse?.reasoning || "",
          immediateSolutions: Array.isArray(aiResponse?.immediate_solutions)
            ? aiResponse.immediate_solutions.filter((item) => typeof item === "string")
            : [],
          remedies: (Array.isArray(aiResponse?.remedies) ? aiResponse.remedies : [])
            .map((item) => (typeof item === "string" ? item : item?.title))
            .filter(Boolean),
          therapies: (Array.isArray(aiResponse?.therapies) ? aiResponse.therapies : [])
            .map((t) => {
              const name = typeof t?.name === "string" ? t.name.trim() : "";
              if (!name) return null;
              return {
                name,
                description:
                  typeof t?.description === "string" ? t.description.trim() : "",
              };
            })
            .filter(Boolean),
          dietRecommendations: Array.isArray(aiResponse?.diet_tips)
            ? aiResponse.diet_tips
            : [],
          lifestyleRecommendations: Array.isArray(aiResponse?.lifestyle_tips)
            ? aiResponse.lifestyle_tips
            : [],
          isAnonymous: false,
        });
      } catch (dbErr) {
        console.error("Failed to save symptom report to MongoDB:", dbErr.message);
      }
    }

    return res.json({
      message: "Analysis completed",
      result: aiResponse,
      saved: !!report,
    });
  } catch (err) {
    console.error("Error in analyzeSymptoms controller:", err);
    return res.status(500).json({
      message: "Internal server error occurred while analyzing symptoms.",
      error: err.message,
    });
  }
};
