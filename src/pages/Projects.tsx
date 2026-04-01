import { useState, useEffect } from "react";
import ProjectCard from "../components/ui/ProjectCard";
import { AiOutlineLeft, AiOutlineRight, AiOutlineLoading3Quarters } from "react-icons/ai";
import { fetchProjects, type AirtableProject } from "../services/airtable";
import { useLanguage } from "../context/LanguageContext";

const PER_PAGE = 3;

export default function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<AirtableProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        console.log(data); // 👈 mirar esto
        setProjects(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(projects.length / PER_PAGE);
  const current = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-950 px-6 md:px-12 lg:px-20 py-16 flex flex-col">
      <p className="text-violet-400 font-mono text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
        {t.projects.label}
      </p>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        {t.projects.title}
      </h1>

      <div className="flex-1">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <AiOutlineLoading3Quarters className="text-4xl text-violet-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {current.map((project) => (
              <ProjectCard
                key={project.id}
                image={project.image}
                title={project.title}
                description={project.description}
                githubUrl={project.githubUrl}
                deployUrl={project.deployUrl}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-12 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <AiOutlineLeft className="text-lg" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i
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
            <AiOutlineRight className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
