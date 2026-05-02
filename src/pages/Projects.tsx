import { useState, useEffect, useCallback } from "react";
import ProjectCard from "../components/ui/ProjectCard";
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineLoading3Quarters,
  AiOutlineClose,
  AiOutlineGithub,
  AiOutlineLink,
  AiFillStar,
} from "react-icons/ai";
import { fetchProjects, type AirtableProject } from "../services/airtable";
import { useLanguage } from "../context/LanguageContext";

const PER_PAGE = 6;

export default function Projects() {
  const { t, lang } = useLanguage();
  const [projects, setProjects] = useState<AirtableProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selected = selectedIdx !== null ? projects[selectedIdx] : null;

  const closeModal = useCallback(() => setSelectedIdx(null), []);
  const goPrev = useCallback(() => {
    setSlideDir("left");
    setSelectedIdx((i) => (i !== null && i > 0 ? i - 1 : i));
  }, []);
  const goNext = useCallback(() => {
    setSlideDir("right");
    setSelectedIdx((i) => (i !== null && i < projects.length - 1 ? i + 1 : i));
  }, [projects.length]);

  useEffect(() => {
    if (selectedIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIdx, closeModal, goPrev, goNext]);

  const totalPages = Math.ceil(projects.length / PER_PAGE);
  const current = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const getDescription = (project: AirtableProject) =>
    lang === "en" && project.descriptionEn ? project.descriptionEn : project.description;

  return (
    <div className="min-h-screen bg-gray-950 py-16 px-6 sm:px-8 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-1">

        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-3">
            {t.projects.label}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {t.projects.title}
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <AiOutlineLoading3Quarters className="text-4xl text-violet-400 animate-spin" />
            </div>
          )}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {current.map((project) => (
                <ProjectCard
                  key={project.id}
                  image={project.image}
                  title={project.title}
                  description={getDescription(project)}
                  githubUrl={project.githubUrl}
                  deployUrl={project.deployUrl}
                  featured={project.featured}
                  onClick={() => setSelectedIdx(projects.indexOf(project))}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div
            className="flex items-center justify-center gap-3 pt-12 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <AiOutlineLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  page === i
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages - 1}
              className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <AiOutlineRight />
            </button>
          </div>
        )}
      </div>

      {/* Project modal */}
      {selected && selectedIdx !== null && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image hero */}
            <div
              key={`img-${selectedIdx}`}
              className={`relative shrink-0 h-64 sm:h-96 overflow-hidden bg-gray-800 ${slideDir === "right" ? "animate-slide-from-right" : "animate-slide-from-left"}`}
            >
              {selected.image ? (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-gray-600 text-sm">Sin imagen</span>
                </div>
              )}

              {/* Gradient overlay — title lives here */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

              {/* Featured badge */}
              {selected.featured && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-violet-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <AiFillStar size={11} />
                  Destacado
                </div>
              )}

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-colors"
              >
                <AiOutlineClose size={18} />
              </button>

              {/* Title on image */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
                <h2 className="text-white text-2xl font-bold leading-tight drop-shadow-lg">
                  {selected.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div
              key={`desc-${selectedIdx}`}
              className={`flex-1 overflow-y-auto px-6 py-5 ${slideDir === "right" ? "animate-slide-from-right" : "animate-slide-from-left"}`}
            >
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {getDescription(selected)}
              </p>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-4 border-t border-gray-800 flex items-center justify-between gap-4">
              {/* Links */}
              <div className="flex gap-2">
                {selected.githubUrl && (
                  <a
                    href={selected.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <AiOutlineGithub size={16} />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                )}
                {selected.deployUrl && (
                  <a
                    href={selected.deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
                  >
                    <AiOutlineLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={goPrev}
                  disabled={selectedIdx === 0}
                  className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <AiOutlineLeft size={16} />
                </button>
                <span className="text-gray-500 text-xs font-mono w-12 text-center">
                  {selectedIdx + 1} / {projects.length}
                </span>
                <button
                  onClick={goNext}
                  disabled={selectedIdx === projects.length - 1}
                  className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <AiOutlineRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
