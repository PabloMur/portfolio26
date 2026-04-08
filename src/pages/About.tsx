import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useLanguage } from "../context/LanguageContext";

const diffIcons = ["🧠", "⚡", "🎯"];

export default function About() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden py-16 px-6 sm:px-8 flex items-center">
      <div className="max-w-6xl mx-auto w-full">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <div className="animate-fade-in-up">
            <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-3">
              {a.label}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {a.title}{" "}
              <span className="text-violet-400">{a.titleAccent}</span>
            </h1>
            <div className="flex flex-col gap-4 mb-8">
              <p className="text-gray-400 text-base leading-relaxed">{a.p1}</p>
              <p className="text-gray-400 text-base leading-relaxed">{a.p2}</p>
              <p className="text-gray-400 text-base leading-relaxed">{a.p3}</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
            >
              {a.ctaText}
              <AiOutlineArrowRight />
            </Link>
          </div>

          {/* Right — cards */}
          <div
            className="flex flex-col gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {a.differentiators.map((item, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-violet-500/40 transition-colors flex items-start gap-4"
              >
                <span className="text-2xl shrink-0">{diffIcons[i]}</span>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-violet-600 rounded-full opacity-15 blur-[120px] pointer-events-none" />
    </div>
  );
}
