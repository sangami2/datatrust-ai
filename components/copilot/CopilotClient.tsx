"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, MessageSquare, ExternalLink, Sparkles } from "lucide-react";
import type { CopilotMessage } from "@/lib/copilot-engine";

const SUGGESTED_PROMPTS = [
  "Which datasets are ready for member churn prediction?",
  "Why is Retail Media Campaign Performance not AI-ready?",
  "What should we fix first to unlock real-time personalization?",
  "Which quality issue affects the most downstream AI use cases?",
  "Can I use Scan & Go Events for funnel experimentation?",
  "Summarize the highest-priority incidents this week.",
  "Which datasets are in the Needs Remediation tier?",
  "What is the AI readiness score for Experiment Registry?",
];

const WELCOME_MESSAGE: CopilotMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hello. I'm the DataTrust AI Copilot — I can help you navigate the data product catalog, evaluate dataset fitness for AI use cases, understand quality blockers, and identify remediation priorities.\n\nI have full context on all six data products, their quality scores, open incidents, and approved use cases. Ask me anything about the data platform.",
  timestamp: new Date().toISOString(),
  metadata: {
    links: [
      { label: "Data Catalog", href: "/catalog" },
      { label: "Incident Center", href: "/incidents" },
      { label: "AI Use-Case Fit", href: "/use-case-fit" },
    ],
  },
};

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.trim() === "") {
      result.push(<div key={key++} className="h-2" />);
      continue;
    }

    // Table rows
    if (line.startsWith("|")) {
      const cells = line.split("|").filter((_, i, a) => i > 0 && i < a.length - 1);
      const isHeader = cells.every((c) => c.trim().match(/^-+$/));
      if (!isHeader) {
        result.push(
          <tr key={key++} className="border-b border-slate-100">
            {cells.map((cell, i) => (
              <td key={i} className={`px-3 py-1.5 text-xs ${i === 0 ? "font-medium text-slate-800" : "text-slate-600"}`}>
                {cell.trim()}
              </td>
            ))}
          </tr>
        );
      }
      continue;
    }

    // Bold + inline rendering
    const parts = line.split(/(\*\*[^*]+\*\*)/);
    const rendered = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (line.startsWith("•") || line.startsWith("-")) {
      result.push(
        <div key={key++} className="flex items-start gap-1.5 text-sm text-slate-700 leading-relaxed">
          <span className="text-slate-400 mt-1 shrink-0">•</span>
          <span>{rendered}</span>
        </div>
      );
    } else if (line.match(/^\d+\./)) {
      result.push(
        <div key={key++} className="text-sm text-slate-700 leading-relaxed">
          {rendered}
        </div>
      );
    } else {
      result.push(
        <div key={key++} className="text-sm text-slate-700 leading-relaxed">
          {rendered}
        </div>
      );
    }
  }

  // Wrap table rows in a table
  const tableRows = result.filter((r): r is React.ReactElement =>
    r !== null && typeof r === "object" && "type" in (r as object) && (r as React.ReactElement).type === "tr"
  );
  if (tableRows.length > 0) {
    const nonTableRows = result.filter((r): r is React.ReactElement =>
      !(r !== null && typeof r === "object" && "type" in (r as object) && (r as React.ReactElement).type === "tr")
    );
    return [
      ...nonTableRows.slice(0, nonTableRows.length),
      <div key="table-wrapper" className="overflow-x-auto my-2">
        <table className="w-full border border-slate-200 rounded-lg overflow-hidden text-xs">
          <tbody>{tableRows}</tbody>
        </table>
      </div>,
    ];
  }

  return result;
}

export function CopilotClient() {
  const [messages, setMessages] = useState<CopilotMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    const streamingMsg: CopilotMessage = {
      id: streamingId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, streamingMsg]);

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
            ? { ...m, content: "Sorry, I couldn't reach the AI backend. Please try again." }
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
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-700 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">AI Data Copilot</h1>
            <p className="text-xs text-slate-500">Ask about data product readiness, quality blockers, and remediation priorities</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live · Claude Haiku
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === "user"
                  ? "bg-amber-700 text-white"
                  : "bg-amber-700 text-white"
              }`}>
                {msg.role === "user" ? "AS" : <Sparkles size={13} />}
              </div>

              {/* Bubble */}
              <div className={`max-w-xl ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-amber-700 text-white rounded-tr-md"
                    : "bg-white border border-slate-200 shadow-sm rounded-tl-md"
                }`}>
                  {msg.role === "user" ? (
                    <p className="text-sm text-white">{msg.content}</p>
                  ) : (
                    <div className="space-y-1">
                      {renderMarkdown(msg.content)}
                    </div>
                  )}
                </div>

                {/* Links */}
                {msg.metadata?.links && msg.metadata.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-1">
                    {msg.metadata.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-2.5 py-1 transition-colors"
                      >
                        <ExternalLink size={10} />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                <span className="text-xs text-slate-400 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center shrink-0">
                <Sparkles size={13} className="text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
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
      </div>

      {/* Suggested prompts */}
      {messages.length === 1 && (
        <div className="px-8 pb-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <MessageSquare size={12} />
              Suggested questions
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs bg-white border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 rounded-full px-3 py-1.5 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-8 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about data readiness, quality issues, or use-case fit..."
              rows={1}
              className="w-full px-4 py-3 text-sm bg-transparent resize-none focus:outline-none text-slate-800 placeholder:text-slate-400"
              style={{ maxHeight: 120 }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isThinking}
            className="w-10 h-10 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-200 text-white disabled:text-slate-400 rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-2 text-xs text-slate-400 text-center">
          Powered by Claude Haiku with full catalog context. All data is synthetic. Press Enter to send · Shift+Enter for new line.
        </div>
      </div>
    </div>
  );
}
