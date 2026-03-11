import React, { useState, useEffect, Suspense } from 'react';
import { EXPERIENCE, PROJECTS } from './config/constants';
import Section from './components/ui/Section';
import Hero from './components/sections/Hero';
import Navbar from './components/layout/Navbar';
import Preloader from './components/layout/Preloader';
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans antialiased transition-colors duration-300 flex flex-col items-center">
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader />}
      </AnimatePresence>

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

        <Section id="projects" title="Projects">
          <div className="flex flex-col space-y-2">
            <Suspense fallback={<div className="h-60 animate-pulse bg-gray-100 dark:bg-neutral-900 rounded-lg"></div>}>
              {PROJECTS.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </Suspense>
          </div>
        </Section>

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

