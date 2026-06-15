/* eslint-disable @next/next/no-html-link-for-pages */
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center justify-center px-6"
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&display=swap');`}</style>
      <div className="mb-8 text-center">
        <a href="/" className="text-2xl font-semibold tracking-tight text-black">
          Kol <span className="text-blue-600">Tov</span>
        </a>
        <p className="text-sm text-gray-500 mt-2">Create your free account</p>
      </div>
      <SignUp />
    </div>
  );
}