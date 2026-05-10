import { useLocation } from "wouter";
import { useAuth, AuthUser } from "@/hooks/useAuth";
import { PageType } from "./Dashboard";
import { Home, Heart, Calendar, BookOpen, Info, LogOut, Brain, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems: { id: PageType; label: string; icon: React.ElementType; color: string }[] = [
  { id: "home", label: "Home", icon: Home, color: "text-violet-500" },
  { id: "mood", label: "Mood Tracker", icon: Heart, color: "text-pink-500" },
  { id: "sessions", label: "Book Sessions", icon: Calendar, color: "text-emerald-500" },
  { id: "community", label: "Community", icon: BookOpen, color: "text-amber-500" },
  { id: "about", label: "About", icon: Info, color: "text-indigo-500" },
];

interface SidebarProps {
  currentPage: PageType;
  setCurrentPage: (p: PageType) => void;
  user: AuthUser;
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ currentPage, setCurrentPage, user }: SidebarProps) {
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <aside className="w-72 h-full bg-sidebar/95 backdrop-blur-2xl border-r border-sidebar-border flex flex-col">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-glow">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-lg gradient-text">Well Mind</div>
            <div className="text-xs text-muted-foreground">Mental Wellness Platform</div>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-foreground" : item.color}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-primary-foreground/70" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
