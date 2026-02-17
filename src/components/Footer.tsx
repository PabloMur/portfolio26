export const Footer = () => {
    return (
        <footer className="bg-gray-950 border-t border-gray-800 py-6 px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
                <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Pablo Murillo. All rights reserved.
                </p>
                <div className="flex gap-6">
                    <a href="https://github.com/PabloMur" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-400 transition-colors text-sm">
                        GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/pablo-nicolas-murillo/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-400 transition-colors text-sm">
                        LinkedIn
                    </a>
                    <a href="mailto:pablomurillo.sp@gmail.com" className="text-gray-500 hover:text-indigo-400 transition-colors text-sm">
                        Email
                    </a>
                </div>
            </div>
        </footer>
    )
}