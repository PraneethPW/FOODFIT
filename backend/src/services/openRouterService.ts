import { env } from "../config/env.js";

type AiRequest = {
  intent: "diet" | "workout" | "foods" | "chat";
  userPrompt: string;
  profile?: unknown;
};

const systemPrompt = `
You are FOODFIT, a careful AI fitness and nutrition assistant.
Return practical, culturally aware, city-specific advice. Respect allergies, disease risks, age, BMI, and goals.
For medical conditions, include safety notes and recommend clinician guidance without replacing medical care.
When asked for structured plans, return valid JSON only. Do not use placeholder text, repeated generic meals, or vague items.
`;

export const askOpenRouter = async ({ intent, userPrompt, profile }: AiRequest) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "FOODFIT"
    },
    body: JSON.stringify({
      model: env.OPENROUTER_MODEL,
      temperature: intent === "chat" ? 0.7 : 0.35,
      response_format: intent === "chat" ? undefined : { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({ intent, profile, request: userPrompt })
        }
      ]
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenRouter request failed: ${message}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  return data.choices?.[0]?.message?.content ?? "";
};

export const parseAiJson = <T>(content: string, fallback: T): T => {
  try {
    const trimmed = content.trim();
    const withoutFence = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const start = withoutFence.indexOf("{");
    const end = withoutFence.lastIndexOf("}");
    const json = start >= 0 && end >= start ? withoutFence.slice(start, end + 1) : withoutFence;
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};
