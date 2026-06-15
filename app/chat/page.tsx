 
 
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TranslateOrb from "../../components/TranslateOrb";

type Stage = "planning" | "just_arrived" | "settling" | "established";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Suggestion {
  label: string;
  prompt: string;
}

interface DocumentContext {
  text: string;
  filename: string;
  pages: number;
  truncated: boolean;
}

function getInitialOnboarding(): Record<string, string> {
  if (typeof window === "undefined") return { stage: "just_arrived", origin: "us_ca" };
  try {
    const ob = localStorage.getItem("koltov_onboarding");
    return ob ? JSON.parse(ob) : { stage: "just_arrived", origin: "us_ca" };
  } catch {
    return { stage: "just_arrived", origin: "us_ca" };
  }
}

function getInitialDocument(): DocumentContext | null {
  if (typeof window === "undefined") return null;
  try {
    const doc = sessionStorage.getItem("koltov_document");
    return doc ? JSON.parse(doc) : null;
  } catch {
    return null;
  }
}

const STAGE_SUGGESTIONS: Record<Stage, Suggestion[]> = {
  planning: [
    { label: "Where do I start?", prompt: "I'm planning to make Aliyah. What are the very first steps I should take right now?" },
    { label: "How long does Aliyah take?", prompt: "How long does the full Aliyah process take from applying to landing in Israel?" },
    { label: "What documents do I need?", prompt: "What documents do I need to gather before making Aliyah?" },
    { label: "How much money do I need?", prompt: "How much money should I have saved before making Aliyah? What are the realistic costs in the first year?" },
    { label: "Can I work immediately?", prompt: "Can I start working in Israel immediately after making Aliyah, or do I need to wait?" },
  ],
  just_arrived: [
    { label: "What do I do first?", prompt: "I just arrived in Israel as a new Oleh. What are the most urgent things I need to do in my first week?" },
    { label: "How do I get my Teudat Zehut?", prompt: "How do I get my Teudat Zehut? What do I bring and how long does it take?" },
    { label: "What is Sal Klita?", prompt: "What is Sal Klita, how much will I receive, and how do I claim it?" },
    { label: "Which health fund should I join?", prompt: "Which Kupat Holim should I join as a new English-speaking immigrant? What are the differences?" },
    { label: "How do I open a bank account?", prompt: "How do I open an Israeli bank account as a new Oleh? Which bank is best for immigrants?" },
  ],
  settling: [
    { label: "Convert my driver's licence", prompt: "How do I convert my foreign driver's licence to an Israeli one? What are the steps?" },
    { label: "Arnona discount", prompt: "Am I still eligible for an Arnona discount and how do I apply for it?" },
    { label: "Understand my payslip", prompt: "Can you explain what the deductions on an Israeli payslip mean? What is Mas Hachnasa, Bituach Leumi, and Bituach Briut?" },
    { label: "Tax residency", prompt: "How do I establish my tax residency status in Israel and claim the 10-year foreign income exemption?" },
    { label: "Enrol in Ulpan", prompt: "How do I enrol in a subsidised Ulpan? How many hours am I entitled to and how long do I have to use them?" },
  ],
  established: [
    { label: "Renew my Teudat Zehut", prompt: "My Teudat Zehut is expiring. How do I renew it and what do I need to bring?" },
    { label: "Citizenship for my children", prompt: "My children were born abroad. How do I register them as Israeli citizens?" },
    { label: "Foreign pension from Israel", prompt: "How do I receive my foreign pension while living in Israel? Are there tax implications?" },
    { label: "Buy an apartment", prompt: "What do I need to know about buying an apartment in Israel as an Oleh? Are there any purchase tax benefits?" },
    { label: "Bring family to Israel", prompt: "Can I bring a non-Jewish spouse or family member to live in Israel? What is the process?" },
  ],
};

