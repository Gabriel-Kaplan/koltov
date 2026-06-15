"use client";

import { useState } from "react";
import Link from "next/link";
import TranslateOrb from "../../components/TranslateOrb";

const sections = [
  {
    id: "privacy",
    label: "Privacy Policy",
    content: [
      {
        heading: "What we collect",
        body: `Kol Tov collects the minimum information needed to function.

When you create an account (via Clerk), we receive your email address and any profile information you choose to provide (name, profile photo). This is handled by Clerk — a third-party authentication provider — and is subject to their privacy policy at clerk.com/privacy.

When you use the chat, we receive the messages you type and send them to Anthropic's API to generate a response. We do not store your conversation history on our servers. Each session is independent.

When you upload a document, the extracted text is sent to Anthropic's API to answer your questions. The document and extracted text are not stored on our servers after your session ends. They exist only in your browser's sessionStorage, which is cleared when you close the tab.

Your onboarding answers (stage and origin) are saved in your browser's localStorage. They never leave your device unless you explicitly use the chat or roadmap features, at which point your stage and origin are sent as part of the AI prompt context.`,
      },
      {
        heading: "What we do not collect",
        body: `We do not collect:
• Your documents or their contents after your session ends
• Your conversation history
• Payment information (handled entirely by PayPal — we never see your card details)
• Your location beyond what you voluntarily share
• Any data for advertising or third-party marketing purposes`,
      },
      {
        heading: "Third-party services",
        body: `Kol Tov uses the following third-party services:

• Clerk (clerk.com) — authentication and account management. Your email and profile are stored with Clerk subject to their privacy policy.
• Anthropic (anthropic.com) — AI responses. Your messages and document text are sent to Anthropic's API. Anthropic's data usage policy applies to API usage.
• Vercel (vercel.com) — hosting and deployment. Standard server logs (IP address, request metadata) may be retained by Vercel per their privacy policy.

We do not sell your data to any third party. We do not use your data to train AI models.`,
      },
      {
        heading: "Cookies and storage",
        body: `Kol Tov uses browser localStorage to save your onboarding preferences (stage, origin, completed roadmap steps, document checklist). This data never leaves your device.

Clerk may set authentication cookies necessary for login to function. No advertising or tracking cookies are used.`,
      },
      {
        heading: "Data retention",
        body: `Account data (email, name) is retained as long as your account exists. You can delete your account at any time by contacting us at contact@devtodefy.com, after which your Clerk account and associated data will be deleted within 30 days.

Chat messages and uploaded documents are not retained on our servers. They exist only during your active session.

Browser localStorage data (roadmap progress, preferences) exists only on your device and can be cleared at any time by clearing your browser storage.`,
      },
      {
        heading: "Your rights",
        body: `You have the right to:
• Access the personal data we hold about you
• Request deletion of your account and associated data
• Withdraw consent at any time by deleting your account

To exercise any of these rights, contact us at contact@devtodefy.com. We will respond within 30 days.`,
      },
      {
        heading: "Children",
        body: `Kol Tov is not directed at children under the age of 13. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.`,
      },
      {
        heading: "Changes to this policy",
        body: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of Kol Tov after changes constitutes acceptance of the updated policy.

Last updated: June 2025`,
      },
    ],
  },
  {
    id: "terms",
    label: "Terms of Use",
    content: [
      {
        heading: "Acceptance",
        body: `By using Kol Tov, you agree to these Terms of Use. If you do not agree, please do not use the service. These terms apply to all users of koltov.app and any associated services.`,
      },
      {
        heading: "What Kol Tov is",
        body: `Kol Tov is an AI-powered information and guidance tool designed to help immigrants navigate the Aliyah process and life in Israel. It is provided for informational purposes only.

Kol Tov is not a law firm, legal adviser, financial adviser, or government authority. Nothing on this platform constitutes legal advice, financial advice, or official guidance from any Israeli government body. Information provided by Kol Tov may be incomplete, outdated, or inapplicable to your specific situation.

Always verify critical steps — particularly those involving government offices, financial decisions, or legal documents — directly with the relevant official source before acting.`,
      },
      {
        heading: "Account",
        body: `You must create an account to use the core features of Kol Tov. You are responsible for maintaining the security of your account and for all activity that occurs under it.

You must provide accurate information when creating your account. You may not impersonate another person or create an account on behalf of someone else without their permission.`,
      },
      {
        heading: "Acceptable use",
        body: `You agree not to:
• Use Kol Tov for any unlawful purpose
• Attempt to reverse-engineer, scrape, or extract data from Kol Tov at scale
• Submit false, misleading, or harmful content through the chat or document upload
• Attempt to circumvent rate limits, authentication, or security measures
• Use Kol Tov to generate content that could harm, mislead, or deceive others
• Upload documents that contain malware or are designed to exploit the system

We reserve the right to suspend or terminate accounts that violate these terms.`,
      },
      {
        heading: "Uploaded documents",
        body: `When you upload a document, you confirm that you have the right to do so — that the document belongs to you or you have permission to share it for the purpose of getting AI assistance.

Do not upload documents containing sensitive information about third parties without their consent. Do not upload classified, confidential, or legally privileged documents unless you understand and accept the risks of processing them through a third-party AI service.`,
      },
      {
        heading: "Disclaimer of warranties",
        body: `Kol Tov is provided "as is" without warranties of any kind, express or implied. We do not warrant that the information provided is accurate, complete, current, or suitable for your specific situation.

Israeli immigration law, government procedures, and benefit entitlements change frequently. Information that was accurate when written may no longer apply. Always verify with official sources.`,
      },
      {
        heading: "Limitation of liability",
        body: `To the maximum extent permitted by law, Kol Tov and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the service or reliance on information provided by it.

This includes but is not limited to: missed government deadlines, incorrect benefit claims, decisions made based on AI-generated guidance, or losses resulting from document uploads.`,
      },
      {
        heading: "Intellectual property",
        body: `The Kol Tov name, logo, and interface design are the intellectual property of Dev To Defy (DTD). You may not reproduce or use them without permission.

Content you submit (messages, uploaded documents) remains yours. By submitting it, you grant us a limited licence to process it for the sole purpose of providing you with AI-generated responses.`,
      },
      {
        heading: "Governing law",
        body: `These terms are governed by the laws of the State of Israel. Any disputes arising from the use of Kol Tov shall be subject to the exclusive jurisdiction of the courts of Israel.`,
      },
      {
        heading: "Changes to these terms",
        body: `We may update these Terms of Use at any time. Continued use of Kol Tov after changes are posted constitutes acceptance of the updated terms.

Last updated: June 2025`,
      },
    ],
  },
];

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  const active = sections.find((s) => s.id === activeTab)!;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "\'Bricolage Grotesque\', sans-serif" }}>
      <style>{`@import url(\'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&display=swap\');`}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 sticky top-3 z-50 max-w-4xl mx-auto w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-semibold tracking-tight text-black">
            Kol <span className="text-blue-600">Tov</span>
          </Link>
          <span className="hidden sm:inline text-sm text-gray-300">כל טוב</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Link href="/roadmap" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h12"/></svg>
            <span className="hidden sm:inline">Roadmap</span>
          </Link>
          <Link href="/chat" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <span className="hidden sm:inline">Kol Tov AI</span>
          </Link>
          <Link href="/about" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="hidden sm:inline">About</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 sm:pb-32">

        <p className="text-xs text-blue-500 font-semibold uppercase tracking-widest mb-4">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-8 leading-tight" style={{ letterSpacing: "-1px" }}>
          Privacy & Terms
        </h1>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-10 bg-gray-50 border border-gray-100 rounded-2xl p-1.5 w-fit">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id as "privacy" | "terms")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === s.id
                  ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {active.content.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3" style={{ letterSpacing: "-0.3px" }}>
                {section.heading}
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {section.body}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-4">Questions about this policy? Contact us at <a href="mailto:contact@devtodefy.com" className="text-blue-500 hover:underline">contact@devtodefy.com</a></p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <Link href="/about" className="hover:text-gray-600 transition-colors">About Kol Tov</Link>
            <span>·</span>
            <Link href="/chat" className="hover:text-gray-600 transition-colors">Try Kol Tov AI</Link>
            <span>·</span>
            <span>© {new Date().getFullYear()} Dev To Defy (DTD)</span>
          </div>
        </div>
      </div>

      <TranslateOrb />
    </div>
  );
}