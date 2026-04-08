import { useState, useEffect } from "react";
import ProjectCard from "../components/ui/ProjectCard";
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineLoading3Quarters,
  AiOutlineClose,
  AiOutlineGithub,
  AiOutlineLink,
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
  const [selected, setSelected] = useState<AirtableProject | null>(null);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
                  onClick={() => setSelected(project)}
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
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            {selected.image && (
              <div className="h-56 overflow-hidden">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-white text-xl font-bold leading-tight">{selected.title}</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-500 hover:text-white transition-colors shrink-0"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {getDescription(selected)}
              </p>

              <div className="flex gap-3">
                {selected.githubUrl && (
                  <a
                    href={selected.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <AiOutlineGithub size={16} />
                    GitHub
                  </a>
                )}
                {selected.deployUrl && (
                  <a
                    href={selected.deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
                  >
                    <AiOutlineLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
