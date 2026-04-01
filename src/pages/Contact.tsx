import { useState } from "react";
import { AiFillLinkedin, AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const email = "pablomurillo.sp@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center overflow-hidden px-6 md:px-12 lg:px-20">
      <div className="z-10 text-center">
        <p className="text-violet-400 font-mono text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
          {t.contact.label}
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {t.contact.title}
        </h1>

        <div className="flex flex-col items-center gap-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-400 text-base md:text-lg">{t.contact.linkedinText}</p>
            <a
              href="https://www.linkedin.com/in/pablo-nicolas-murillo/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 w-fit hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all"
            >
              <AiFillLinkedin className="text-2xl text-blue-500" />
              <span className="font-medium">LinkedIn</span>
            </a>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-400 text-base md:text-lg">{t.contact.emailText}</p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 text-white bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 w-fit hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all cursor-pointer text-sm md:text-base"
            >
              <span className="font-medium">{email}</span>
              {copied ? (
                <AiOutlineCheck className="text-lg text-green-400" />
              ) : (
                <AiOutlineCopy className="text-lg text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Círculo superior derecho */}
      <div
        className="
          absolute
          -top-20
          -right-20
          w-64 md:w-125
          h-64 md:h-125
          bg-violet-600
          rounded-full
          opacity-30
          blur-[120px]
        "
      />

      {/* Círculo inferior izquierdo */}
      <div
        className="
          absolute
          -bottom-20
          -left-20
          w-80 md:w-150
          h-52 md:h-100
          bg-violet-600
          rounded-full
          opacity-25
          blur-[120px]
        "
      />
    </div>
  );
}
