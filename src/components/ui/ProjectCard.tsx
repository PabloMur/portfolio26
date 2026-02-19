import { AiOutlineGithub, AiOutlineLink } from "react-icons/ai";

interface ProjectCardProps {
    image: string;
    title: string;
    description: string;
    githubUrl: string;
    deployUrl: string;
}

export default function ProjectCard({ image, title, description, githubUrl, deployUrl }: ProjectCardProps) {
    return (
        <div className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col">
            <div className="h-28 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-3 flex flex-col gap-2 flex-1">
                <h3 className="text-white font-semibold text-base">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
                <div className="flex gap-3 mt-auto">
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        <AiOutlineGithub className="text-base" />
                        GitHub
                    </a>
                    <a
                        href={deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors"
                    >
                        <AiOutlineLink className="text-base" />
                        Live Demo
                    </a>
                </div>
            </div>
        </div>
    );
}
