"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      title: "Your Aliyah roadmap",
      desc: "A personalised 30/60/90 day checklist based on where you are in your journey. Every step explained clearly — what to do, where to go, what to bring.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      title: "Document explainer",
      desc: "Got a letter from Misrad Hapnim or Bituach Leumi? Upload it and we\'ll tell you exactly what it means and what you need to do next.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      title: "Ask anything",
      desc: "Our AI knows Israeli immigration inside out. Ask about Sal Klita, health insurance, bank accounts, driver\'s license — in your language, right now.",
    },
  ];

  const steps = [
    {
      n: "1",
      title: "Tell us where you are in your journey",
      desc: "Just arrived, a few months in, or still planning from abroad — we personalise everything based on your stage so you only see what\'s relevant right now.",
    },
    {
      n: "2",
      title: "Get your personalised roadmap",
      desc: "A clear, ordered checklist of every step — Misrad Hapnim, Bituach Leumi, Sal Klita, health insurance, bank account, driver\'s license conversion and more. Each item tells you exactly what to do, where to go, and what documents to bring.",
    },
    {
      n: "3",
      title: "Upload documents or ask questions anytime",
      desc: "Scan or upload any government letter for an instant plain-language explanation. Or just ask our AI anything — available 24/7, no appointment needed.",
    },
    {
      n: "4",
      title: "Check off steps as you go",
      desc: "Your progress is saved so you always know where you are. Come back anytime — your roadmap picks up exactly where you left off.",
    },
  ];

  const whys = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
      ),
      title: "Built for immigrants, not Israelis",
      desc: "Every explanation assumes you\'re starting from zero. No assumed knowledge of how the Israeli system works — we explain everything from scratch.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      title: "Saves you hours of research",
      desc: "Information about Israeli immigration is scattered across dozens of websites, often outdated or only in Hebrew. Kol Tov brings it all together.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      ),
      title: "Private and secure",
      desc: "Your documents are processed to answer your question and nothing more. We don\'t store them, we don\'t share them, and we never will.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      ),
      title: "Completely free",
      desc: "No subscription, no credit card. Making Aliyah is already expensive — your AI guide shouldn\'t add to that.",
    },
  ];

  const faqs = [
    {
      q: "Is Kol Tov a replacement for a lawyer or Nefesh B\'Nefesh?",
      a: "No — and we\'re upfront about that. Kol Tov gives you the information and context you need to navigate the system confidently. For complex legal situations, we\'ll always tell you when a professional is the right next step.",
    },
    {
      q: "How accurate is the information?",
      a: "Our AI is trained on up-to-date Israeli immigration processes, Ministry of Interior requirements, Bituach Leumi guidelines, and Jewish Agency procedures. We flag when information may vary based on your personal situation and always recommend verifying critical steps directly with the relevant office.",
    },
    {
      q: "What types of documents can I upload?",
      a: "Any PDF of a government letter, form, or official notice — Misrad Hapnim, Bituach Leumi, the Jewish Agency, municipal offices, health funds (Kupot Holim), the tax authority (Mas Hachnasa), and more.",
    },
    {
      q: "Can I use Kol Tov if I\'m still planning from abroad?",
      a: "Absolutely — and it\'s a great time to start. You can use the roadmap in planning mode to understand the process before you arrive, what documents to prepare, and what to expect in your first weeks.",
    },
    {
      q: "Is my data private?",
      a: "Yes. Documents you upload are sent only to process your question and are not stored on our servers afterward. We don\'t build profiles, we don\'t sell data, and we don\'t use your documents to train AI models.",
    },
    {
      q: "Which languages is Kol Tov available in?",
      a: "English, French, Russian, and Hebrew — the four most common languages among new immigrants to Israel. You can switch at any time.",
    },
  ];

  const languages = [
    { code: "EN", label: "English" },
    { code: "FR", label: "Français" },
    { code: "RU", label: "Русский" },
    { code: "HE", label: "עברית" },
  ];

  const stats = [
    { num: "40,000+", label: "New immigrants to Israel each year" },
    { num: "30+", label: "Government steps in the Aliyah process" },
    { num: "4", label: "Languages fully supported" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "\'Bricolage Grotesque\', sans-serif" }}>
      <style>{`@import url(\'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&display=swap\');`}</style>

      {/* ── Nav ── */}
