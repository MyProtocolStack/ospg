"use client";

import { useState, useRef, useEffect } from "react";
import { Compass, Send, Loader2, Sparkles, FileText, Bot } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STARTER_PROMPTS = [
  {
    icon: FileText,
    label: "Am I eligible?",
    prompt:
      "Walk me through whether my organization is eligible for the FEMA NSGP grant. We're a Catholic high school in Rhode Island.",
  },
  {
    icon: Sparkles,
    label: "Draft my threat narrative",
    prompt:
      "Help me draft a threat narrative for our FEMA NSGP application. Our school has had two documented incidents (bathroom threats in 2021, school closure over a threat note in 2018).",
  },
  {
    icon: FileText,
    label: "What's the deadline?",
    prompt:
      "What is the current FEMA NSGP application deadline for Rhode Island and what's the typical timeline from application to award?",
  },
  {
    icon: Compass,
    label: "Build my application checklist",
    prompt:
      "Build me a complete checklist of documents and artifacts I need to submit a FEMA NSGP application for our parish.",
  },
];

export function PilotChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send(text: string) {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);

    // Streaming fetch
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/pilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Chat failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((msg) => (msg.id === assistantId ? { ...msg, content: acc } : msg))
        );
      }
    } catch (e) {
      const errorText = e instanceof Error ? e.message : "Unknown error";
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: `Sorry — ${errorText}. Please try again.` }
            : msg
        )
      );
    } finally {
      setStreaming(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    send(input.trim());
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 lg:px-12 py-8 border-b border-white/5 sticky top-0 lg:top-0 bg-[var(--color-navy-700)]/80 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center shrink-0">
            <Compass className="h-6 w-6 text-[var(--color-navy-700)]" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-0.5 font-medium">
              FEMA NSGP Grant Co-Pilot
            </p>
            <h1 className="font-display text-xl text-[var(--color-cream)]">
              Talk to PILOT
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-gold-400)] font-medium">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-12 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <EmptyState onPick={(p) => send(p)} />
          ) : (
            messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
          )}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="px-6 lg:px-12 py-6 border-t border-white/5 bg-[var(--color-navy-700)]/80 backdrop-blur"
      >
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            placeholder="Ask PILOT anything about your grant..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-lg bg-[var(--color-navy-800)] border border-white/10 text-[var(--color-cream)] placeholder:text-[var(--color-silver-400)] focus:border-[var(--color-gold-400)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)]/20 resize-none text-[14px]"
            disabled={streaming}
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="w-11 h-11 rounded-lg bg-gradient-to-br from-[var(--color-gold-300)] to-[var(--color-gold-500)] flex items-center justify-center text-[var(--color-navy-700)] hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
            ) : (
              <Send className="h-4 w-4" strokeWidth={2.5} />
            )}
          </button>
        </div>
        <p className="max-w-4xl mx-auto mt-3 text-[11px] text-[var(--color-silver-400)] text-center">
          PILOT can make mistakes. Verify critical grant information against
          FEMA.gov and your state SAA before submitting.
        </p>
      </form>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (p: string) => void }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 mb-6">
        <Compass className="h-8 w-8 text-[var(--color-gold-400)]" strokeWidth={1.5} />
      </div>
      <h2 className="font-display text-2xl md:text-3xl text-[var(--color-cream)] mb-3">
        How can I help with your grant?
      </h2>
      <p className="text-[var(--color-silver-200)] max-w-lg mx-auto mb-10">
        I know the FEMA NSGP rules, deadlines, and templates. I generate threat
        narratives, investment justifications, and pre-fill standard forms. Pick
        a starter or ask me anything.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {STARTER_PROMPTS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.label}
              onClick={() => onPick(p.prompt)}
              className="surface-card p-4 text-left hover:surface-card-elevated transition-all duration-300 group"
            >
              <Icon
                className="h-4 w-4 text-[var(--color-gold-400)] mb-2"
                strokeWidth={1.5}
              />
              <p className="font-medium text-[14px] text-[var(--color-cream)] mb-1 group-hover:text-gradient-gold transition-all">
                {p.label}
              </p>
              <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed line-clamp-2">
                {p.prompt}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-md bg-[var(--color-navy-500)] text-[var(--color-cream)] text-[14px] leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4 text-[var(--color-navy-700)]" strokeWidth={2} />
      </div>
      <div className="flex-1 surface-card px-5 py-4 max-w-[85%]">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-gold-400)] font-medium">
            PILOT
          </span>
        </div>
        <div className="text-[14px] text-[var(--color-silver-100)] leading-relaxed whitespace-pre-wrap">
          {message.content || (
            <span className="inline-flex items-center gap-1 text-[var(--color-silver-400)]">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Thinking...</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
