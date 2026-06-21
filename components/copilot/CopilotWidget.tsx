"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, MessageSquare, Sparkles, X, ExternalLink, ChevronDown } from "lucide-react";
import type { CopilotMessage } from "@/lib/copilot-engine";

const SUGGESTED_PROMPTS = [
  "Which datasets are ready for churn prediction?",
  "Why is Retail Media not AI-ready?",
  "What should we fix first this quarter?",
  "Can I use Scan & Go for funnel experiments?",
  "Summarize the highest-priority incidents.",
];

const WELCOME_MESSAGE: CopilotMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm the DataTrust AI Copilot. I have full context on all 6 data products — their quality scores, open incidents, and approved use cases. Ask me anything.",
  timestamp: new Date().toISOString(),
  metadata: {
    links: [
      { label: "Data Catalog", href: "/catalog" },
      { label: "Incidents", href: "/incidents" },
    ],
  },
};

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.trim() === "") {
      result.push(<div key={key++} className="h-1.5" />);
      continue;
    }

    const parts = line.split(/(\*\*[^*]+\*\*)/);
    const rendered = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (line.startsWith("•") || line.startsWith("-")) {
      result.push(
        <div key={key++} className="flex items-start gap-1.5 text-xs text-slate-700 leading-relaxed">
          <span className="text-slate-400 mt-0.5 shrink-0">•</span>
          <span>{rendered}</span>
        </div>
      );
    } else {
      result.push(
        <div key={key++} className="text-xs text-slate-700 leading-relaxed">{rendered}</div>
      );
    }
  }
  return result;
}

export function CopilotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isThinking) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsThinking(true);

    const streamingId = `assistant-${Date.now()}`;
    setMessages((prev) => [...prev, {
      id: streamingId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    }]);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages((prev) =>
          prev.map((m) => (m.id === streamingId ? { ...m, content: current } : m))
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamingId
            ? { ...m, content: "Sorry, couldn't reach the AI. Please try again." }
            : m
        )
      );
    }

    setIsThinking(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div
          className="flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: 380,
            height: 520,
            border: "1px solid #e7e5e4",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 shrink-0" style={{ background: "#18120e", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-7 h-7 rounded-lg bg-amber-700 flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-stone-100">AI Data Copilot</div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs" style={{ color: "#78716c" }}>Live · Claude Haiku</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-stone-400 hover:text-stone-200"
            >
              <ChevronDown size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === "user" ? "bg-amber-700 text-white" : "bg-amber-700 text-white"
                }`}>
                  {msg.role === "user" ? "A" : <Sparkles size={10} />}
                </div>
                <div className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`} style={{ maxWidth: "82%" }}>
                  <div className={`rounded-2xl px-3 py-2 ${
                    msg.role === "user"
                      ? "bg-amber-700 text-white rounded-tr-sm"
                      : "bg-slate-50 border border-slate-200 rounded-tl-sm"
                  }`}>
                    {msg.role === "user" ? (
                      <p className="text-xs text-white leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                    )}
                  </div>
                  {msg.metadata?.links && msg.metadata.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {msg.metadata.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-2 py-0.5 transition-colors"
                        >
                          <ExternalLink size={9} />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-700 flex items-center justify-center shrink-0">
                  <Sparkles size={10} className="text-white" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts — only on first load */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 shrink-0">
              <div className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
                <MessageSquare size={10} />
                Try asking
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs bg-slate-50 border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 rounded-full px-2.5 py-1 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 shrink-0 border-t border-slate-100">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about data readiness..."
                  rows={1}
                  className="w-full px-3 py-2.5 text-xs bg-transparent resize-none focus:outline-none text-slate-800 placeholder:text-slate-400"
                  style={{ maxHeight: 80 }}
                />
              </div>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isThinking}
                className="w-8 h-8 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-200 text-white disabled:text-slate-400 rounded-lg flex items-center justify-center transition-colors shrink-0"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl text-white font-medium text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ background: "#18120e", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
      >
        {open ? <X size={16} /> : <Sparkles size={16} className="text-amber-400" />}
        <span>{open ? "Close" : "AI Copilot"}</span>
        {!open && (
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        )}
      </button>
    </div>
  );
}
