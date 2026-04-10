import { AiOutlineGithub, AiOutlineLink } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";

interface ProjectCardProps {
    image: string;
    title: string;
    description: string;
    githubUrl: string;
    deployUrl: string;
    featured?: boolean;
    onClick?: () => void;
}

export default function ProjectCard({ image, title, description, githubUrl, deployUrl, featured, onClick }: ProjectCardProps) {
    return (
        <div
            onClick={onClick}
            className={`group bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col cursor-pointer ${
                featured
                    ? "border-violet-500/60 hover:border-violet-400 hover:shadow-violet-500/20"
                    : "border-gray-800 hover:border-violet-500/50 hover:shadow-violet-500/10"
            }`}
        >
            <div className="h-28 overflow-hidden relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {featured && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 bg-violet-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <AiFillStar size={10} />
                        Destacado
                    </span>
                )}
            </div>
            <div className="p-3 flex flex-col gap-2 flex-1">
                <h3 className="text-white font-semibold text-base">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{description}</p>
                <div className="flex gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            <AiOutlineGithub className="text-base" />
                            GitHub
                        </a>
                    )}
                    {deployUrl && (
                        <a
                            href={deployUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors"
                        >
                            <AiOutlineLink className="text-base" />
                            Live Demo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
