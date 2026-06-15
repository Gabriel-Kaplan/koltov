"use client";

import Link from "next/link";
import TranslateOrb from "../../components/TranslateOrb";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "\'Bricolage Grotesque\', sans-serif" }}>
      <style>{`@import url(\'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&display=swap\');`}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 sticky top-3 z-50 max-w-4xl mx-auto w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] ">
        <div className="flex items-center gap-2">
   <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 group">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
  Back home
</Link>
        </div>
        <div className="flex items-center gap-1.5">
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 sm:pb-32">

        <p className="text-xs text-blue-500 font-semibold uppercase tracking-widest mb-6">About Kol Tov</p>

        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-8 leading-tight" style={{ letterSpacing: "-1.5px" }}>
          Built from personal experience. Not a textbook.
        </h1>

        <div className="space-y-6 text-gray-600 leading-relaxed text-[16px] sm:text-[17px]">
          <p>
            My family made Aliyah when I was young. I watched my parents navigate a system that had no interest in explaining itself to them — government offices that only spoke Hebrew, forms with no English translations, benefits we were entitled to that nobody told us about, and a general feeling that you were supposed to just figure it out.
          </p>
          <p>
            We weren&apos;t in a dire situation, but we were overwhelmed. And I&apos;ve seen far too many families since then who were — who didn&apos;t claim Sal Klita in time, who signed rental contracts they didn&apos;t understand, who had money sitting in pension funds they didn&apos;t know how to access, or who missed their Arnona discount window entirely because nobody told them it wasn&apos;t automatic.
          </p>
          <p>
            That&apos;s why I built Kol Tov. Not because it&apos;s a clever product idea — but because it genuinely should exist and didn&apos;t.
          </p>
        </div>

        <div className="border-t border-gray-100 my-10 sm:my-12" />

        <h2 className="text-2xl font-semibold text-gray-900 mb-5" style={{ letterSpacing: "-0.5px" }}>What Kol Tov actually is</h2>
        <div className="space-y-5 text-gray-600 leading-relaxed text-[16px] sm:text-[17px]">
          <p>Kol Tov is a free AI guide for people making Aliyah and settling into life in Israel. It knows your stage — whether you&apos;re still planning, just arrived, settling in, or established — and it knows where you&apos;re from, because a South African in Ra&apos;anana needs very different advice than an American in Jerusalem.</p>
          <p>The chat answers real questions: how to navigate Misrad HaPnim, what FBAR means for Americans living in Israel, whether South Africa is on the reciprocal driving licence list (it&apos;s not), how to claim your Arnona discount before the window closes, and what to actually say to a landlord about a bank guarantee when you have no Israeli credit history.</p>
          <p>The document upload feature lets you drop in a rental contract, a payslip, a government letter, or any Israeli document — and Kol Tov will read it and explain it in plain English, flagging anything unusual or potentially problematic before you sign.</p>
          <p>The roadmap gives you a personalised checklist — not a generic PDF, but a step-by-step guide built for your specific situation, with real office names, phone numbers, what to bring, and insider tips from people who&apos;ve been through it.</p>
          <p>It&apos;s completely free. No account required. No data stored beyond your session.</p>
        </div>

        <div className="border-t border-gray-100 my-10 sm:my-12" />

        <h2 className="text-2xl font-semibold text-gray-900 mb-5" style={{ letterSpacing: "-0.5px" }}>The philosophy</h2>
        <div className="space-y-5 text-gray-600 leading-relaxed text-[16px] sm:text-[17px]">
          <p>Aliyah is one of the most significant things a Jewish person can do. The decision to move your life to a country where you don&apos;t speak the language, don&apos;t know the system, and can&apos;t read the forms — that takes real courage. The least the Jewish world can do is make the practical side easier.</p>
          <p>Kol Tov isn&apos;t trying to replace community, or the Jewish Agency, or Nefesh B&apos;Nefesh. It&apos;s the knowledgeable friend who&apos;s been through it — the one you can message at 11pm the night before you sign your lease to ask whether the clause about post-dated cheques is normal (it is), or whether the bank guarantee they&apos;re asking for is legally required (it&apos;s not, but it&apos;s very common).</p>
         <p>
          The name — כל טוב — is the Hebrew phrase for &quot;all good,&quot; or &quot;all the best.&quot; It&apos;s what we all say at the end of a call, at the end of a hard conversation, when things are stressful and uncertain and there&apos;s nothing left to do but say כל טוב. We all know that feeling making Aliyah. כל טוב felt right.
        </p>
        </div>

        <div className="border-t border-gray-100 my-10 sm:my-12" />

        <h2 className="text-2xl font-semibold text-gray-900 mb-5" style={{ letterSpacing: "-0.5px" }}>Who built this</h2>
        <div className="space-y-5 text-gray-600 leading-relaxed text-[16px] sm:text-[17px]">
          <p>I&apos;m Gabriel — a full-stack developer and AI engineer, 23 years old, and based in Israel. I made Aliyah with my family, served in the IDF as a software developer, and when I came out the other side I made a decision: I wanted to build a startup that genuinely impacts people. I wanted to build my own way.</p>
          <p>It was a terrifying and risky decision to make. Coming out of the army with no savings, no established reputation, in a country where building from scratch is hard — the safe move was obvious. I could have done the after-army trip, decompressed, then walked into a tech job like most people do. I thought about it. But I&apos;d spent a long time thinking about what I actually wanted, and the answer kept coming back the same: build something, help people. So I did.</p>
          <p>And honestly — that&apos;s part of what I want people to feel when they use anything I build. That it&apos;s possible. That you don&apos;t have to wait for the right moment or the right conditions. You can take the leap. It&apos;s scary, but you can.</p>

          {/* CleverYou card */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 sm:p-6 my-2">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest mb-1">Venture #1</p>
                <h3 className="text-lg font-semibold text-gray-900" style={{ letterSpacing: "-0.3px" }}>CleverYou</h3>
              </div>
              <a href="https://cleveryou.app" target="_blank" rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors">
                cleveryou.app
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              CleverYou started from a feeling I couldn&apos;t shake: that the way most people learn is fundamentally broken, and technology has barely touched it. Passive lectures, static notes, one-size-fits-all curricula — none of it adapts to how you actually think or where you actually struggle.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              So I built CleverYou — an AI-powered learning platform with voice tutors that adapt to you in real time (CleverCoaches), AI-generated study notes and flashcards from any source, community study groups, and a growing set of tools designed to make serious learning feel less like a chore. Seven months of solo development, built from scratch, live at cleveryou.app.
            </p>
          </div>

          {/* DTD card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 my-2">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Venture #2</p>
                <h3 className="text-lg font-semibold text-gray-900" style={{ letterSpacing: "-0.3px" }}>Dev To Defy (DTD)</h3>
              </div>
              <a href="https://devtodefy.com" target="_blank" rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-900 transition-colors">
                devtodefy.com
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              DTD came from watching small businesses get left behind — not because they lacked good ideas, but because building a serious online presence used to require budgets and teams most of them couldn&apos;t afford.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dev To Defy is a web development and digital marketing agency built around the belief that the right technology, built properly, is a great equaliser. We work with businesses that want to be taken seriously online — building websites, products, and marketing systems that actually perform.
            </p>
          </div>

          <p>Kol Tov sits outside both of those ventures. It&apos;s not a product. It&apos;s not a business. It&apos;s a few days of focused building that turned into something I think genuinely helps people. If it helps one family navigate Aliyah with less stress than mine did, it&apos;s already done its job.</p>
          <p>If you have feedback, corrections, or want to suggest something missing — I genuinely want to hear it.</p>
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-14 bg-blue-50 border border-blue-100 rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ letterSpacing: "-0.3px" }}>Want to contribute or give feedback?</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-5 sm:mb-6">Kol Tov is only as accurate as the community that informs it. If something is described incorrectly, or something important is missing — please reach out.</p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:contact@devtodefy.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              Email Gabriel
            </a>
            <Link href="/chat"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              Try Kol Tov AI
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <Link href="/legal" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/legal" className="hover:text-gray-600 transition-colors">Terms of Use</Link>
          <span>·</span>
          <span>Ra&apos;anana, Israel · 2025</span>
        </div>
      </div>

      <TranslateOrb />
    </div>
  );
}