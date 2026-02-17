import { Link } from "react-router-dom";
import logo from "/Group 34.png";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-3 py-4 px-2 mb-6">
            <img src={logo} alt="PM Logo" className="w-20 h-20" />
            <span className="text-xl font-semibold tracking-tight text-gray-800">Pablo Murillo</span>
        </Link>
    );
}