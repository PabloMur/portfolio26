import { AiOutlineLink } from "react-icons/ai";

const areas = [
  {
    title: "Frontend",
    description: "Development of interactive and attractive interfaces with HTML, CSS, and JavaScript. Utilization of frameworks like React.js and Next.js to expedite development.",
  },
  {
    title: "Backend",
    description: "Creation of scalable applications with Node.js and Express.js. Working with databases such as PostgreSQL and Firebase.",
  },
  {
    title: "Project Management",
    description: "Use of Git and GitHub for version control and team collaboration. Implementation of agile methodologies like Scrum for efficient project management.",
  },
];

export default function Education() {
  return (
    <div className="relative min-h-screen bg-gray-950 px-6 md:px-12 lg:px-20 py-16 overflow-hidden">
      <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
        Learning path
      </p>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        My Education
      </h1>
      <p className="text-gray-400 text-base md:text-lg mb-12 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        During my training as a developer, I gained knowledge in various areas:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        {areas.map((area) => (
          <div
            key={area.title}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all"
          >
            <h3 className="text-white font-semibold text-lg mb-3">{area.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{area.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 max-w-xl animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <p className="text-gray-400 text-base md:text-lg mb-4">
          I completed the <span className="text-white font-semibold">Full Stack Software Developer</span> program at APX.
        </p>
        <a
          href="https://apx.school/profiles/06df1c36-ef26-47e2-bd68-c12987bd4ad0/web-2"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
        >
          <AiOutlineLink className="text-lg" />
          View Graduation Certificate
        </a>
      </div>

      {/* Círculo decorativo */}
      <div
        className="
          absolute
          top-1/4
          -right-20
          w-64 md:w-125
          h-64 md:h-125
          bg-indigo-600
          rounded-full
          opacity-20
          blur-[120px]
        "
      />
    </div>
  );
}
