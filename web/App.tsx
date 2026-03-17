import React, { useState, useEffect, Suspense } from 'react';
import { EXPERIENCE, PROJECTS } from './config/constants';
import Section from './components/ui/Section';
import Hero from './components/sections/Hero';
import Navbar from './components/layout/Navbar';
import Preloader from './components/layout/Preloader';
import StarryBackground from './components/ui/StarryBackground';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { ProjectItem } from './types/index';

// Lazy load sections
const Footer = React.lazy(() => import('./components/layout/Footer'));
const AboutMe = React.lazy(() => import('./components/sections/AboutMe'));
const FeaturedBlog = React.lazy(() => import('./components/sections/FeaturedBlog'));
const ProjectModal = React.lazy(() => import('./components/modals/ProjectModal'));
const GitHubActivitySection = React.lazy(() => import('./components/sections/GitHubActivitySection'));
const Education = React.lazy(() => import('./components/sections/Education'));
const Recognition = React.lazy(() => import('./components/sections/Recognition'));
const Contact = React.lazy(() => import('./components/sections/Contact'));
const Quote = React.lazy(() => import('./components/sections/Quote'));

// Lazy load feature components
const ProjectCard = React.lazy(() => import('./components/features/ProjectCard'));
const ExperienceCard = React.lazy(() => import('./components/features/ExperienceCard'));

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 600);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-transparent text-text-light dark:text-text-dark font-sans antialiased transition-colors duration-300 flex flex-col items-center">
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader />}
      </AnimatePresence>

      <StarryBackground />

      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-content px-4 sm:px-6 pb-20"
      >
        <section id="home">
          <Hero />
        </section>

        <section id="github" className="mt-4 mb-20">
          <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-neutral-900 rounded-lg"></div>}>
            <GitHubActivitySection />
          </Suspense>
        </section>

        <Section id="experience" title="Experience">
          <div className="flex flex-col space-y-2">
            <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-neutral-900 rounded-lg"></div>}>
              {EXPERIENCE.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </Suspense>
          </div>
        </Section>

        <motion.section 
          id="projects" 
          className="mb-16 scroll-mt-28 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col items-center justify-center text-center mb-16 pt-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex px-4 py-1.5 rounded-xl bg-text-light dark:bg-[#f2f2f2] text-background-light dark:text-black font-semibold text-sm mb-6 shadow-sm border border-transparent dark:border-white/10"
            >
              My Projects
            </motion.div>
            
            <div className="relative inline-block mb-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black text-text-light dark:text-white tracking-tighter relative z-10">
                My latest work
              </h2>
              
              {/* Stars/Sparkles */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 12 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="absolute -top-1 sm:-top-2 left-[48%] sm:left-[50%] w-5 h-5 sm:w-6 sm:h-6 text-purple-400 drop-shadow-md z-0"
              >
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" /></svg>
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: 45 }}
                whileInView={{ scale: 1, opacity: 1, rotate: -15 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="absolute -bottom-2 sm:-bottom-3 left-[42%] sm:left-[43%] w-3 h-3 sm:w-4 sm:h-4 text-purple-400/80 drop-shadow-md z-0"
              >
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" /></svg>
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -25 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 20 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                className="absolute -bottom-4 sm:-bottom-5 left-[50%] sm:left-[51%] w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 drop-shadow-md z-0"
              >
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" /></svg>
              </motion.div>
            </div>
            
            <p className="text-text-muted-light dark:text-neutral-400 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed">
              I love building projects, whether they are simple websites or more<br className="hidden sm:block" /> complex web apps. Below are a few of my favorites.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Suspense fallback={<div className="h-60 animate-pulse bg-gray-100 dark:bg-neutral-900 rounded-lg col-span-1 sm:col-span-2"></div>}>
              {PROJECTS.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </Suspense>
          </div>
        </motion.section>

        <Section id="education" title="Education">
          <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-neutral-900 rounded-lg"></div>}>
            <Education />
          </Suspense>
        </Section>

        <Section id="recognition" title="Recognition">
          <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-neutral-900 rounded-lg"></div>}>
            <Recognition />
          </Suspense>
        </Section>

        <AboutMe />

        <Suspense fallback={null}>
          <FeaturedBlog />
        </Suspense>

        <Quote />

        <Contact />

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </motion.main>

      <Suspense fallback={null}>
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </Suspense>

      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 p-3 rounded-full bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center border border-border-light dark:border-border-dark"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default App;

