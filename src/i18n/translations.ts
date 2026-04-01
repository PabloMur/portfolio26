export type Language = "en" | "es";

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      education: "Education",
      stack: "Stack",
      projects: "Projects",
      services: "Services",
      contact: "Contact",
    },
    home: {
      label: "Full Stack Developer · React · Node.js · AI Integrations",
      title1: "Building web products",
      title2: "with modern full stack and AI tools.",
      subtitle:
        "Full Stack Developer focused on building responsive interfaces, scalable backend features, and practical AI-powered experiences with clear product thinking.",
      ctaPrimary: "Contact me",
      ctaSecondary: "View projects",
      stats: [
        { value: "15+", label: "Projects built" },
        { value: "3+", label: "Years learning and building" },
        { value: "FS", label: "Frontend + Backend focus" },
      ],
    },
    about: {
      label: "Profile",
      title: "I build software with a strong focus on",
      titleAccent: "clarity, usability, and execution.",
      p1: "I'm a Full Stack Developer with experience building interfaces, backend features, integrations, and end-to-end web experiences using JavaScript, TypeScript, React, Node.js, and modern tooling.",
      p2: "I enjoy turning requirements into clean, functional products, paying attention to both the technical implementation and the user experience.",
      p3: "I'm especially interested in product-minded development, AI integrations, and building solutions that are practical, maintainable, and easy to understand.",
      differentiators: [
        {
          title: "Product mindset",
          description: "I think about the user, the goal, and the implementation together.",
        },
        {
          title: "Full stack profile",
          description: "Comfortable moving across frontend, backend, and integrations.",
        },
        {
          title: "Clear communication",
          description: "I value readable code, shared context, and reliable execution.",
        },
      ],
      ctaText: "Get in touch",
    },
    education: {
      label: "Learning path",
      title: "My Education",
      subtitle: "During my training as a developer, I gained knowledge in various areas:",
      areas: [
        {
          title: "Frontend",
          description:
            "Development of interactive and attractive interfaces with HTML, CSS, and JavaScript. Utilization of frameworks like React.js and Next.js to expedite development.",
        },
        {
          title: "Backend",
          description:
            "Creation of scalable applications with Node.js and Express.js. Working with databases such as PostgreSQL and Firebase.",
        },
        {
          title: "Project Management",
          description:
            "Use of Git and GitHub for version control and team collaboration. Implementation of agile methodologies like Scrum for efficient project management.",
        },
      ],
      courseText: "I completed the",
      courseName: "Full Stack Software Developer",
      courseAt: "program at APX.",
      certButton: "View Graduation Certificate",
    },
    stack: {
      label: "Technologies",
      title: "My Stack",
      subtitle: "This is the stack that I'm currently using",
    },
    projects: {
      label: "Portfolio",
      title: "My Projects",
    },
    services: {
      label: "Capabilities",
      title: "What I Build",
      subtitle:
        "A summary of the kinds of solutions and technical work I enjoy building across frontend, backend, and AI-assisted experiences.",
      includesLabel: "Includes",
      resultLabel: "Focus",
      items: [
        {
          tag: "Frontend",
          title: "Web Interfaces",
          description:
            "Responsive, user-focused interfaces built with modern frontend tools, with attention to structure, usability, and visual consistency.",
          includes: [
            "React and component-based architecture",
            "Responsive layouts",
            "Clean UI structure",
            "Reusable frontend patterns",
          ],
          benefit: "Readable, maintainable frontend development",
          price: "React · TypeScript",
        },
        {
          tag: "AI Integration",
          title: "AI-Powered Features",
          description:
            "Practical AI features integrated into web products, such as assistants, workflow support, and contextual user interactions.",
          includes: [
            "Chat and assistant experiences",
            "API-based integrations",
            "Prompt and response handling",
            "User-facing AI workflows",
          ],
          benefit: "Useful AI features grounded in product needs",
          price: "LLM APIs · UX",
        },
        {
          tag: "Backend",
          title: "Systems and Integrations",
          description:
            "Backend logic, integrations, and full stack flows that connect data, interfaces, and business logic into complete web applications.",
          includes: [
            "Node.js services",
            "Database and API integration",
            "CRUD and business logic",
            "End-to-end application flow",
          ],
          benefit: "Functional full stack delivery from UI to data layer",
          price: "Node.js · APIs",
        },
      ],
      packagesTitle: "Core Strengths",
      packagesSubtitle: "Technologies and working areas I feel most comfortable with.",
      packages: [
        { emoji: "⚛️", name: "Frontend", desc: "React, component architecture, routing, and responsive UI.", price: "React", days: "UI focus" },
        { emoji: "🧩", name: "Backend", desc: "Node.js, APIs, integrations, and application logic.", price: "Node.js", days: "Server focus" },
        { emoji: "🤖", name: "AI Features", desc: "LLM integrations and conversational product experiences.", price: "AI APIs", days: "Feature focus" },
        { emoji: "🛠️", name: "Workflow", desc: "Version control, iteration, and practical product execution.", price: "Git", days: "Team focus" },
      ],
      ctaTitle: "Interested in my profile?",
      ctaSubtitle:
        "If you'd like to know more about my experience, projects, or technical interests, feel free to reach out.",
      ctaButton: "Contact",
    },
    contact: {
      label: "Get in touch",
      title: "Contact",
      linkedinText: "Here is my LinkedIn profile:",
      emailText: "And you can contact me by email also:",
    },
  },

  es: {
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      education: "Educación",
      stack: "Stack",
      projects: "Proyectos",
      services: "Servicios",
      contact: "Contacto",
    },
    home: {
      label: "Full Stack Developer · React · Node.js · Integraciones con IA",
      title1: "Construyendo productos web",
      title2: "con herramientas modernas full stack e IA.",
      subtitle:
        "Desarrollador Full Stack enfocado en crear interfaces responsivas, features backend escalables y experiencias con IA aplicadas con criterio de producto.",
      ctaPrimary: "Contactame",
      ctaSecondary: "Ver proyectos",
      stats: [
        { value: "15+", label: "Proyectos desarrollados" },
        { value: "3+", label: "Años aprendiendo y construyendo" },
        { value: "FS", label: "Enfoque frontend + backend" },
      ],
    },
    about: {
      label: "Perfil",
      title: "Desarrollo software con foco en",
      titleAccent: "claridad, usabilidad y ejecución.",
      p1: "Soy Full Stack Developer con experiencia construyendo interfaces, features backend, integraciones y experiencias web end-to-end usando JavaScript, TypeScript, React, Node.js y tooling moderno.",
      p2: "Me interesa convertir requerimientos en productos funcionales y claros, cuidando tanto la implementación técnica como la experiencia de usuario.",
      p3: "Me atrae especialmente el desarrollo con criterio de producto, las integraciones con IA y la construcción de soluciones prácticas, mantenibles y fáciles de entender.",
      differentiators: [
        {
          title: "Mentalidad de producto",
          description: "Pienso en el usuario, el objetivo y la implementación en conjunto.",
        },
        {
          title: "Perfil full stack",
          description: "Me muevo con comodidad entre frontend, backend e integraciones.",
        },
        {
          title: "Comunicación clara",
          description: "Valoro el código legible, el contexto compartido y la ejecución prolija.",
        },
      ],
      ctaText: "Contactame",
    },
    education: {
      label: "Camino de aprendizaje",
      title: "Mi Educación",
      subtitle: "Durante mi formación como desarrollador, adquirí conocimientos en diversas áreas:",
      areas: [
        {
          title: "Frontend",
          description:
            "Desarrollo de interfaces interactivas y atractivas con HTML, CSS y JavaScript. Uso de frameworks como React.js y Next.js para acelerar el desarrollo.",
        },
        {
          title: "Backend",
          description:
            "Creación de aplicaciones escalables con Node.js y Express.js. Trabajo con bases de datos como PostgreSQL y Firebase.",
        },
        {
          title: "Gestión de proyectos",
          description:
            "Uso de Git y GitHub para control de versiones y colaboración en equipo. Implementación de metodologías ágiles como Scrum para una gestión eficiente.",
        },
      ],
      courseText: "Completé el programa de",
      courseName: "Desarrollador de Software Full Stack",
      courseAt: "en APX.",
      certButton: "Ver Certificado de Graduación",
    },
    stack: {
      label: "Tecnologías",
      title: "Mi Stack",
      subtitle: "Este es el stack que estoy usando actualmente",
    },
    projects: {
      label: "Portfolio",
      title: "Mis Proyectos",
    },
    services: {
      label: "Capacidades",
      title: "Qué Construyo",
      subtitle:
        "Un resumen del tipo de soluciones y trabajo técnico que disfruto desarrollar en frontend, backend y experiencias asistidas por IA.",
      includesLabel: "Incluye",
      resultLabel: "Enfoque",
      items: [
        {
          tag: "Frontend",
          title: "Interfaces Web",
          description:
            "Interfaces responsivas y centradas en el usuario, construidas con herramientas frontend modernas y atención a la estructura, la usabilidad y la consistencia visual.",
          includes: [
            "React y arquitectura basada en componentes",
            "Layouts responsivos",
            "Estructura de UI clara",
            "Patrones reutilizables de frontend",
          ],
          benefit: "Desarrollo frontend legible y mantenible",
          price: "React · TypeScript",
        },
        {
          tag: "Integración IA",
          title: "Features con IA",
          description:
            "Features de IA aplicadas a productos web, como asistentes, soporte a workflows e interacciones contextuales orientadas al usuario.",
          includes: [
            "Experiencias de chat y asistentes",
            "Integraciones vía API",
            "Manejo de prompts y respuestas",
            "Workflows de IA orientados al usuario",
          ],
          benefit: "Features de IA útiles y alineadas con producto",
          price: "LLM APIs · UX",
        },
        {
          tag: "Backend",
          title: "Sistemas e Integraciones",
          description:
            "Lógica backend, integraciones y flujos full stack que conectan datos, interfaces y reglas de negocio dentro de aplicaciones web completas.",
          includes: [
            "Servicios en Node.js",
            "Integración con APIs y bases de datos",
            "CRUD y lógica de negocio",
            "Flujos end-to-end de aplicación",
          ],
          benefit: "Entrega full stack funcional desde UI hasta datos",
          price: "Node.js · APIs",
        },
      ],
      packagesTitle: "Fortalezas principales",
      packagesSubtitle: "Tecnologías y áreas de trabajo en las que me siento más cómodo.",
      packages: [
        { emoji: "⚛️", name: "Frontend", desc: "React, arquitectura de componentes, routing e interfaces responsivas.", price: "React", days: "Foco UI" },
        { emoji: "🧩", name: "Backend", desc: "Node.js, APIs, integraciones y lógica de aplicación.", price: "Node.js", days: "Foco server" },
        { emoji: "🤖", name: "IA", desc: "Integraciones con LLMs y experiencias conversacionales dentro de producto.", price: "AI APIs", days: "Foco feature" },
        { emoji: "🛠️", name: "Workflow", desc: "Versionado, iteración y ejecución práctica orientada a producto.", price: "Git", days: "Foco equipo" },
      ],
      ctaTitle: "¿Te interesa mi perfil?",
      ctaSubtitle:
        "Si querés saber más sobre mi experiencia, proyectos o intereses técnicos, podés escribirme.",
      ctaButton: "Contacto",
    },
    contact: {
      label: "Contáctame",
      title: "Contacto",
      linkedinText: "Acá está mi perfil de LinkedIn:",
      emailText: "También podés contactarme por email:",
    },
  },
} as const;
