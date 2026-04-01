import type { ReactNode } from "react";

interface StackCardProps {
    icon: ReactNode;
    title: string;
}

export default function StackCard({ icon, title }: StackCardProps) {
    return (
        <div className="flex flex-col items-center gap-3 p-5 bg-gray-900 border border-gray-800 rounded-2xl hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all">
            <div className="text-4xl">{icon}</div>
            <span className="text-white text-sm font-medium">{title}</span>
        </div>
    );
}
