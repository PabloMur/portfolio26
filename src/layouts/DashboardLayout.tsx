import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AiOutlineDashboard,
  AiOutlineProject,
  AiOutlineUnorderedList,
  AiOutlineBulb,
  AiOutlineCode,
  AiOutlineFileText,
  AiOutlineLogout,
  AiOutlineLayout,
  AiOutlineBarChart,
  AiOutlineMessage,
  AiOutlineHeatMap,
  AiOutlineFilePdf,
  AiOutlineSafetyCertificate,
  AiOutlineMenu,
} from "react-icons/ai";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: <AiOutlineDashboard size={18} />, end: true },
  { to: "/dashboard/analytics", label: "Analytics", icon: <AiOutlineBarChart size={18} /> },
  { to: "/dashboard/conversations", label: "Conversaciones", icon: <AiOutlineMessage size={18} /> },
  { to: "/dashboard/heatmap", label: "Heatmap", icon: <AiOutlineHeatMap size={18} /> },
  { to: "/dashboard/cv", label: "CV", icon: <AiOutlineFilePdf size={18} /> },
  { to: "/dashboard/certificates", label: "Certificados", icon: <AiOutlineSafetyCertificate size={18} /> },
  { to: "/dashboard/projects", label: "Proyectos", icon: <AiOutlineProject size={18} /> },
  { to: "/dashboard/kanban", label: "Kanban", icon: <AiOutlineUnorderedList size={18} /> },
  { to: "/dashboard/ideas", label: "Ideas", icon: <AiOutlineBulb size={18} /> },
  { to: "/dashboard/prompts", label: "Prompts", icon: <AiOutlineCode size={18} /> },
  { to: "/dashboard/docs", label: "Docs", icon: <AiOutlineFileText size={18} /> },
  { to: "/dashboard/portfolio", label: "Portfolio", icon: <AiOutlineLayout size={18} /> },
];

function SidebarNav({
  user,
  onNavigate,
  onLogoutClick,
}: {
  user: { email?: string | null } | null;
  onNavigate?: () => void;
  onLogoutClick: () => void;
}) {
  return (
    <>
      <div className="px-5 py-5 border-b border-gray-800">
        <p className="text-xs text-violet-400 font-mono tracking-widest uppercase">Dashboard</p>
        <p className="text-xs text-gray-600 mt-0.5 truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={onLogoutClick}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors w-full"
        >
          <AiOutlineLogout size={18} />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 border-r border-gray-800 flex-col shrink-0">
        <SidebarNav user={user} onLogoutClick={() => setShowConfirm(true)} />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-gray-950 border-r border-gray-800 flex flex-col z-50">
            <SidebarNav
              user={user}
              onNavigate={() => setMobileOpen(false)}
              onLogoutClick={() => {
                setMobileOpen(false);
                setShowConfirm(true);
              }}
            />
          </aside>
        </div>
      )}

      {/* Content column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <AiOutlineMenu size={20} />
          </button>
          <p className="text-xs text-violet-400 font-mono tracking-widest uppercase">Dashboard</p>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-xs shadow-2xl">
            <h2 className="text-white font-semibold text-base mb-1">Cerrar sesión</h2>
            <p className="text-gray-400 text-sm mb-6">¿Seguro que querés salir?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl text-sm text-white bg-red-600 hover:bg-red-500 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
