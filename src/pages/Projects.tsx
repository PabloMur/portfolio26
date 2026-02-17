import { useState } from "react";
import ProjectCard from "../components/ui/ProjectCard";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const projects = [
  {
    image: "https://placehold.co/600x400/1e1b4b/818cf8?text=E-Commerce",
    title: "E-Commerce Platform",
    description: "A full-featured online store built with React and Node.js, featuring cart management, payment integration, and an admin dashboard.",
    githubUrl: "https://github.com",
    deployUrl: "https://example.com",
  },
  {
    image: "https://placehold.co/600x400/1e1b4b/818cf8?text=Task+Manager",
    title: "Task Manager App",
    description: "A productivity tool for managing tasks with drag-and-drop boards, real-time collaboration, and deadline tracking.",
    githubUrl: "https://github.com",
    deployUrl: "https://example.com",
  },
  {
    image: "https://placehold.co/600x400/1e1b4b/818cf8?text=Chat+App",
    title: "Real-Time Chat",
    description: "A messaging application with WebSocket support, group chats, file sharing, and end-to-end encryption.",
    githubUrl: "https://github.com",
    deployUrl: "https://example.com",
  },
  {
    image: "https://placehold.co/600x400/1e1b4b/818cf8?text=Portfolio+v1",
    title: "Portfolio v1",
    description: "My previous personal portfolio built with vanilla HTML, CSS, and JavaScript with smooth scroll animations.",
    githubUrl: "https://github.com",
    deployUrl: "https://example.com",
  },
  {
    image: "https://placehold.co/600x400/1e1b4b/818cf8?text=Weather+App",
    title: "Weather Dashboard",
    description: "A weather forecast app using OpenWeather API with location search, 7-day forecasts, and interactive maps.",
    githubUrl: "https://github.com",
    deployUrl: "https://example.com",
  },
  {
    image: "https://placehold.co/600x400/1e1b4b/818cf8?text=Blog+CMS",
    title: "Blog CMS",
    description: "A content management system for blogs with markdown support, image uploads, and SEO optimization tools.",
    githubUrl: "https://github.com",
    deployUrl: "https://example.com",
  },
];

const PER_PAGE = 3;

export default function Projects() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(projects.length / PER_PAGE);
  const current = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-950 px-6 md:px-12 lg:px-20 py-16 flex flex-col">
      <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
        Portfolio
      </p>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        My Projects
      </h1>

      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {current.map((project, index) => (
            <ProjectCard key={page * PER_PAGE + index} {...project} />
          ))}
        </div>
      </div>

      {/* Pagination */}
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
          <AiOutlineRight className="text-lg" />
        </button>
      </div>
    </div>
  );
}
