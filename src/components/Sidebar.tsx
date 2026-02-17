import { useState } from "react";
import Logo from "./Logo";
import NavLink from "./ui/NavLink";
import { AiOutlineHome, AiOutlineUser, AiOutlineCode, AiOutlineProject, AiOutlineMail, AiOutlineRead, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export const Sidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-amber-50 text-gray-800 lg:hidden"
            >
                <AiOutlineMenu className="text-2xl" />
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full z-50 w-70 bg-amber-50 flex flex-col justify-start items-center
                transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:static lg:z-auto lg:min-h-screen
            `}>
                <div className="flex items-center justify-between w-full px-4">
                    <Logo />
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 text-gray-600 lg:hidden"
                    >
                        <AiOutlineClose className="text-xl" />
                    </button>
                </div>
                <nav className="flex flex-col w-full gap-2 px-4" onClick={() => setOpen(false)}>
                    <NavLink label="Home" to="/" icon={<AiOutlineHome />} />
                    <NavLink label="About" to="/about" icon={<AiOutlineUser />} />
                    <NavLink label="Education" to="/education" icon={<AiOutlineRead />} />
                    <NavLink label="Stack" to="/stack" icon={<AiOutlineCode />} />
                    <NavLink label="Projects" to="/projects" icon={<AiOutlineProject />} />
                    <NavLink label="Contact" to="/contact" icon={<AiOutlineMail />} />
                </nav>
            </div>
        </>
    );
};
