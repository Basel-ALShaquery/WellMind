import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Globe, Target, Shield, Mail, Linkedin } from "lucide-react";


const VALUES = [
  { icon: Heart, title: "Compassion First", desc: "Every feature we build starts with empathy for the people we serve", color: "from-pink-500 to-rose-400" },
  { icon: Shield, title: "Privacy & Safety", desc: "Your mental health data is yours. We use encryption and strict access controls", color: "from-violet-600 to-purple-500" },
  { icon: Globe, title: "Cultural Sensitivity", desc: "Built for the unique cultural context of youth across the Middle East and Africa", color: "from-blue-600 to-cyan-500" },
  { icon: Target, title: "Evidence-Based", desc: "Every tool and recommendation is grounded in peer-reviewed mental health research", color: "from-emerald-500 to-teal-400" },
];

export default function AboutPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">About Well Mind</h1>
        <p className="text-muted-foreground mt-1">Our mission, story, and the team behind the platform</p>
      </div>

      <Card className="glass-card border-0 overflow-hidden">
        <CardContent className="p-8 lg:p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-primary uppercase tracking-wide">Our Mission</div>
                <h2 className="text-2xl font-display font-bold text-foreground">Mental Wellness for Every Young Person</h2>
              </div>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Well Mind was founded with a bold vision: to make psychological support accessible, affordable, and stigma-free for every young person across the Middle East and Africa. We combine cutting-edge AI technology with human expertise to create a platform that truly understands the unique cultural, social, and emotional landscape of MENA youth.
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground mb-6">Founder & CEO</h2>
        <Card className="glass-card border-0 hover-lift overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-xl ring-4 ring-primary/20">
                  <img
                    src="/basel.jpg"
                    alt="Basel Hossam Al-Shaqwery"
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-blue-500 text-white text-5xl font-bold">B</div>';
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-foreground">Basel Hossam Al-Shaqwery</h3>
                    <p className="text-primary font-semibold">Founder & CEO, Well Mind</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge className="bg-primary/10 text-primary border-0">Mental Health Advocate</Badge>
                      <Badge className="bg-accent/10 text-accent border-0">Tech Entrepreneur</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href="mailto:basel@wellmind.app" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-muted-foreground leading-relaxed">
                  <p>Basel Hossam Al-Shaqwery is a passionate entrepreneur and mental health advocate who founded Well Mind after witnessing firsthand the devastating gap in accessible psychological support for youth across the Middle East and Africa.</p>
                  <p>Growing up in a region where mental health remains deeply stigmatized, Basel experienced the silence and isolation that comes with unaddressed emotional struggles. Instead of accepting this as the norm, he chose to build the platform he wished had existed.</p>
                  <p>With a background in technology and a deep commitment to social impact, Basel assembled a team of certified mental health professionals, AI researchers, and community builders. His vision: <em>no young person in the MENA region should have to face their mental health journey alone.</em></p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[{ value: "10K+", label: "Youth Supported" }, { value: "15+", label: "Countries" }, { value: "50+", label: "Professionals" }].map(s => (
                    <div key={s.label} className="text-center p-3 rounded-xl bg-primary/5">
                      <div className="text-xl font-display font-bold gradient-text">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground mb-6">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {VALUES.map(v => (
            <Card key={v.title} className="glass-card border-0 hover-lift group">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardContent className="p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground mb-2">Get In Touch</h3>
          <p className="text-muted-foreground mb-4">Have questions, partnership inquiries, or want to join our mission?</p>
          <a href="mailto:hello@wellmind.app" className="text-primary font-semibold hover:underline">hello@wellmind.app</a>
        </CardContent>
      </Card>
    </div>
  );
}
