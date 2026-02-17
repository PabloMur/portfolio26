export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
          About Me
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Driven by curiosity, <br />
          <span className="text-indigo-400">built through code.</span>
        </h1>
        <div className="flex flex-col gap-5 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            I'm a passionate and proactive full stack developer with a deep curiosity for how things work under the hood. I thrive on learning new technologies and tackling challenges that push me to grow.
          </p>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            My approach to problem-solving is creative and versatile — I enjoy breaking down complex problems and finding innovative solutions from different angles. Whether working independently or as part of a team, I bring commitment, responsibility, and a drive to deliver quality work.
          </p>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            I believe great software comes from continuous improvement — in both the code and the developer writing it.
          </p>
        </div>
      </div>
    </div>
  );
}
