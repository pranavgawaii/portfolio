import React, { useState, useEffect, useRef, Suspense } from 'react';
import { PROFILE, EXPERIENCE, PROJECTS, LEADERSHIP, EDUCATION } from './constants';
import Section from './components/ui/Section';
import Card from './components/ui/Card';
import Badge from './components/ui/Badge';
import Hero from './components/sections/Hero';
import Navbar from './components/layout/Navbar';
import Preloader from './components/layout/Preloader';
import { AnimatePresence, motion } from 'motion/react';



// Lazy load heavy/below-the-fold components
const Footer = React.lazy(() => import('./components/layout/Footer'));
const AboutMe = React.lazy(() => import('./components/sections/AboutMe'));
const FeaturedBlog = React.lazy(() => import('./components/sections/FeaturedBlog'));
const ProjectModal = React.lazy(() => import('./components/modals/ProjectModal'));
const GitHubActivitySection = React.lazy(() => import('./components/sections/GitHubActivitySection'));

const ProjectCard = React.lazy(() => import('./components/features/ProjectCard'));
const ExperienceCard = React.lazy(() => import('./components/features/ExperienceCard'));
const LeadershipCard = React.lazy(() => import('./components/features/LeadershipCard'));
import { useTheme } from 'next-themes';
import { Link as LinkIcon, FileText, Mail, X, Copy, Check, Download, MoreHorizontal, MessageCircle, Grid, Zap, MapPin, ArrowUp } from 'lucide-react';
import { ProjectItem } from './types';




const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const { resolvedTheme } = useTheme();

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

        {/* GitHub section directly below Spotify (which is at bottom of Hero) */}
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
          <div className="flex flex-col space-y-3">
            {EDUCATION.map((edu) => (
              <div key={edu.id} className="group relative p-5 -mx-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-border-light dark:hover:border-border-dark/50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 mb-1">
                  <h3 className="font-semibold text-base text-text-light dark:text-text-dark tracking-tight leading-tight">{edu.institution}</h3>
                  {edu.period && (
                    <span className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark opacity-70 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                      {edu.period}
                    </span>
                  )}
                </div>
                {edu.degree && (
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-2 font-medium leading-snug">
                    {edu.degree}
                  </p>
                )}
                {edu.details && (
                  <div className="flex flex-col gap-1 mt-1">
                    {edu.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 group/item">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors.marginTop-[-2px]" />
                        <span className="text-sm text-text-muted-light dark:text-text-muted-dark opacity-90 group-hover:opacity-100 transition-opacity leading-snug">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section id="recognition" title="Recognition">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-neutral-900 rounded-lg"></div>}>
              {LEADERSHIP.map((item) => (
                <LeadershipCard key={item.id} item={item} />
              ))}
            </Suspense>
          </div>
        </Section>

        {/* Biography Section */}
        <AboutMe />

        <Suspense fallback={null}>
          <FeaturedBlog />
        </Suspense>

        {/* Virat Kohli Quote Section */}
        <div className="relative w-full min-h-[160px] sm:min-h-[180px] my-16 sm:my-24 overflow-hidden rounded-2xl border border-dashed border-border-light dark:border-border-dark p-6 sm:p-8 group flex items-center">
          <div className="relative z-10 max-w-sm sm:max-w-md">
            <span className="font-display text-xl sm:text-2xl italic text-text-light dark:text-text-dark leading-tight block mb-3 sm:mb-4 pr-12 sm:pr-0">
              “You don’t get what you wish for, you get what you work for.”
            </span>
            <div className="text-xs sm:text-sm text-text-muted-light dark:text-text-dark font-mono italic opacity-80 sm:opacity-100">
              — Virat Kohli
            </div>
          </div>
          <img
            src="/vkbg.png"
            alt="Virat Kohli"
            className="absolute right-[-10%] sm:right-0 bottom-0 h-32 sm:h-40 w-auto object-contain opacity-30 sm:opacity-40 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 pointer-events-none"
          />
        </div>

        {/* Contact Section */}
        <section id="contact" className="mt-16 sm:mt-24 mb-8 sm:mb-12 flex justify-center items-center">
          <div className="w-full rounded-2xl border border-border-light dark:border-border-dark bg-white/50 dark:bg-white/5 backdrop-blur-md px-4 sm:px-6 py-12 sm:py-16 text-center shadow-sm">
            <h2 className="font-display text-3xl sm:text-4xl text-text-light dark:text-text-dark mb-3 sm:mb-4">Get In Touch</h2>
            <p className="text-text-muted-light dark:text-text-muted-dark mb-6 sm:mb-8 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed">
              If you’ve made it this far, we should talk :)<br />
              I’m open to Work, Collaborations, & Interesting problems.<br />
              Have a question or an idea? My inbox is always open.
            </p>
            <a
              href="https://x.com/messages/compose?recipient_id=pranavgawai_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3 bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark rounded-full text-sm font-semibold hover:scale-105 transition-transform active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              <Mail size={16} />
              Say Hello
            </a>
          </div>
        </section>

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
