const BASE = "";

export async function getMoodEntries(userId: string, limit = 90) {
  const res = await fetch(`${BASE}/api/mood?userId=${userId}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch mood entries");
  return res.json();
}

export async function createMoodEntry(data: {
  userId: string;
  mood: number;
  note?: string;
  tags?: string[];
  entryDate: string;
}) {
  const res = await fetch(`${BASE}/api/mood`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create mood entry");
  return res.json();
}

export async function getMoodStats(userId: string) {
  const res = await fetch(`${BASE}/api/mood/stats?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch mood stats");
  return res.json();
}

export async function getBookings(userId: string) {
  const res = await fetch(`${BASE}/api/bookings?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export async function createBooking(data: {
  userId: string;
  therapistId: number;
  therapistName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  notes?: string;
}) {
  const res = await fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json();
}
