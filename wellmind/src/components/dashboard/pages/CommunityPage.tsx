import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, BookOpen, Brain, Clock, ExternalLink, Headphones, Play } from "lucide-react";

type Tab = "podcasts" | "articles" | "tests";

const PODCASTS = [
  { id: 1, title: "Understanding Anxiety in the Arab World", host: "Dr. Sara Hassan", duration: "42 min", topics: ["Anxiety", "Culture"], description: "Exploring how cultural expectations shape anxiety experiences for Arab youth and practical coping strategies.", color: "from-violet-600 to-purple-500", url: "https://open.spotify.com/show/5hhMPAxIliNJsNzfGXVGEE" },
  { id: 2, title: "Breaking the Stigma of Mental Health", host: "Dr. Ahmed Al-Jabri", duration: "38 min", topics: ["Stigma", "Awareness"], description: "A candid discussion about mental health stigma in MENA communities and how to start important conversations.", color: "from-blue-600 to-cyan-500", url: "https://open.spotify.com/show/41zWZdWCp0nVB4pAGHvqiI" },
  { id: 3, title: "Mindfulness for the Modern Muslim", host: "Dr. Layla Karimi", duration: "35 min", topics: ["Mindfulness", "Islam"], description: "Integrating mindfulness practices with Islamic teachings for a holistic approach to mental wellbeing.", color: "from-emerald-500 to-teal-400", url: "https://open.spotify.com/show/7dPfMT2W2XOnAqS6tHmqjl" },
  { id: 4, title: "Student Burnout & Academic Pressure", host: "Dr. Khaled Nour", duration: "44 min", topics: ["Burnout", "Students"], description: "Navigating the intense academic pressures facing students in the MENA region with actionable strategies.", color: "from-amber-500 to-orange-400", url: "https://open.spotify.com/show/1OLcQdw2PFDPG1jo3zsoz3" },
  { id: 5, title: "Healthy Relationships & Boundaries", host: "Dr. Mona Badr", duration: "40 min", topics: ["Relationships", "Boundaries"], description: "How to build healthy relationships and set respectful boundaries within family and social contexts.", color: "from-pink-500 to-rose-400", url: "https://open.spotify.com/show/6UDJMu2IBoX1OFJKqhb9XP" },
  { id: 6, title: "Social Media & Your Mental Health", host: "Dr. Fatima Al-Rashidi", duration: "32 min", topics: ["Social Media", "Digital Wellness"], description: "The science behind social media's impact on self-esteem and practical digital wellness strategies.", color: "from-indigo-600 to-blue-500", url: "https://open.spotify.com/show/3tAPYhUj5WbgHJ1c4FLZQZ" },
];

const ARTICLES = [
  { id: 1, title: "5 Evidence-Based Strategies to Manage Daily Anxiety", category: "Anxiety", readTime: "6 min", summary: "Research-backed techniques including box breathing, progressive muscle relaxation, and cognitive reframing to calm anxious thoughts.", color: "from-violet-600 to-purple-500", url: "https://www.psychologytoday.com/us/basics/anxiety" },
  { id: 2, title: "What Is CBT and How Does It Help?", category: "Therapy", readTime: "8 min", summary: "A comprehensive guide to Cognitive Behavioral Therapy — the most widely researched therapy approach for depression and anxiety.", color: "from-blue-600 to-cyan-500", url: "https://www.verywellmind.com/what-is-cognitive-behavior-therapy-2795747" },
  { id: 3, title: "Building a Sleep Routine for Better Mental Health", category: "Lifestyle", readTime: "5 min", summary: "The powerful link between sleep and mental health, plus practical steps to improve your sleep hygiene starting tonight.", color: "from-emerald-500 to-teal-400", url: "https://www.sleepfoundation.org/mental-health" },
  { id: 4, title: "Understanding Grief and Loss", category: "Grief", readTime: "7 min", summary: "A compassionate guide through the stages of grief, cultural perspectives on mourning, and how to support yourself and others.", color: "from-amber-500 to-orange-400", url: "https://www.psychologytoday.com/us/basics/grief" },
  { id: 5, title: "The Science of Happiness: What Really Works", category: "Well-being", readTime: "9 min", summary: "Evidence from positive psychology on what actually makes us happier — beyond wealth and success.", color: "from-pink-500 to-rose-400", url: "https://greatergood.berkeley.edu/topic/happiness/definition" },
  { id: 6, title: "Recognizing Signs of Burnout Early", category: "Burnout", readTime: "6 min", summary: "How to identify the three stages of burnout before it becomes serious, and proactive recovery strategies.", color: "from-indigo-600 to-blue-500", url: "https://www.psychologytoday.com/us/basics/burnout" },
];

