"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TranslateOrb from "../../components/TranslateOrb";

const steps = [
  {
    id: "stage",
    question: "Where are you in your Aliyah journey?",
    sub: "We\'ll personalise your roadmap based on where you are right now.",
    options: [
      { value: "planning", label: "Still planning", desc: "I haven\'t made Aliyah yet" },
      { value: "just_arrived", label: "Just arrived", desc: "I\'ve been in Israel less than 3 months" },
      { value: "settling", label: "Settling in", desc: "3–12 months in Israel" },
      { value: "established", label: "Been here a while", desc: "Over a year in Israel" },
    ],
  },
  {
    id: "origin",
    question: "Where are you coming from?",
    sub: "This helps us give you country-specific guidance on documents and processes.",
    options: [
      { value: "us_ca", label: "USA or Canada", desc: "North America" },
      { value: "uk", label: "United Kingdom", desc: "Great Britain & Northern Ireland" },
      { value: "france", label: "France", desc: "Including French territories" },
      { value: "russia_cis", label: "Russia or CIS", desc: "Former Soviet Union countries" },
      { value: "south_america", label: "South America", desc: "Argentina, Brazil, and others" },
      { value: "south_africa", label: "South Africa", desc: "Including Zimbabwe and southern Africa" },
      { value: "other", label: "Somewhere else", desc: "Another country not listed" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  function handleSelect(value: string) { setSelected(value); }

  function handleNext() {
    if (!selected) return;
    const newAnswers = { ...answers, [step.id]: selected };
    setAnswers(newAnswers);
    if (isLast) {
      localStorage.setItem("koltov_onboarding", JSON.stringify(newAnswers));
      router.push("/roadmap");
      return;
    }
    setDirection("forward");
    setAnimating(true);
    setTimeout(() => { setCurrentStep((s) => s + 1); setSelected(null); setAnimating(false); }, 220);
  }

  function handleBack() {
    if (currentStep === 0) return;
    setDirection("back");
    setAnimating(true);
    setTimeout(() => { setCurrentStep((s) => s - 1); setSelected(answers[steps[currentStep - 1].id] ?? null); setAnimating(false); }, 220);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "\'Bricolage Grotesque\', sans-serif" }}>
      <style>{`
        @import url(\'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&display=swap\');
        @keyframes slideInForward { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInBack    { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOutForward{ from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-32px); } }
        @keyframes slideOutBack   { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(32px); } }
        .animate-in-forward  { animation: slideInForward 0.22s ease both; }
        .animate-in-back     { animation: slideInBack 0.22s ease both; }
        .animate-out-forward { animation: slideOutForward 0.18s ease both; }
        .animate-out-back    { animation: slideOutBack 0.18s ease both; }
        .option-card { transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease; }
        .option-card:hover { border-color: #93C5FD; background: #F0F9FF; }
        .option-card:active { transform: scale(0.99); }
        .option-card.selected { border-color: #2563EB; background: #EFF6FF; }
      `}</style>

      {/* Top bar */}
      <div className="w-full px-4 sm:px-10 pt-6 sm:pt-8 pb-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Kol Tov
            </Link>
            <span className="text-sm text-gray-400">{currentStep + 1} of {steps.length}</span>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-10 py-10 sm:py-16">
        <div className="w-full max-w-2xl">
          <div className={animating ? (direction === "forward" ? "animate-out-forward" : "animate-out-back") : (direction === "forward" ? "animate-in-forward" : "animate-in-back")}>

            <div className="mb-8 sm:mb-10">
              <p className="text-xs text-blue-500 font-semibold uppercase tracking-widest mb-3 sm:mb-4">Step {currentStep + 1}</p>
              <h1 className="text-2xl sm:text-4xl font-semibold text-gray-900 mb-3 leading-tight" style={{ letterSpacing: "-0.75px" }}>
                {step.question}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{step.sub}</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 mb-8 sm:mb-10">
              {step.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`option-card w-full text-left px-4 sm:px-6 py-4 sm:py-5 rounded-xl border-2 ${selected === opt.value ? "selected" : "border-gray-100"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{opt.label}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-4 transition-all duration-150 ${selected === opt.value ? "border-blue-600 bg-blue-600" : "border-gray-200"}`}>
                      {selected === opt.value && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className={`flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors ${currentStep === 0 ? "invisible" : ""}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selected}
                className={`flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-150 ${selected ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              >
                {isLast ? "Take me to my roadmap" : "Continue"}
                {selected && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-10 pb-6 sm:pb-8 text-center">
        <p className="text-xs text-gray-300">No account needed · Your answers are saved locally · Takes 30 seconds</p>
      </div>
      <TranslateOrb />
    </div>
  );
}