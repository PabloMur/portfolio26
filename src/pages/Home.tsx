import { AiOutlineGithub, AiFillLinkedin, AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const h = t.home;

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-gray-950 px-6 py-12 sm:py-10 md:px-12 lg:px-16 lg:py-6">
      <div className="z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(240px,320px)] lg:gap-10 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,340px)]">

        {/* Left content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

          {/* Label */}
          <span
            className="mb-4 text-xs font-mono uppercase tracking-widest text-violet-400 animate-fade-in-up"
          >
            {h.label}
          </span>

          {/* Title */}
          <h1
            className="mb-2 max-w-4xl text-2xl font-bold leading-[1.06] text-white animate-fade-in-up sm:text-[2.45rem] lg:text-[2.75rem] xl:text-[3rem]"
            style={{ animationDelay: "0.1s" }}
          >
            {h.title1}
          </h1>
          <h1
            className="mb-5 max-w-4xl text-2xl font-bold leading-[1.06] text-violet-400 animate-fade-in-up sm:text-[2.45rem] lg:text-[2.75rem] xl:text-[3rem]"
            style={{ animationDelay: "0.2s" }}
          >
            {h.title2}
          </h1>

          {/* Subtitle */}
          <p
            className="mb-7 max-w-xl text-sm text-gray-400 animate-fade-in-up sm:text-base md:text-lg"
            style={{ animationDelay: "0.3s" }}
          >
            {h.subtitle}
          </p>

          {/* CTAs */}
          <div
            className="mb-8 flex w-full flex-col items-stretch gap-3 animate-fade-in-up sm:w-auto sm:flex-row sm:items-center"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              {h.ctaPrimary}
              <AiOutlineArrowRight />
            </Link>
            <Link
              to="/projects"
              className="rounded-xl border border-gray-700 bg-transparent px-6 py-3 text-center font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-900"
            >
              {h.ctaSecondary}
            </Link>
            <a
              href="https://github.com/PabloMur"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-900 hover:text-white"
            >
              <AiOutlineGithub className="text-lg" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/pablo-nicolas-murillo/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-900 hover:text-white"
            >
              <AiFillLinkedin className="text-lg" />
              LinkedIn
            </a>
          </div>

          {/* Stats */}
          <div
            className="grid w-full max-w-xl grid-cols-1 gap-4 text-center animate-fade-in-up sm:grid-cols-3 sm:gap-6 lg:text-left"
            style={{ animationDelay: "0.5s" }}
          >
            {h.stats.map((stat, i) => (
              <div
                key={i}
                className={i !== 0 ? "border-t border-gray-800 pt-4 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0" : ""}
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div
          className="relative mx-auto flex w-full max-w-[16rem] items-center justify-center animate-fade-in-up sm:max-w-[18rem] lg:mx-0 lg:justify-self-end lg:self-center lg:max-w-[19rem] xl:max-w-[21rem]"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="absolute inset-6 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-gray-800/80 bg-white/5 p-4 shadow-2xl shadow-violet-950/30 backdrop-blur-sm">
            <div className="h-40 w-40 overflow-hidden rounded-full border border-white/10 ring-1 ring-violet-400/20 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-[15rem] lg:w-[15rem] xl:h-[17rem] xl:w-[17rem]">
              <img
                src="https://github.com/PabloMur.png"
                alt="Pablo Murillo"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background blobs */}
      <div className="absolute top-1/3 -left-20 w-64 md:w-125 h-64 md:h-125 bg-violet-600 rounded-full opacity-20 blur-[120px]" />
      <div className="absolute -bottom-20 right-0 w-80 md:w-150 h-52 md:h-100 bg-violet-600 rounded-full opacity-20 blur-[120px]" />
    </section>
  );
}
