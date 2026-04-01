import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useLanguage } from "../context/LanguageContext";

const diffIcons = ["🧠", "⚡", "🎯"];

export default function About() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <div className="min-h-screen bg-gray-950 px-6 md:px-12 lg:px-20 py-16 flex items-center">
      <div className="max-w-2xl mx-auto w-full">

        {/* Label */}
        <p className="text-violet-400 font-mono text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
          {a.label}
        </p>

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 animate-fade-in-up leading-tight"
          style={{ animationDelay: "0.1s" }}
        >
          {a.title}{" "}
          <span className="text-violet-400">{a.titleAccent}</span>
        </h1>

        {/* Body */}
        <div
          className="flex flex-col gap-5 mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">{a.p1}</p>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">{a.p2}</p>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">{a.p3}</p>
        </div>

        {/* Differentiators */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {a.differentiators.map((item, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-violet-500/40 transition-colors"
            >
              <span className="text-2xl mb-3 block">{diffIcons[i]}</span>
              <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
          >
            {a.ctaText}
            <AiOutlineArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
