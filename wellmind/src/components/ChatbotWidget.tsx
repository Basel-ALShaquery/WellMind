import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Brain, Loader2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME = "Hi there! I'm your WellMind AI Companion 💜 How are you feeling today?";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatMessage(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "w", role: "assistant", content: WELCOME }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = { id: `u${Date.now()}`, role: "user", content: text };
    const apiMessages = messages.filter(m => m.id !== "w").map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
    apiMessages.push({ role: "user", content: text });

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const assistantId = `a${Date.now()}`;
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error("Error");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed?.choices?.[0]?.delta?.content ?? "";
            if (chunk) {
              fullContent += chunk;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m));
            }
          } catch { /* skip */ }
        }
      }
      if (!fullContent) {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "I'm here to listen 💜" } : m));
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Connection issue. Please try again." } : m));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300",
          "bg-gradient-to-br from-violet-600 to-blue-500 text-white",
          open ? "scale-90" : "scale-100 hover:scale-110 animate-pulse-soft"
        )}
        aria-label="Open AI Companion"
      >
        {open ? <Minimize2 className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col animate-fade-in" style={{ maxHeight: "min(500px, calc(100vh - 160px))" }}>
          <div className="glass-card rounded-3xl flex flex-col overflow-hidden shadow-2xl" style={{ maxHeight: "min(500px, calc(100vh - 160px))" }}>
            <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-md">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-display font-semibold text-sm text-foreground">WellMind AI</div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted/60 text-foreground rounded-bl-sm"}`}>
                    {msg.content === "" && msg.role === "assistant"
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      : <span dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                    }
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-border/50 bg-card/80 backdrop-blur-xl">
              <div className="flex gap-2 items-end">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message…"
                  rows={1}
                  className="flex-1 resize-none rounded-xl bg-muted/50 border-border/50 min-h-[36px] max-h-20 text-sm py-2"
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon" className="h-9 w-9 rounded-xl btn-primary flex-shrink-0 shadow-md shadow-primary/30">
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
