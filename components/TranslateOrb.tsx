"use client";

import { useState, useEffect, useRef } from "react";

const LANGUAGES = [
  { code: "en", label: "English"  },
  { code: "fr", label: "Français" },
  { code: "ru", label: "Русский"  },
  { code: "iw", label: "עברית"   },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: { pageLanguage: string; autoDisplay: boolean }, id: string) => void;
      };
    };
  }
}

function injectGoogleTranslate() {
  if (document.getElementById("gt-script")) return;

  window.googleTranslateElementInit = () => {
    new window.google!.translate.TranslateElement(
      { pageLanguage: "en", autoDisplay: false },
      "gt-hidden-root"
    );
  };

  const script = document.createElement("script");
  script.id = "gt-script";
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(script);

  if (!document.getElementById("gt-hidden-root")) {
    const div = document.createElement("div");
    div.id = "gt-hidden-root";
    div.style.cssText = "position:absolute;top:-9999px;left:-9999px;";
    document.body.appendChild(div);
  }
}

function setGoogleTranslateLanguage(langCode: string) {
  if (langCode === "en") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    window.location.reload();
    return;
  }
  const value = `/en/${langCode}`;
  document.cookie = `googtrans=${value}; path=/`;
  document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
  window.location.reload();
}

function getCurrentLang(): string {
  const match = document.cookie.match(/googtrans=\/en\/([a-z]+)/);
  return match ? match[1] : "en";
}

export default function TranslateOrb() {
  const [open, setOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return getCurrentLang();
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectGoogleTranslate();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (code: string) => {
    setActiveLang(code);
    setOpen(false);
    setGoogleTranslateLanguage(code);
  };

  return (
    <>
      <style>{`
        @keyframes orb-panel-up {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .kt-orb {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 99999;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #ffffff;
          border: 1.5px solid #BFDBFE;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          box-shadow: 0 4px 16px rgba(37,99,235,0.12);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .kt-orb:hover {
          transform: scale(1.08);
          box-shadow: 0 0 0 5px rgba(37,99,235,0.08), 0 6px 24px rgba(37,99,235,0.18);
        }
        .kt-orb-panel {
          position: fixed;
          bottom: 88px;
          right: 28px;
          z-index: 99999;
          background: #fff;
          border-radius: 16px;
          padding: 6px;
          border: 1px solid #E5E7EB;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
          animation: orb-panel-up 0.18s ease-out forwards;
          min-width: 160px;
        }
        .kt-orb-header {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9CA3AF;
          padding: 6px 10px 8px;
          font-family: inherit;
        }
        .kt-lang-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px 10px;
          border: none;
          background: transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.12s ease;
          font-family: inherit;
        }
        .kt-lang-btn:hover { background: #EFF6FF; }
        .kt-lang-btn.active { background: #EFF6FF; }
        .kt-lang-label {
          font-size: 13px;
          font-weight: 500;
          color: #111827;
        }
        .kt-lang-btn.active .kt-lang-label { color: #1D4ED8; font-weight: 600; }
        .kt-lang-check {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #2563EB;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        /* Hide all Google Translate UI artifacts */
        .goog-te-banner-frame,
        .goog-te-menu-frame,
        #goog-gt-tt,
        .goog-tooltip,
        .goog-tooltip:hover,
        .goog-text-highlight { display: none !important; }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }
      `}</style>

      {open && (
        <div className="kt-orb-panel" ref={panelRef}>
          <div className="kt-orb-header">Language</div>
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              className={`kt-lang-btn${activeLang === code ? " active" : ""}`}
              onClick={() => handleSelect(code)}
            >
              <span className="kt-lang-label">{label}</span>
              {activeLang === code && (
                <span className="kt-lang-check">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <button
        className="kt-orb"
        onClick={() => setOpen((v) => !v)}
        aria-label="Translate page"
        title="Translate page"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      </button>
    </>
  );
}