const ORIGIN_SUGGESTIONS: Record<string, Suggestion[]> = {
  south_africa: [
    { label: "Telfed — what do they do?", prompt: "What exactly does Telfed do for South African immigrants in Israel and how do I register?" },
    { label: "Moving money from SA", prompt: "How do I legally move my money from South Africa to Israel? What are the SARB and SARS requirements?" },
  ],
  us_ca: [
    { label: "US taxes while in Israel", prompt: "Do I still need to file US tax returns after making Aliyah? What are my obligations as an American in Israel?" },
    { label: "FBAR and FATCA", prompt: "What is FBAR and FATCA and what do I need to do as an American with an Israeli bank account?" },
  ],
  uk: [
    { label: "UK State Pension from Israel", prompt: "Can I protect my UK State Pension while living in Israel? What are voluntary NI contributions?" },
    { label: "Notify HMRC", prompt: "What do I need to tell HMRC when I move to Israel permanently? What is form P85?" },
  ],
  france: [
    { label: "French pension from Israel", prompt: "Can I receive my French retraite pension while living in Israel? How do I arrange this?" },
    { label: "French community in Israel", prompt: "Where do most French immigrants live in Israel and what communities exist?" },
  ],
  russia_cis: [
    { label: "Document apostille", prompt: "What documents from Russia need to be apostilled before Aliyah and how do I do this?" },
    { label: "Jewish lineage proof", prompt: "I have a Jewish grandparent but limited documentation. How do I prove Jewish lineage for Aliyah?" },
  ],
  south_america: [
    { label: "Spanish-speaking communities", prompt: "Are there Spanish-speaking communities in Israel and where are they concentrated?" },
    { label: "Document authentication", prompt: "How do I apostille documents from Argentina/Brazil for the Aliyah process?" },
  ],
  other: [],
};

const DOC_SUGGESTIONS: Suggestion[] = [
  { label: "Give me an overview", prompt: "Can you give me an overview of this document and highlight anything I should pay attention to?" },
  { label: "Are there any red flags?", prompt: "Are there any clauses or terms in this document that are unusual, unfair, or that I should be concerned about as an Oleh?" },
  { label: "Explain the Hebrew terms", prompt: "Can you explain all the Hebrew or legal terms in this document in plain English?" },
  { label: "What are my rights here?", prompt: "Based on this document, what are my rights and obligations under Israeli law?" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [onboarding] = useState<Record<string, string>>(getInitialOnboarding);
  const [mounted, setMounted] = useState(false);
  const [doc, setDoc] = useState<DocumentContext | null>(getInitialDocument);
  const [uploadingInChat, setUploadingInChat] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Accumulator ref avoids the immutability ESLint error on let fullContent
  const contentRef = useRef("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const stage = (onboarding.stage ?? "just_arrived") as Stage;
  const origin = onboarding.origin ?? "us_ca";

  const stageSuggestions = STAGE_SUGGESTIONS[stage] ?? STAGE_SUGGESTIONS.just_arrived;
  const originSuggestions = (ORIGIN_SUGGESTIONS[origin] ?? []).slice(0, 2);
  const allSuggestions = [...stageSuggestions.slice(0, 3), ...originSuggestions];

  const sendMessage = useCallback(async (text: string, docOverride?: DocumentContext) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => {
      const newMessages = [...prev, userMsg];
      // kick off fetch after state update
      return newMessages;
    });
    setInput("");
    setLoading(true);
    contentRef.current = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const activeDoc = docOverride ?? doc;

    try {
      abortRef.current = new AbortController();

      // We need to build the messages array manually since setState is async
      const currentMessages = messages;
      const newMessages = [...currentMessages, userMsg];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          stage,
          origin,
          documentContext: activeDoc?.text ?? null,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to get response");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.delta?.text ?? "";
            contentRef.current = contentRef.current + delta;
            const snapshot = contentRef.current;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: snapshot };
              return updated;
            });
          } catch {}
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          };
          return updated;
        });
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [doc, loading, messages, origin, stage]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") return;
    setUploadingInChat(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return;

      const docContext: DocumentContext = {
        text: data.text,
        filename: data.filename,
        pages: data.pages,
        truncated: data.truncated,
      };

      sessionStorage.setItem("koltov_document", JSON.stringify(docContext));
      setDoc(docContext);

      if (messages.length === 0) {
        sendMessage(
          `I've uploaded a document called "${data.filename}". Can you read it and give me an overview of what it contains and anything I should be aware of?`,
          docContext
        );
      }
    } finally {
      setUploadingInChat(false);
    }
  }, [messages.length, sendMessage]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function dismissDocument() {
    sessionStorage.removeItem("koltov_document");
    setDoc(null);
  }

  const isEmpty = messages.length === 0;
  const suggestions = doc ? DOC_SUGGESTIONS : allSuggestions;

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&display=swap');`}</style>

      {/* Nav */}
