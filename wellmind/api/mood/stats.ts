import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "GET") { res.status(405).json({ error: "Method not allowed" }); return; }

  const { userId } = req.query;
  if (!userId) { res.status(400).json({ error: "userId required" }); return; }

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      "SELECT mood, entry_date FROM mood_entries WHERE user_id = $1 ORDER BY entry_date ASC",
      [userId]
    );
    if (rows.length === 0) {
      res.json({ average: 0, totalDays: 0, goodDays: 0, currentStreak: 0 });
      return;
    }
    const average = rows.reduce((s: number, r: { mood: number }) => s + r.mood, 0) / rows.length;
    const goodDays = rows.filter((r: { mood: number }) => r.mood >= 4).length;
    const dates = new Set(rows.map((r: { entry_date: string }) => r.entry_date?.toISOString?.()?.split("T")[0] ?? String(r.entry_date).split("T")[0]));
    let currentStreak = 0;
    const d = new Date();
    while (dates.has(d.toISOString().split("T")[0])) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    }
    res.json({ average: Math.round(average * 10) / 10, totalDays: rows.length, goodDays, currentStreak });
  } finally {
    client.release();
  }
}
