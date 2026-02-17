import { AiOutlineGithub, AiFillLinkedin } from "react-icons/ai";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950 px-6 md:px-12 lg:px-20">
      <div className="z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-20 mx-auto">
        {/* Textos */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in-up">
            Full Stack
          </h1>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-indigo-400 leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Developer
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-md animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            Crafting digital experiences,
            <br />
            one line of code at a time.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4 mt-6 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <a
              href="https://github.com/PabloMur"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <AiOutlineGithub className="text-4xl md:text-5xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/pablo-nicolas-murillo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <AiFillLinkedin className="text-4xl md:text-5xl" />
            </a>
          </div>
        </div>

        {/* Foto */}
        <div className="w-52 h-52 md:w-72 md:h-72 lg:w-90 lg:h-90 rounded-full border-2 border-gray-700 overflow-hidden shrink-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <img src="https://github.com/PabloMur.png" alt="Pablo Murillo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Círculo superior izquierdo */}
      <div
        className="
          absolute
          top-1/3
          -left-20
          w-64 md:w-125
          h-64 md:h-125
          bg-indigo-600
          rounded-full
          opacity-30
          blur-[120px]
        "
      />

      {/* Círculo inferior derecho */}
      <div
        className="
          absolute
          -bottom-20
          right-0
          w-80 md:w-150
          h-52 md:h-100
          bg-violet-500
          rounded-full
          opacity-25
          blur-[120px]
        "
      />
    </div>
  );
}
