import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Download,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  outcome: string;
  stack: string[];
  size: "wide" | "standard";
  accent: string;
  image: string;
  fit: "cover" | "contain";
};

const projects: Project[] = [
  {
    id: "muskaan",
    number: "01",
    title: "Muskaan.ai",
    category: "Generative planning platform",
    description:
      "A full-stack residential architecture tool that turns plot dimensions into multiple 2D floor plans and navigable 3D concepts.",
    outcome: "10 layout options from one plot brief, with editable plans and export-ready views.",
    stack: ["Node.js", "Express", "Three.js", "Groq LLM", "JWT"],
    size: "wide",
    accent: "#62d9ff",
    image: "/images/muskaan-project.jpg",
    fit: "cover",
  },
  {
    id: "zeus",
    number: "02",
    title: "Zeus",
    category: "AI class companion",
    description:
      "A lecture companion that captures speech, structures the transcript, and turns it into clear exam-ready notes.",
    outcome: "Live speech-to-text, LLM note generation, persistent study history, and downloadable Markdown.",
    stack: ["Web Speech API", "Node.js", "Groq", "JavaScript"],
    size: "standard",
    accent: "#b4ff68",
    image: "/images/zeus-project.jpg",
    fit: "cover",
  },
  {
    id: "friday",
    number: "03",
    title: "Friday AI",
    category: "Voice assistant",
    description:
      "An interactive browser assistant that understands spoken prompts and responds through a focused conversational UI.",
    outcome: "Real-time voice commands, contextual responses, and smooth cross-platform interaction.",
    stack: ["Python", "JavaScript", "Speech Recognition", "CSS"],
    size: "standard",
    accent: "#a78bfa",
    image: "/images/friday-project.jpg",
    fit: "contain",
  },
  {
    id: "quiz",
    number: "04",
    title: "Code Quiz",
    category: "Interactive assessment",
    description:
      "A responsive programming quiz built for quick, distraction-free assessment with immediate scoring feedback.",
    outcome: "Dynamic question rendering, category selection, timers, and instant result calculation.",
    stack: ["HTML", "CSS", "JavaScript"],
    size: "wide",
    accent: "#ffc44d",
    image: "/images/quiz-project.jpg",
    fit: "cover",
  },
];

const skills = [
  "Python",
  "JavaScript",
  "Machine Learning",
  "Node.js",
  "REST APIs",
  "Natural Language Processing",
  "MySQL",
  "Three.js",
  "Git",
  "Predictive Analysis",
];

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 38 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.85, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 500, damping: 36, mass: 0.3 });
  const smoothY = useSpring(y, { stiffness: 500, damping: 36, mass: 0.3 });
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest("a, button, [data-cursor='active']")));
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        className="cursor-ring"
        style={{ x: smoothX, y: smoothY }}
        animate={{ opacity: visible ? 1 : 0, scale: active ? 1.65 : 1 }}
        transition={{ scale: { duration: 0.2 }, opacity: { duration: 0.15 } }}
      />
      <motion.div
        className="cursor-dot"
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: active ? 0 : 1 }}
      />
    </>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  return (
    <div className={`visual visual-photo-wrap ${project.fit}`}>
      <img className="visual-photo" src={project.image} alt={`${project.title} interface`} />
    </div>
  );
}

