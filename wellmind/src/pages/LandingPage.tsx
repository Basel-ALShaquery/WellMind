import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield, Heart, Globe, Zap, Users, ArrowRight, MessageCircle } from "lucide-react";

const FEATURES = [
  { icon: Brain, title: "AI Companion", desc: "Chat with an empathetic AI trained on mental health best practices — available 24/7, judgment-free.", color: "from-violet-600 to-purple-500" },
  { icon: Heart, title: "Mood Tracking", desc: "Log your daily mood, spot patterns, and understand what affects your emotional wellbeing over time.", color: "from-pink-500 to-rose-400" },
  { icon: Users, title: "Expert Therapists", desc: "Book sessions with licensed psychiatrists and psychologists who understand the MENA cultural context.", color: "from-emerald-500 to-teal-400" },
  { icon: Globe, title: "MENA-Focused", desc: "Built specifically for youth in the Middle East and Africa — culturally sensitive, multilingual support.", color: "from-blue-500 to-cyan-400" },
  { icon: Shield, title: "100% Private", desc: "Your mental health data is encrypted and never shared. Your privacy is our highest priority.", color: "from-amber-500 to-orange-400" },
  { icon: Zap, title: "Always Available", desc: "Access resources, tools, and community support anytime — no waiting rooms, no appointments needed.", color: "from-indigo-600 to-blue-500" },
];

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-glow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">Well Mind</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")} className="rounded-xl">Sign In</Button>
          <Button onClick={() => navigate("/register")} className="rounded-xl btn-primary shadow-lg shadow-primary/30">Get Started Free</Button>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 border border-primary/20">
            <Zap className="w-4 h-4" />
            AI-Powered Mental Health for MENA Youth
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
            Your Mental Health<br />
            <span className="gradient-text">Matters</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Well Mind combines AI technology with certified therapists to make psychological support accessible, affordable, and stigma-free for every young person in the Middle East and Africa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => navigate("/register")} size="lg" className="h-14 px-8 text-base rounded-2xl btn-primary shadow-xl shadow-primary/30 w-full sm:w-auto">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Button>
            <Button onClick={() => navigate("/login")} variant="outline" size="lg" className="h-14 px-8 text-base rounded-2xl border-2 w-full sm:w-auto">
              Sign In
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-emerald-500" />
            Free to start • 100% private
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Everything You Need to Thrive</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A complete mental wellness platform built for the unique needs of MENA youth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <Card key={f.title} className="glass-card border-0 hover-lift group">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-glow">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground mb-4">Ready to Start?</h2>
              <p className="text-muted-foreground text-lg mb-8">Join thousands of young people across MENA on their mental wellness journey.</p>
              <Button onClick={() => navigate("/register")} size="lg" className="h-14 px-10 text-base rounded-2xl btn-primary shadow-xl shadow-primary/30">
                Get Started — It's Free <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 lg:px-12 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p>© 2025 Well Mind. Built with care for MENA youth. All rights reserved.</p>
      </footer>
    </div>
  );
}
