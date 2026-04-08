import { NavLink } from "react-router-dom";
import {
  AiOutlineProject,
  AiOutlineUnorderedList,
  AiOutlineBulb,
  AiOutlineCode,
  AiOutlineFileText,
  AiOutlineLayout,
} from "react-icons/ai";

const MODULES = [
  { to: "/dashboard/projects", label: "Proyectos", description: "Gestión de proyectos del portfolio", icon: <AiOutlineProject size={22} /> },
  { to: "/dashboard/kanban", label: "Kanban", description: "Tablero de tareas y estado", icon: <AiOutlineUnorderedList size={22} /> },
  { to: "/dashboard/ideas", label: "Ideas", description: "Biblioteca de ideas", icon: <AiOutlineBulb size={22} /> },
  { to: "/dashboard/prompts", label: "Prompts", description: "Biblioteca de prompts", icon: <AiOutlineCode size={22} /> },
  { to: "/dashboard/docs", label: "Docs", description: "Documentaciones", icon: <AiOutlineFileText size={22} /> },
  { to: "/dashboard/portfolio", label: "Portfolio", description: "Gestión de contenido del portfolio", icon: <AiOutlineLayout size={22} /> },
];

export default function Overview() {
  return (
    <div className="p-8">
      <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-2">Panel principal</p>
      <h1 className="text-2xl font-bold text-white mb-8">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-indigo-600 transition-colors"
          >
            <div className="text-violet-400 mb-3 group-hover:text-indigo-400 transition-colors">
              {m.icon}
            </div>
            <p className="text-white font-medium text-sm mb-1">{m.label}</p>
            <p className="text-gray-500 text-xs">{m.description}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