const TESTS = [
  { id: 1, title: "PHQ-9 Depression Screening", description: "The Patient Health Questionnaire is the gold standard screening tool for depression, used by healthcare providers worldwide.", questions: "9 questions", duration: "5 min", category: "Depression", url: "https://www.mdcalc.com/calc/1725/phq-9-patient-health-questionnaire-9", color: "from-violet-600 to-purple-500" },
  { id: 2, title: "GAD-7 Anxiety Scale", description: "The Generalized Anxiety Disorder 7-item scale measures the severity of generalized anxiety disorder symptoms.", questions: "7 questions", duration: "3 min", category: "Anxiety", url: "https://www.mdcalc.com/calc/1727/gad-7-general-anxiety-disorder-7", color: "from-blue-600 to-cyan-500" },
  { id: 3, title: "Perceived Stress Scale (PSS)", description: "Measures how unpredictable, uncontrollable, and overloaded you find your life.", questions: "10 questions", duration: "5 min", category: "Stress", url: "https://www.mindgarden.com/documents/PerceivedStressScale.pdf", color: "from-amber-500 to-orange-400" },
  { id: 4, title: "Rosenberg Self-Esteem Scale", description: "One of the most widely used self-esteem measures, assessing positive and negative feelings about oneself.", questions: "10 questions", duration: "5 min", category: "Self-Esteem", url: "https://www.yorku.ca/rokada/psyctest/rosenbrg.pdf", color: "from-emerald-500 to-teal-400" },
  { id: 5, title: "Big Five Personality Test", description: "Discover your personality across the five major dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism.", questions: "44 questions", duration: "10 min", category: "Personality", url: "https://www.truity.com/test/big-five-personality-test", color: "from-pink-500 to-rose-400" },
  { id: 6, title: "AUDIT Alcohol Use Test", description: "The Alcohol Use Disorders Identification Test helps identify alcohol use patterns that may be affecting your mental health.", questions: "10 questions", duration: "5 min", category: "Substance Use", url: "https://www.mdcalc.com/calc/2070/audit-c-alcohol-use-identification-test-consumption", color: "from-indigo-600 to-blue-500" },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("podcasts");

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "podcasts", label: "Podcasts", icon: Mic },
    { id: "articles", label: "Articles", icon: BookOpen },
    { id: "tests", label: "Tests", icon: Brain },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Community</h1>
        <p className="text-muted-foreground mt-1">Curated mental health content for youth in the MENA region</p>
      </div>

      <div className="flex gap-2 p-1 bg-muted/50 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "podcasts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PODCASTS.map(p => (
            <Card key={p.id} className="glass-card border-0 hover-lift overflow-hidden group">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.topics.map(t => <Badge key={t} className="bg-primary/10 text-primary border-0 text-xs">{t}</Badge>)}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors leading-snug">{p.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">by {p.host}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="w-3.5 h-3.5" />{p.duration}</div>
                  <Button size="sm" variant="outline" className="rounded-xl gap-1.5 text-xs" asChild>
                    <a href={p.url} target="_blank" rel="noopener noreferrer"><Play className="w-3.5 h-3.5" /> Listen</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "articles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ARTICLES.map(a => (
            <Card key={a.id} className="glass-card border-0 hover-lift group">
              <CardContent className="p-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <Badge className="bg-muted text-muted-foreground border-0 text-xs mb-3">{a.category}</Badge>
                <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="w-3.5 h-3.5" />{a.readTime} read</div>
                  <Button size="sm" className="rounded-xl gap-1.5 text-xs btn-primary shadow-md shadow-primary/25" asChild>
                    <a href={a.url} target="_blank" rel="noopener noreferrer">Read Article <ExternalLink className="w-3 h-3" /></a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "tests" && (
        <>
          <Card className="glass-card border-0 border-l-4 border-l-amber-500">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Important:</strong> These are standardized screening tools, not diagnostic tests. Results should be reviewed with a licensed mental health professional. If you're in crisis, please contact emergency services immediately.
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTS.map(t => (
              <Card key={t.id} className="glass-card border-0 hover-lift group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-muted text-muted-foreground border-0 text-xs mb-3">{t.category}</Badge>
                  <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{t.questions}</span><span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{t.duration}</span>
                    </div>
                    <Button size="sm" asChild className="rounded-xl gap-1.5 text-xs btn-primary shadow-md shadow-primary/25">
                      <a href={t.url} target="_blank" rel="noopener noreferrer">Take Test <ExternalLink className="w-3 h-3" /></a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
