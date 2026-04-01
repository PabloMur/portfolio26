import {
  AiOutlineRocket,
  AiOutlineRobot,
  AiOutlineAppstore,
  AiOutlineCheckCircle,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { useLanguage } from "../context/LanguageContext";

const icons = [
  <AiOutlineRocket className="text-3xl" />,
  <AiOutlineRobot className="text-3xl" />,
  <AiOutlineAppstore className="text-3xl" />,
];

const accentColors = ["violet", "violet", "emerald"] as const;

const accentMap: Record<string, string> = {
  indigo: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  violet: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
};

const tagMap: Record<string, string> = {
  indigo: "bg-violet-500/15 text-violet-300",
  violet: "bg-violet-500/15 text-violet-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
};

const priceMap: Record<string, string> = {
  indigo: "text-violet-400",
  violet: "text-violet-400",
  emerald: "text-emerald-400",
};

export default function Services() {
  const { t } = useLanguage();
  const s = t.services;

  return (
    <div className="min-h-screen bg-gray-950 px-6 md:px-12 lg:px-20 py-16 flex flex-col">
      {/* Header */}
      <p className="text-violet-400 font-mono text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
        {s.label}
      </p>
      <h1
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        {s.title}
      </h1>
      <p
        className="text-gray-400 text-base md:text-lg max-w-xl mb-14 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {s.subtitle}
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {s.items.map((service, i) => {
          const accent = accentColors[i];
          return (
            <div
              key={service.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-5 hover:border-gray-700 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              {/* Icon + tag */}
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl border ${accentMap[accent]}`}>
                  {icons[i]}
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${tagMap[accent]}`}>
                  {service.tag}
                </span>
              </div>

              {/* Title + description */}
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{service.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </div>

              {/* Includes */}
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                  {s.includesLabel}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <AiOutlineCheckCircle className={`mt-0.5 shrink-0 ${priceMap[accent]}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefit */}
              <div className="border-t border-gray-800 pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-1">
                  {s.resultLabel}
                </p>
                <p className="text-sm text-white font-medium">{service.benefit}</p>
              </div>

              {/* Price */}
              <div className="mt-auto">
                <span className={`text-2xl font-bold ${priceMap[accent]}`}>{service.price}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Packages */}
      <div className="mt-20 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
        <div className="mb-8">
          <p className="text-violet-400 font-mono text-sm tracking-widest uppercase mb-2">
            {s.packagesTitle}
          </p>
          <p className="text-gray-500 text-sm">{s.packagesSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {s.packages.map((pkg) => (
            <div
              key={pkg.name}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-violet-500/40 transition-colors flex flex-col gap-3"
            >
              <span className="text-2xl">{pkg.emoji}</span>
              <div>
                <p className="text-white font-semibold text-sm">{pkg.name}</p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{pkg.desc}</p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-800">
                <span className="text-violet-400 font-bold">{pkg.price}</span>
                <span className="text-xs text-gray-600">{pkg.days}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="mt-16 rounded-2xl bg-gray-900 border border-gray-800 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up"
        style={{ animationDelay: "0.7s" }}
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{s.ctaTitle}</h2>
          <p className="text-gray-400 text-sm md:text-base max-w-lg">{s.ctaSubtitle}</p>
        </div>
        <a
          href="https://wa.me/5491122334455"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {s.ctaButton}
          <AiOutlineArrowRight />
        </a>
      </div>
    </div>
  );
}
