import { AuthUser } from "@/hooks/useAuth";
import { PageType } from "../Dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, BookOpen, Calendar, Sparkles, TrendingUp, Sun, Moon, ArrowRight, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMoodStats, getBookings } from "@/lib/api";

interface HomePageProps {
  user: AuthUser;
  setCurrentPage: (p: PageType) => void;
}

export default function HomePage({ user, setCurrentPage }: HomePageProps) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
  const GreetingIcon = currentHour < 18 ? Sun : Moon;

  const { data: moodStats } = useQuery({ queryKey: ["mood-stats", user.id], queryFn: () => getMoodStats(user.id) });
  const { data: bookings } = useQuery({ queryKey: ["bookings", user.id], queryFn: () => getBookings(user.id) });

  const quickActions: { id: PageType; title: string; description: string; icon: React.ElementType; color: string }[] = [
    { id: "mood", title: "Track Mood", description: "How are you feeling today?", icon: Heart, color: "from-pink-500 to-rose-400" },
    { id: "sessions", title: "Book Session", description: "Connect with a therapist", icon: Calendar, color: "from-emerald-500 to-teal-400" },
    { id: "community", title: "Community", description: "Podcasts, articles & tests", icon: BookOpen, color: "from-blue-500 to-cyan-400" },
    { id: "about", title: "About Us", description: "Our mission & team", icon: Info, color: "from-violet-600 to-purple-500" },
  ];

  const dailyTips = [
    "Take 5 minutes today to practice deep breathing",
    "Stay hydrated — water helps your brain function better",
    "Take a short walk outside for fresh air",
    "Write down 3 things you're grateful for",
    "Reach out to someone you care about today",
    "Practice the 5-4-3-2-1 grounding technique when anxious",
    "Give yourself permission to feel whatever you're feeling",
  ];
  const randomTip = dailyTips[new Date().getDate() % dailyTips.length];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(var(--purple-light))] via-[hsl(var(--blue-light))] to-[hsl(var(--pink-light))] p-8 lg:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary mb-2">
            <GreetingIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{greeting}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-3">
            Welcome back, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Ready to continue your wellness journey? Let's make today meaningful.
          </p>
        </div>
        <div className="absolute top-8 right-8 lg:right-12 opacity-10">
          <Sparkles className="w-20 h-20 lg:w-32 lg:h-32 text-primary" />
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">Daily Wellness Tip</h3>
              <p className="text-muted-foreground">{randomTip}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-display font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button key={action.id} onClick={() => setCurrentPage(action.id)} className="group text-left">
              <Card className="glass-card border-0 hover-lift h-full overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <div className="flex items-center text-primary text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                    <span>Open</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-display font-semibold mb-4 text-foreground">Your Progress</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Days Tracked", value: moodStats?.totalDays ?? 0, icon: Heart, color: "text-pink-500" },
            { label: "Avg. Mood", value: moodStats?.average ?? "0.0", icon: TrendingUp, color: "text-violet-500" },
            { label: "Good Days", value: moodStats?.goodDays ?? 0, icon: Sparkles, color: "text-emerald-500" },
            { label: "Sessions", value: bookings?.length ?? 0, icon: Calendar, color: "text-blue-500" },
          ].map((stat) => (
            <Card key={stat.label} className="glass-card border-0 hover-lift">
              <CardContent className="p-5">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {moodStats && moodStats.average > 0 && (
        <Card className={`glass-card border-0 border-l-4 ${moodStats.average >= 4 ? "border-l-emerald-500" : moodStats.average >= 3 ? "border-l-amber-500" : "border-l-rose-500"}`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Smart Recommendation</h3>
                {moodStats.average >= 4 ? (
                  <p className="text-muted-foreground">You're doing great! Keep up the momentum. Explore our community content.</p>
                ) : moodStats.average >= 3 ? (
                  <p className="text-muted-foreground">You're finding balance. Explore our mindfulness podcasts or book a check-in session with one of our therapists.</p>
                ) : (
                  <p className="text-muted-foreground">We see you're having a difficult time. Remember, reaching out is a sign of strength. Consider booking a session, or chat with our AI companion using the button at the bottom right.</p>
                )}
                <button onClick={() => setCurrentPage(moodStats.average < 3 ? "sessions" : "community")} className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-medium">
                  {moodStats.average < 3 ? "Book a Session" : "Explore Community"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