<nav className="flex items-center justify-between px-4 md:px-6 py-3 sticky top-3 z-50 max-w-4xl mx-auto w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] bg-white/90 backdrop-blur-sm border border-gray-200 rounded-4xl">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">
            Kol <span className="text-blue-600">Tov</span>
          </span>
          <span className="hidden sm:inline text-sm text-gray-400 font-normal">כל טוב</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#how" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
          <a href="#why" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Why Kol Tov</a>
          <a href="#faq" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">FAQ</a>
          <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/onboarding" className="hidden md:inline-flex bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors font-medium">
            Get started
          </Link>
          <UserButton afterSignOutUrl="/" />
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col md:hidden" style={{ top: "69px" }}>
          <div className="flex flex-col px-6 pt-8 gap-1">
            {[
              { href: "#how", label: "How it works" },
              { href: "#why", label: "Why Kol Tov" },
              { href: "#faq", label: "FAQ" },
              { href: "/about", label: "About" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-4 rounded-2xl text-xl font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {item.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            ))}
            <div className="mt-6">
              <Link
                href="/onboarding"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center bg-gray-900 text-white text-base font-medium px-6 py-4 rounded-2xl hover:bg-gray-700 transition-colors"
              >
                Get started →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-16 md:pb-20 text-center">
        <h1 className="text-6xl sm:text-6xl md:text-7xl font-semibold leading-[1.08] mb-6 md:mb-7" style={{ letterSpacing: "-2px" }}>
          Making Aliyah<br />is overwhelming.<br />
          <span className="text-blue-600">We&apos;ve got you.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10 md:mb-12 px-2">
          Kol Tov is your AI guide through life in Israel — from government letters to your personalised 30-day action plan, in your language.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/onboarding" className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-xl text-base font-medium hover:bg-gray-700 transition-colors">
            Start your journey →
          </Link>
          <Link href="/upload" className="w-full sm:w-auto border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-base hover:bg-gray-50 transition-colors text-center">
            Upload a document
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 pb-20 md:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {stats.map((s) => (
            <div key={s.num} className="bg-gray-50 px-6 md:px-8 py-7 md:py-8 text-center">
              <div className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-2" style={{ letterSpacing: "-1.5px" }}>{s.num}</div>
              <div className="text-sm text-gray-500 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <SectionHeader
        label="what kol tov does"
        title="Everything you need, in one place."
        sub="Three tools built specifically for new immigrants — no jargon, no runaround."
      />
      <div className="max-w-5xl mx-auto px-5 md:px-10 pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-7 md:p-10">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 md:mb-7">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <SectionHeader
        label="how it works"
        title="Up and running in four steps."
        sub="No learning curve. No setup. Just tell us where you are and we take it from there."
      />
      <div id="how" className="max-w-5xl mx-auto px-5 md:px-10 pb-20 md:pb-28">
        <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
          {steps.map((s) => (
            <div key={s.n} className="flex items-start gap-5 md:gap-7 px-6 md:px-10 py-7 md:py-8 bg-white">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-medium flex items-center justify-center shrink-0 mt-0.5">
                {s.n}
              </div>
              <div>
                <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">{s.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Kol Tov ── */}
      <SectionHeader
        label="why kol tov"
        title="Built differently, for good reason."
        sub="We made specific choices about how this product works — and why."
      />
      <div id="why" className="max-w-5xl mx-auto px-5 md:px-10 pb-20 md:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {whys.map((w) => (
            <div key={w.title} className="bg-white p-7 md:p-10">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 md:mb-7">
                {w.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{w.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Languages ── */}
      <SectionHeader
        label="languages"
        title="Your language, your way."
        sub="Switch at any time — your roadmap and all explanations update instantly."
      />
      <div className="max-w-5xl mx-auto px-5 md:px-10 pb-20 md:pb-28 text-center">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {languages.map((l) => (
            <div key={l.label} className="flex items-center gap-3 px-5 md:px-6 py-3 border border-gray-100 rounded-full text-base text-gray-600 bg-white">
              <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{l.code}</span>
              <span>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <SectionHeader
        label="common questions"
        title="Straight answers."
        sub="No marketing speak. Just the things people actually want to know."
      />
      <div id="faq" className="max-w-5xl mx-auto px-5 md:px-10 pb-20 md:pb-28">
        <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white">
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 md:px-10 py-6 md:py-7 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-base md:text-lg font-semibold text-gray-900 pr-4">{f.q}</span>
                <span className="text-gray-400 shrink-0 text-2xl leading-none">
                  {activeFaq === i ? "−" : "+"}
                </span>
              </button>
              {activeFaq === i && (
                <div className="px-6 md:px-10 pb-6 md:pb-7">
                  <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 pb-20 md:pb-28">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-7 md:px-12 py-14 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-900 mb-4" style={{ letterSpacing: "-1px" }}>
            Ready to make sense of it all?
          </h2>
          <p className="text-base md:text-lg text-blue-600 mb-8 md:mb-10">
            Join thousands of new immigrants navigating Israel with confidence.
          </p>
          <Link href="/onboarding" className="inline-flex bg-blue-900 text-white px-8 md:px-10 py-4 rounded-xl text-base font-medium hover:bg-blue-800 transition-colors">
            Get started — it&apos;s free →
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-5 md:px-10 py-12 md:py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-semibold tracking-tight">Kol <span className="text-blue-600">Tov</span></span>
              <span className="text-sm text-gray-400">כל טוב</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">Your AI guide through life in Israel. Free to use, available in 4 languages.</p>
            <p className="text-xs text-gray-400 mt-5">
              Built by{" "}
              <a href="https://devtodefy.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 font-medium transition-colors underline underline-offset-2">
                Dev To Defy (DTD)
              </a>
            </p>
          </div>
          <div className="flex gap-12 md:gap-16">
            <div>
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">Product</p>
              <div className="flex flex-col gap-3">
                <a href="#how" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
                <a href="#why" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Why Kol Tov</a>
                <a href="#faq" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">FAQ</a>
                <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto border-t border-gray-100 mt-10 md:mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Kol Tov. All rights reserved.</p>
          <p className="text-xs text-gray-400">Free to use · No jargon</p>
        </div>
      </footer>

      {/* ── Kol Tov AI orb (fixed, CleverYou style) ── */}
      <Link
        href="/chat"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open Kol Tov AI"
      >
        <div className="relative w-14 h-14 rounded-full bg-blue-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center">
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />
          {/* Icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask Kol Tov AI
          </div>
        </div>
      </Link>
    </div>
  );
}

function SectionHeader({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-10 pt-6 pb-8 md:pb-10">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 whitespace-nowrap tracking-widest uppercase">{label}</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3" style={{ letterSpacing: "-1px" }}>{title}</h2>
      <p className="text-base md:text-lg text-gray-500 leading-relaxed">{sub}</p>
    </div>
  );
}