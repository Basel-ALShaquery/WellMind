import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMoodEntries, createMoodEntry, getMoodStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Heart, TrendingUp, Calendar, Sparkles, Loader2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";

const MOODS = [
  { value: 1, emoji: "😢", label: "Very Bad" },
  { value: 2, emoji: "😔", label: "Bad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "🤩", label: "Excellent" },
];

const TAGS = ["Anxious", "Happy", "Stressed", "Calm", "Grateful", "Tired", "Excited", "Sad", "Focused"];

export default function MoodTracker({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: entries, isLoading } = useQuery({ queryKey: ["mood-entries", userId], queryFn: () => getMoodEntries(userId, 90) });
  const { data: stats } = useQuery({ queryKey: ["mood-stats", userId], queryFn: () => getMoodStats(userId) });
  const { mutateAsync: addEntry, isPending: saving } = useMutation({
    mutationFn: createMoodEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mood-entries", userId] });
      qc.invalidateQueries({ queryKey: ["mood-stats", userId] });
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSave = async () => {
    if (!selectedMood) { toast.error("Please select your mood"); return; }
    try {
      await addEntry({ userId, mood: selectedMood, note: note || undefined, tags: selectedTags.length ? selectedTags : undefined, entryDate: today });
      toast.success("Mood logged!");
      setSelectedMood(null);
      setNote("");
      setSelectedTags([]);
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  };

  const chartData = (entries ?? []).map((e: { entryDate: string; mood: number }) => ({
    date: new Date(e.entryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: e.mood,
  }));

  const tagFrequency = (entries ?? []).reduce<Record<string, number>>((acc: Record<string, number>, e: { tags?: string[] }) => {
    (e.tags ?? []).forEach((tag: string) => { acc[tag] = (acc[tag] || 0) + 1; });
    return acc;
  }, {});
  const tagChartData = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([tag, count]) => ({ tag, count }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Mood Tracker</h1>
        <p className="text-muted-foreground mt-1">Track how you feel each day to discover patterns and trends</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Days Tracked", value: stats?.totalDays ?? 0, icon: Calendar, color: "from-blue-500 to-cyan-400" },
          { label: "Average Mood", value: `${stats?.average ?? "0.0"} / 5`, icon: TrendingUp, color: "from-violet-600 to-purple-500" },
          { label: "Good Days", value: stats?.goodDays ?? 0, icon: Sparkles, color: "from-emerald-500 to-teal-400" },
          { label: "Current Streak", value: `${stats?.currentStreak ?? 0} days`, icon: Heart, color: "from-pink-500 to-rose-400" },
        ].map(s => (
          <Card key={s.label} className="glass-card border-0 hover-lift">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="font-display text-xl">How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-3 flex-wrap">
            {MOODS.map(m => (
              <button key={m.value} onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 border-2 ${selectedMood === m.value ? "border-primary bg-primary/5 shadow-md scale-110" : "border-border/50 hover:border-primary/50 hover:scale-105"}`}>
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
              </button>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Tags (optional)</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${selectedTags.includes(tag) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="How was your day? (optional)" rows={3} className="rounded-xl bg-muted/50 border-border/50 resize-none" />
          <Button onClick={handleSave} disabled={saving || !selectedMood} className="w-full h-12 rounded-xl btn-primary font-semibold shadow-lg shadow-primary/30">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Today's Mood"}
          </Button>
        </CardContent>
      </Card>

      {!isLoading && chartData.length > 0 && (
        <>
          <Card className="glass-card border-0">
            <CardHeader><CardTitle className="font-display text-xl">Mood Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [MOODS.find(m => m.value === v)?.emoji + " " + MOODS.find(m => m.value === v)?.label, "Mood"]} />
                  <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {tagChartData.length > 0 && (
            <Card className="glass-card border-0">
              <CardHeader><CardTitle className="font-display text-xl">Top Feelings</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={tagChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tag" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {tagChartData.map((_, i) => (
                        <Cell key={i} fill={["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"][i % 6]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card className="glass-card border-0">
            <CardHeader><CardTitle className="font-display text-xl">Recent Entries</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(entries ?? []).slice(-7).reverse().map((e: { id: number; mood: number; entryDate: string; tags?: string[]; note?: string }) => (
                <div key={e.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <span className="text-2xl flex-shrink-0">{MOODS.find(m => m.value === e.mood)?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm text-foreground">{MOODS.find(m => m.value === e.mood)?.label}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{new Date(e.entryDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                    </div>
                    {e.tags && e.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {e.tags.map((t: string) => <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    )}
                    {e.note && <p className="text-xs text-muted-foreground mt-1 truncate">{e.note}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
    </div>
  );
}
