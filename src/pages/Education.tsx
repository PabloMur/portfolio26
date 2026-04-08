import { AiOutlineLink } from "react-icons/ai";
import { useLanguage } from "../context/LanguageContext";

export default function Education() {
  const { t } = useLanguage();
  const ed = t.education;

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden py-16 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-14 animate-fade-in-up">
          <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-3">
            {ed.label}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {ed.title}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl">
            {ed.subtitle}
          </p>
        </div>

        {/* Area cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {ed.areas.map((area) => (
            <div
              key={area.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-violet-500/40 transition-colors"
            >
              <h3 className="text-white font-semibold text-base mb-2">{area.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{area.description}</p>
            </div>
          ))}
        </div>

        {/* Course card — full width to match grid above */}
        <div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-gray-400 text-base md:text-lg">
            {ed.courseText}{" "}
            <span className="text-white font-semibold">{ed.courseName}</span>{" "}
            {ed.courseAt}
          </p>
          <a
            href="https://apx.school/profiles/06df1c36-ef26-47e2-bd68-c12987bd4ad0/web-2"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            <AiOutlineLink className="text-lg" />
            {ed.certButton}
          </a>
        </div>
      </div>

      <div className="absolute top-1/4 -right-20 w-64 md:w-125 h-64 md:h-125 bg-violet-600 rounded-full opacity-20 blur-[120px] pointer-events-none" />
    </div>
  );
}
