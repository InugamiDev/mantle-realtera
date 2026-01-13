"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  Building2,
  TrendingUp,
  MapPin,
  Loader2,
} from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

interface Message {
  role: "user" | "assistant";
  content: string;
  relatedProjects?: {
    slug: string;
    name: string;
    tier: string;
    reason: string;
  }[];
  followUpQuestions?: string[];
}

const QUESTION_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default function AdvisorPage() {
  const t = useTranslations("advisor");
  const tCommon = useTranslations("common");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId,
        }),
      });

      const data = await res.json();

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response?.message || tCommon("error"),
        relatedProjects: data.response?.relatedProjects,
        followUpQuestions: data.response?.followUpQuestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: tCommon("error"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="container-app py-6 sm:py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{tCommon("backToRanking")}</span>
        <span className="sm:hidden">{tCommon("backToRanking").split(" ")[0]}</span>
      </Link>

      {/* Header */}
      <header className="page-header">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Bot className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium uppercase tracking-wider text-cyan-400">
            {t("badge")}
          </span>
        </div>
        <h1 className="page-title">{t("title")}</h1>
        <p className="page-subtitle">{t("subtitle")}</p>
      </header>

      <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-3">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <GlassCard className="flex h-[500px] sm:h-[600px] flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Sparkles className="h-12 w-12 text-cyan-400/50" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {t("greeting")}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    {t("greetingDesc")}
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-cyan-500 text-white"
                          : "bg-white/10 text-foreground"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm sm:text-base">
                        {msg.content}
                      </div>

                      {/* Related Projects */}
                      {msg.relatedProjects && msg.relatedProjects.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.relatedProjects.map((project) => (
                            <Link
                              key={project.slug}
                              href={`/project/${project.slug}`}
                              className="flex items-center gap-2 rounded-lg bg-white/10 p-2 text-sm hover:bg-white/20"
                            >
                              <Building2 className="h-4 w-4 text-cyan-400" />
                              <span className="flex-1">{project.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {project.tier}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Follow-up Questions */}
                      {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.followUpQuestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => sendMessage(q)}
                              className="rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("inputPlaceholder")}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:border-cyan-500 focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-white transition-colors hover:bg-cyan-600 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Questions */}
          <GlassCard className="p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-amber-400" />
              {t("suggestedQuestions")}
            </h3>
            <div className="space-y-2">
              {QUESTION_KEYS.map((key) => {
                const question = t(`questions.${key}`);
                return (
                  <button
                    key={key}
                    onClick={() => sendMessage(question)}
                    className="w-full rounded-lg bg-white/5 px-3 py-2 text-left text-sm text-foreground hover:bg-white/10"
                  >
                    {question}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Capabilities */}
          <GlassCard className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("capabilities")}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Building2 className="mt-0.5 h-4 w-4 text-cyan-400" />
                {t("suggestProjects")}
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4 text-emerald-400" />
                {t("analyzeInvestment")}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-amber-400" />
                {t("compareAreas")}
              </li>
            </ul>
          </GlassCard>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
