"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Banknote, Building2, ClipboardList, Stethoscope, FileText } from "lucide-react";

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to process PDF. Please try again."); return; }
      sessionStorage.setItem("koltov_document", JSON.stringify({
        text: data.text, filename: data.filename, pages: data.pages, truncated: data.truncated,
      }));
      router.push("/chat");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const documentTypes = [
    { icon: <Home size={18} className="text-blue-500" />, label: "Rental contract", description: "Understand every clause before you sign" },
    { icon: <Banknote size={18} className="text-green-500" />, label: "Payslip", description: "Decode Israeli tax and pension deductions" },
    { icon: <Building2 size={18} className="text-indigo-500" />, label: "Bank letter", description: "Understand rejection reasons or account terms" },
    { icon: <ClipboardList size={18} className="text-orange-500" />, label: "Government letter", description: "Misrad HaPnim, Bituach Leumi, Mas Hachnasa" },
    { icon: <Stethoscope size={18} className="text-red-500" />, label: "Medical document", description: "Kupat Holim forms, referrals, coverage letters" },
    { icon: <FileText size={18} className="text-purple-500" />, label: "Employment contract", description: "Know your rights before you sign" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "\'Bricolage Grotesque\', sans-serif" }}>
      <style>{`@import url(\'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&display=swap\');`}</style>

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
          <Link href="/chat" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <span className="hidden sm:inline">Kol Tov AI</span>
          </Link>
          <Link href="/upload" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span className="hidden sm:inline">Upload</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 tracking-tight" style={{ letterSpacing: "-0.5px" }}>
            Upload a document
          </h1>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Upload any Israeli document — rental contract, payslip, government letter — and Kol Tov will read it and answer your questions in plain English.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center cursor-pointer transition-all mb-4 ${
            dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
          }`}
        >
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={onFileChange} className="hidden" />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600 font-medium">Reading your document…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">{dragging ? "Drop your PDF here" : "Drag & drop your PDF here"}</p>
              <p className="text-xs text-gray-400">or click to browse · PDF only · max 5MB</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
        )}

        <p className="text-xs text-gray-400 text-center mb-10 sm:mb-12">
          Your document is processed securely and not stored. Available only during your current session.
        </p>

        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">What you can upload</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documentTypes.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-white">
                <div className="mt-0.5 shrink-0">{doc.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{doc.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}