function ProjectTile({ project, index, onOpen }: { project: Project; index: number; onOpen: (project: Project) => void }) {
  const handleMove = (event: ReactMouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <motion.article
      className={`project-tile ${project.size}`}
      style={{ "--accent": project.accent } as CSSProperties}
      onMouseMove={handleMove}
      onClick={() => onOpen(project)}
      data-cursor="active"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen(project);
      }}
      initial={{ opacity: 0, y: 80, rotateX: 7 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease }}
      whileHover={{ y: -6 }}
    >
      <div className="tile-spotlight" />
      <div className="tile-topline">
        <span>{project.number}</span>
        <span>{project.category}</span>
      </div>
      <ProjectVisual project={project} />
      <div className="tile-copy">
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
        <span className="tile-open" aria-hidden="true"><ArrowUpRight size={19} /></span>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            className="project-modal"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.45, ease }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button className="modal-close" onClick={onClose} aria-label="Close project details"><X size={20} /></button>
            <span className="modal-index">PROJECT {project.number}</span>
            <h2 id="modal-title">{project.title}</h2>
            <img className="modal-shot" src={project.image} alt={`${project.title} preview`} />
            <p className="modal-lead">{project.description}</p>
            <div className="modal-divider" />
            <div className="modal-detail">
              <span>OUTCOME</span>
              <p>{project.outcome}</p>
            </div>
            <div className="modal-detail">
              <span>TOOLKIT</span>
              <p>{project.stack.join(" / ")}</p>
            </div>
            <a className="text-link" href="mailto:bhavishyayagik@gmail.com?subject=Project%20enquiry">
              Ask about this project <ArrowUpRight size={17} />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.13]);
  const heroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.35]);
  const heroCopyY = useTransform(heroProgress, [0, 1], [0, 140]);
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <Cursor />
      <motion.div className="scroll-progress" style={{ scaleX: progressScale }} />

      <header className="site-header">
        <a href="#top" className="wordmark" onClick={closeMenu} aria-label="Bhavishya Yagik home">
          <span className="wordmark-mark">BY</span>
          <span>BHAVISHYA YAGIK</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="mailto:bhavishyayagik@gmail.com" className="header-cta">
          Let's talk <ArrowUpRight size={15} />
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            aria-label="Mobile navigation"
          >
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#work" onClick={closeMenu}>Work</a>
            <a href="#skills" onClick={closeMenu}>Skills</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </motion.nav>
        )}
      </AnimatePresence>

      <main>
        <section className="hero" id="top" ref={heroRef}>
          <motion.div className="hero-image" style={{ scale: heroScale, opacity: heroOpacity }} />
          <div className="hero-vignette" />
          <motion.div className="hero-content" style={{ y: heroCopyY }}>
            <motion.p
              className="hero-kicker"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              AI ENGINEER / FULL-STACK BUILDER
            </motion.p>
            <h1 aria-label="Bhavishya Yagik">
              <span className="hero-line-mask"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: 0.12, ease }}>BHAVISHYA</motion.span></span>
              <span className="hero-line-mask"><motion.span className="outline-text" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.05, delay: 0.24, ease }}>YAGIK</motion.span></span>
            </h1>
            <motion.p
              className="hero-intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
            >
              I build intelligent digital products that turn complex technology into clear, useful experiences.
            </motion.p>
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <a href="#work" className="primary-button">Explore my work <ArrowDown size={17} /></a>
              <a href="/Bhavishya-Yagik-Resume.pdf" download="Bhavishya-Yagik-Resume.pdf" className="secondary-button">Download CV <Download size={16} /></a>
            </motion.div>
          </motion.div>
          <motion.div className="hero-scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }}>
            <span>SCROLL TO EXPLORE</span><i />
          </motion.div>
        </section>

        <section className="about section-pad" id="about">
          <div className="section-index">01 / ABOUT</div>
          <div className="about-grid">
            <Reveal className="about-portrait-wrap">
              <div className="portrait-frame">
                <img src="/images/bhavishya-portrait.jpg" alt="Bhavishya Yagik in a dark business suit" />
              </div>
              <span className="portrait-caption">GWALIOR, INDIA / 2025</span>
            </Reveal>
            <div className="about-copy">
              <Reveal>
                <p className="eyebrow">THE PERSON BEHIND THE SYSTEMS</p>
                <h2>Curious mind.<br />Practical <em>intelligence.</em></h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="about-lead">
                  I am a Computer Science student specializing in Artificial Intelligence, focused on building products where machine learning meets thoughtful web engineering.
                </p>
              </Reveal>
              <Reveal delay={0.25} className="about-note">
                <span>NOW</span>
                <p>Turning ideas into deployed AI experiences, from speech-aware study tools to generative architecture workflows.</p>
              </Reveal>
              <Reveal delay={0.32}>
                <a className="text-link" href="mailto:bhavishyayagik@gmail.com">Start a conversation <ArrowRight size={17} /></a>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="work section-pad" id="work">
          <div className="section-index">02 / SELECTED WORK</div>
          <div className="section-heading">
            <Reveal><h2>Ideas, made<br /><em>interactive.</em></h2></Reveal>
            <Reveal delay={0.15}><p>Selected experiments and products across AI, full-stack engineering, and interactive design. Click a tile to explore.</p></Reveal>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectTile key={project.id} project={project} index={index} onOpen={setSelectedProject} />
            ))}
          </div>
        </section>

        <section className="skills" id="skills">
          <div className="marquee" aria-hidden="true">
            <motion.div
              className="marquee-track"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              {[...skills, ...skills].map((skill, index) => <span key={`${skill}-${index}`}>{skill}<i /></span>)}
            </motion.div>
          </div>
          <div className="section-pad skills-inner">
            <div className="section-index">03 / CAPABILITIES</div>
            <div className="skills-layout">
              <Reveal>
                <h2>Built across the<br /><em>whole stack.</em></h2>
                <p>I combine model thinking with production-minded engineering, so an idea can travel all the way from dataset to interface.</p>
              </Reveal>
              <div className="skill-rows">
                {[
                  ["01", "AI & ML", "Model building, preprocessing, predictive analysis, NLP"],
                  ["02", "BACKEND", "Node.js, Express, REST APIs, JWT, MySQL"],
                  ["03", "FRONTEND", "JavaScript, responsive interfaces, Three.js, interaction"],
                  ["04", "DELIVERY", "Git, GitHub, Render, Netlify, Linux"],
                ].map(([number, title, copy], index) => (
                  <motion.div
                    className="skill-row"
                    key={title}
                    initial={{ opacity: 0, x: 35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.09, ease }}
                  >
                    <span>{number}</span><h3>{title}</h3><p>{copy}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="experience section-pad">
          <div className="section-index">04 / EXPERIENCE</div>
          <div className="experience-grid">
            <Reveal><h2>Learning by<br /><em>building.</em></h2></Reveal>
            <Reveal delay={0.15} className="experience-entry">
              <div className="entry-meta"><span>JUL - AUG 2025</span><span>GWALIOR / REMOTE</span></div>
              <h3>Machine Learning Intern</h3>
              <h4>Unified Mentor Pvt. Ltd.</h4>
              <p>Built and tested machine learning models across the full pipeline, from data preprocessing to predictive analysis, while collaborating in a production-minded team environment.</p>
              <div className="entry-line"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease }} /></div>
            </Reveal>
          </div>
        </section>

        <section className="contact section-pad" id="contact">
          <motion.div
            className="contact-orb"
            animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="section-index">05 / CONTACT</div>
          <Reveal className="contact-copy">
            <p>HAVE AN IDEA OR OPPORTUNITY?</p>
            <h2>Let's build something<br /><em>intelligent.</em></h2>
            <a href="mailto:bhavishyayagik@gmail.com" className="contact-email">bhavishyayagik@gmail.com <ArrowUpRight /></a>
          </Reveal>
          <div className="contact-footer">
            <span>OPEN TO AI & FULL-STACK ROLES</span>
            <div>
              <a href="https://www.linkedin.com/in/bhavishya-yagik-1a9378374" target="_blank" rel="noreferrer" aria-label="LinkedIn"><span className="social-monogram">IN</span></a>
              <a href="https://github.com/bhavishya-ai-crypto" target="_blank" rel="noreferrer" aria-label="GitHub"><span className="social-monogram">GH</span></a>
              <a href="mailto:bhavishyayagik@gmail.com" aria-label="Email"><Mail size={19} /></a>
            </div>
            <a href="#top">BACK TO TOP <ArrowUpRight size={15} /></a>
          </div>
        </section>
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

export default App;