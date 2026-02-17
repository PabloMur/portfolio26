import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface NavLinkProps {
    icon?: ReactNode;
    label: string;
    to: string;
}

export default function NavLink({ icon, label, to }: NavLinkProps) {
    const { pathname } = useLocation();
    const isActive = pathname === to;

    return (
        <Link
            to={to}
            className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 relative overflow-hidden
                ${isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
            `}
        >
            {icon && <span className={`text-2xl ${isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-500"} transition-colors`}>{icon}</span>}
            <span className="font-medium text-sm tracking-wide">{label}</span>
        </Link>
    );
}
