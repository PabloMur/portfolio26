import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PulseBorderLink from "./ui/PulseBorderLink";
import Logo from "./Logo";
import {
    AiOutlineHome,
    AiOutlineUser,
    AiOutlineCode,
    AiOutlineProject,
    AiOutlineMail,
    AiOutlineRead,
    AiOutlineMenu,
    AiOutlineClose,
    AiOutlineShop,
} from "react-icons/ai";
import { useLanguage } from "../context/LanguageContext";

const navIcons = {
    "/": <AiOutlineHome />,
    "/about": <AiOutlineUser />,
    "/education": <AiOutlineRead />,
    "/stack": <AiOutlineCode />,
    "/projects": <AiOutlineProject />,
    "/services": <AiOutlineShop />,
    "/contact": <AiOutlineMail />,
} as const;

export const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const { t, lang, toggleLang } = useLanguage();
    const { pathname } = useLocation();

    const links = [
        { to: "/", label: t.nav.home },
        { to: "/projects", label: t.nav.projects, highlight: true },
        { to: "/about", label: t.nav.about },
        { to: "/education", label: t.nav.education },
        { to: "/stack", label: t.nav.stack },
        { to: "/services", label: t.nav.services },
        { to: "/contact", label: t.nav.contact },
    ];

            return (
        <>
            <header className="sticky top-0 z-40 border-b border-gray-800/80 bg-gray-950/85 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
                    <Logo textClassName="text-white" />

                    <nav className="hidden items-center gap-3 lg:flex">
                        {links.map((link) => {
                            const active = pathname === link.to;

                            if (link.highlight) {
                                return (
                                    <PulseBorderLink key={link.to} to={link.to}>
                                        {link.label}
                                    </PulseBorderLink>
                                );
                            }

                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${active
                                        ? "bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/40"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleLang}
                            className="hidden items-center gap-1 rounded-lg border border-gray-700 bg-white/5 px-3 py-1.5 text-sm font-medium transition-colors hover:border-indigo-400/50 hover:bg-white/8 sm:flex"
                        >
                            <span className={lang === "en" ? "text-white font-semibold" : "text-gray-500"}>EN</span>
                            <span className="mx-0.5 text-gray-300">|</span>
                            <span className={lang === "es" ? "text-white font-semibold" : "text-gray-500"}>ES</span>
                        </button>

                        <button
                            onClick={() => setOpen(true)}
                            className="rounded-lg bg-white/5 p-2 text-white shadow-sm ring-1 ring-gray-700 transition-colors hover:bg-white/10 lg:hidden"
                            aria-label="Open navigation"
                        >
                            <AiOutlineMenu className="text-2xl" />
                        </button>
                    </div>
                </div>
            </header>

            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 z-50 flex h-full w-80 max-w-[85vw] flex-col border-l border-gray-800 bg-gray-950 p-5 shadow-2xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="mb-8 flex items-center justify-between gap-4">
                    <Logo textClassName="text-white" />
                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                        aria-label="Close navigation"
                    >
                        <AiOutlineClose className="text-xl" />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-2" onClick={() => setOpen(false)}>
                    {links.map((link) => {
                        const active = pathname === link.to;

                        if (link.highlight) {
                            return (
                                <PulseBorderLink key={link.to} to={link.to}>
                                    <span className="flex items-center gap-3">
                                        <span className="text-lg text-indigo-500">
                                            {navIcons[link.to as keyof typeof navIcons]}
                                        </span>
                                        {link.label}
                                    </span>
                                </PulseBorderLink>
                            );
                        }

                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/40"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className={`text-lg ${active ? "text-violet-300" : "text-violet-400"}`}>
                                    {navIcons[link.to as keyof typeof navIcons]}
                                </span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={toggleLang}
                    className="mt-6 flex items-center justify-center gap-1 rounded-xl border border-gray-700 bg-white/5 px-3 py-3 text-sm font-medium transition-colors hover:border-indigo-400/50 hover:bg-white/8"
                >
                    <span className={lang === "en" ? "text-white font-semibold" : "text-gray-500"}>EN</span>
                    <span className="mx-0.5 text-gray-300">|</span>
                    <span className={lang === "es" ? "text-white font-semibold" : "text-gray-500"}>ES</span>
                </button>
            </div>
        </>
    );
};