<nav className="flex items-center justify-between px-4 md:px-6 py-3 sticky top-3 z-50 max-w-4xl mx-auto w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] bg-white/90 backdrop-blur-sm border border-gray-200 rounded-4xl">
  <div className="flex items-center gap-2">
    <Link href="/" className="text-xl font-semibold tracking-tight text-black">
      Kol <span className="text-blue-600">Tov</span>
    </Link>
    <span className="hidden sm:inline text-sm text-gray-400">כל טוב</span>
  </div>
  <div className="flex items-center gap-1.5">
    <Link href="/roadmap" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h12"/></svg>
      <span className="hidden sm:inline">Roadmap</span>
    </Link>
    <Link href="/chat" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <span className="hidden sm:inline">Kol Tov AI</span>
    </Link>
    <Link href="/upload" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <span className="hidden sm:inline">Upload</span>
    </Link>
  </div>
</nav>

      {/* Document banner */}
      {doc && mounted && (
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-2.5 flex items-center justify-between max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span className="text-xs text-blue-700 font-medium">{doc.filename}</span>
            <span className="text-xs text-blue-400">· {doc.pages} page{doc.pages !== 1 ? "s" : ""} loaded</span>
            {doc.truncated && (
              <span className="text-xs text-blue-400">· (large file — first portion loaded)</span>
            )}
          </div>
          <button
            onClick={dismissDocument}
            className="text-xs text-blue-400 hover:text-blue-700 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 pb-6">

        {/* Empty state */}
        {isEmpty && mounted && (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight" style={{ letterSpacing: "-0.5px" }}>
              {doc ? "Document loaded — ask anything about it" : "Ask anything about your Aliyah"}
            </h1>
            <p className="text-sm text-gray-500 mb-10 text-center max-w-md leading-relaxed">
              {doc
                ? "Kol Tov has read your document and can explain it, flag issues, and answer questions about it in plain English."
                : "I know your stage and where you're from — every answer is tailored to your situation."}
            </p>

            <div className="w-full grid grid-cols-1 gap-2.5">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.prompt)}
                  className="w-full text-left px-5 py-4 rounded-2xl border border-gray-100 bg-white hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{s.label}</p>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 group-hover:stroke-blue-500 transition-colors">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {!isEmpty && (
          <div className="flex-1 py-8 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1 shrink-0">
                    <span className="text-white text-xs font-semibold">K</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gray-900 text-white rounded-tr-sm whitespace-pre-wrap"
                      : "bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : msg.content === "" && loading ? (
                    <span className="inline-flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-strong:text-gray-900 prose-a:text-blue-600">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {isEmpty && <div ref={bottomRef} />}
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-300 focus-within:bg-white transition-all">
            {/* PDF upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingInChat}
              className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              title="Upload a PDF document"
            >
              {uploadingInChat ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
              className="hidden"
            />

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={doc ? `Ask about ${doc.filename}…` : "Ask anything about your Aliyah…"}
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 resize-none outline-none leading-relaxed max-h-32"
              style={{ scrollbarWidth: "none" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                input.trim() && !loading
                  ? "bg-gray-900 text-white hover:bg-gray-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Kol Tov provides guidance, not legal advice. Verify critical steps with official sources.
          </p>
        </div>
      </div>

      <TranslateOrb />
    </div>
  );
}