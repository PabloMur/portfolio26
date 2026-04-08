import StackCard from "../components/ui/StackCard";
import { useLanguage } from "../context/LanguageContext";
import {
    SiJavascript, SiTypescript, SiHtml5, SiCss3,
    SiReact, SiNextdotjs, SiGit, SiGithub,
    SiNodedotjs, SiFirebase, SiTailwindcss,
    SiVercel, SiPostman, SiHeroku
} from "react-icons/si";

const stack = [
    { icon: <SiJavascript className="text-yellow-400" />, title: "JavaScript" },
    { icon: <SiTypescript className="text-blue-500" />, title: "TypeScript" },
    { icon: <SiHtml5 className="text-orange-500" />, title: "HTML5" },
    { icon: <SiCss3 className="text-blue-400" />, title: "CSS3" },
    { icon: <SiReact className="text-cyan-400" />, title: "ReactJS" },
    { icon: <SiNextdotjs className="text-white" />, title: "NextJS" },
    { icon: <SiGit className="text-red-500" />, title: "Git" },
    { icon: <SiGithub className="text-white" />, title: "GitHub" },
    { icon: <SiNodedotjs className="text-green-500" />, title: "NodeJS" },
    { icon: <SiFirebase className="text-amber-400" />, title: "Firebase" },
    { icon: <SiTailwindcss className="text-teal-400" />, title: "Tailwind" },
    { icon: <SiVercel className="text-white" />, title: "Vercel" },
    { icon: <SiPostman className="text-orange-400" />, title: "Postman" },
    { icon: <SiHeroku className="text-violet-500" />, title: "Heroku" },
];

export default function Stack() {
    const { t } = useLanguage();

    return (
        <div className="relative min-h-screen bg-gray-950 overflow-hidden py-16 px-6 sm:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-14 animate-fade-in-up">
                    <p className="text-violet-400 font-mono text-xs tracking-widest uppercase mb-3">
                        {t.stack.label}
                    </p>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {t.stack.title}
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg max-w-2xl">
                        {t.stack.subtitle}
                    </p>
                </div>

                {/* Grid */}
                <div
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    {stack.map((item) => (
                        <StackCard key={item.title} icon={item.icon} title={item.title} />
                    ))}
                </div>
            </div>

            <div className="absolute -bottom-20 left-1/3 w-80 md:w-150 h-52 md:h-100 bg-violet-600 rounded-full opacity-20 blur-[120px] pointer-events-none" />
        </div>
    );
}
