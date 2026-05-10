import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function ensureTable(client: { query: (sql: string) => Promise<unknown> }) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS mood_entries (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      mood INTEGER NOT NULL,
      note TEXT,
      tags JSONB,
      entry_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  const client = await pool.connect();
  try {
    await ensureTable(client);

    if (req.method === "GET") {
      const { userId, limit = "90" } = req.query;
      if (!userId) { res.status(400).json({ error: "userId required" }); return; }
      const { rows } = await client.query(
        "SELECT * FROM mood_entries WHERE user_id = $1 ORDER BY entry_date ASC LIMIT $2",
        [userId, parseInt(limit as string)]
      );
      res.json(rows.map((r: { id: number; user_id: string; mood: number; note: string | null; tags: string[] | null; entry_date: string; created_at: string }) => ({
        id: r.id, userId: r.user_id, mood: r.mood, note: r.note,
        tags: r.tags, entryDate: r.entry_date, createdAt: r.created_at
      })));

    } else if (req.method === "POST") {
      const { userId, mood, note, tags, entryDate } = req.body;
      if (!userId || !mood || !entryDate) { res.status(400).json({ error: "Missing required fields" }); return; }
      const { rows } = await client.query(
        "INSERT INTO mood_entries (user_id, mood, note, tags, entry_date) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [userId, mood, note || null, tags ? JSON.stringify(tags) : null, entryDate]
      );
      const r = rows[0];
      res.status(201).json({ id: r.id, userId: r.user_id, mood: r.mood, note: r.note, tags: r.tags, entryDate: r.entry_date, createdAt: r.created_at });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } finally {
    client.release();
  }
}
