import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are WellMind's AI Companion — a warm, empathetic mental wellness assistant designed for youth across the Middle East and Africa.

Your role:
- Listen with compassion and without judgment.
- Validate feelings before offering perspective.
- Provide evidence-based coping strategies (breathing, grounding, journaling, CBT-style reframing).
- Keep replies concise (2-5 short paragraphs), warm, and conversational.
- Use plain language. If the user writes in Arabic, reply in Arabic. If they write in English, reply in English.
- Encourage seeing a licensed professional for ongoing care, especially in serious situations.

Crisis safety:
- If the user expresses thoughts of suicide, self-harm, or being in immediate danger, gently encourage them to contact local emergency services or a trusted person right now. Share that they matter and are not alone.

Boundaries:
- You are not a replacement for therapy or medical advice.
- Do not diagnose. Do not prescribe medication.
- Be honest about your limitations.

Tone: warm, hopeful, grounded, never preachy.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) { res.status(503).json({ error: "GOOGLE_API_KEY is not configured" }); return; }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) { res.status(400).json({ error: "Invalid request body" }); return; }

  const ai = new GoogleGenAI({ apiKey });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }],
    }));

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents,
      config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 8192 },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Gemini error:", err);
    res.write(`data: ${JSON.stringify({ error: "AI error" })}\n\n`);
    res.end();
  }
}
