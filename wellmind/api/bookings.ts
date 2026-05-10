import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function ensureTable(client: { query: (sql: string) => Promise<unknown> }) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      therapist_id INTEGER NOT NULL,
      therapist_name TEXT NOT NULL,
      session_date DATE NOT NULL,
      session_time TEXT NOT NULL,
      session_type TEXT NOT NULL,
      notes TEXT,
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
      const { userId } = req.query;
      if (!userId) { res.status(400).json({ error: "userId required" }); return; }
      const { rows } = await client.query(
        "SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
      res.json(rows.map((r: { id: number; user_id: string; therapist_id: number; therapist_name: string; session_date: string; session_time: string; session_type: string; notes: string | null; created_at: string }) => ({
        id: r.id, userId: r.user_id, therapistId: r.therapist_id,
        therapistName: r.therapist_name, sessionDate: r.session_date,
        sessionTime: r.session_time, sessionType: r.session_type,
        notes: r.notes, createdAt: r.created_at
      })));

    } else if (req.method === "POST") {
      const { userId, therapistId, therapistName, sessionDate, sessionTime, sessionType, notes } = req.body;
      if (!userId || !therapistId || !therapistName || !sessionDate || !sessionTime || !sessionType) {
        res.status(400).json({ error: "Missing required fields" }); return;
      }
      const { rows } = await client.query(
        "INSERT INTO bookings (user_id, therapist_id, therapist_name, session_date, session_time, session_type, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [userId, therapistId, therapistName, sessionDate, sessionTime, sessionType, notes || null]
      );
      const r = rows[0];
      res.status(201).json({
        id: r.id, userId: r.user_id, therapistId: r.therapist_id,
        therapistName: r.therapist_name, sessionDate: r.session_date,
        sessionTime: r.session_time, sessionType: r.session_type,
        notes: r.notes, createdAt: r.created_at
      });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } finally {
    client.release();
  }
}
