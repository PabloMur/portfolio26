import { Link } from "react-router-dom";
import logo from "/Group 34.png";

interface LogoProps {
    textClassName?: string;
}

export default function Logo({ textClassName = "text-gray-800" }: LogoProps) {
    return (
        <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="PM Logo" className="h-12 w-12 sm:h-14 sm:w-14" />
            <span className={`text-lg font-semibold tracking-tight sm:text-xl ${textClassName}`}>Pablo Murillo</span>
        </Link>
    );
}
