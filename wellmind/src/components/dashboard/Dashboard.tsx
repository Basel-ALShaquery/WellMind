import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import HomePage from "./pages/HomePage";
import MoodTracker from "./pages/MoodTracker";
import SessionsPage from "./pages/SessionsPage";
import CommunityPage from "./pages/CommunityPage";
import AboutPage from "./pages/AboutPage";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PageType = "home" | "mood" | "sessions" | "community" | "about";

export default function Dashboard() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage user={user} setCurrentPage={setCurrentPage} />;
      case "mood": return <MoodTracker userId={user.id} />;
      case "sessions": return <SessionsPage userId={user.id} />;
      case "community": return <CommunityPage />;
      case "about": return <AboutPage />;
      default: return <HomePage user={user} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed lg:sticky top-0 left-0 h-full lg:h-screen z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Sidebar currentPage={currentPage} setCurrentPage={(p) => { setCurrentPage(p); setSidebarOpen(false); }} user={user} />
      </div>
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            <span className="font-display font-bold text-foreground">Well Mind</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="rounded-xl">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
