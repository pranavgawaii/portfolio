import React, { useState, useEffect, useRef } from 'react';
import { PROFILE, EXPERIENCE, PROJECTS, LEADERSHIP } from './constants';
import Section from './components/Section';
import Card from './components/Card';
import Badge from './components/Badge';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

import Footer from './components/Footer';
import AboutMe from './components/AboutMe';
import FeaturedBlog from './components/FeaturedBlog';
import ProjectModal from './components/ProjectModal';
import ProjectCard from './components/ProjectCard';
import ExperienceCard from './components/ExperienceCard';
import LeadershipCard from './components/LeadershipCard';
import { useTheme } from 'next-themes';
import { Globe, Mail, GraduationCap, Calendar, MapPin, ArrowUp } from 'lucide-react';
import { ProjectItem } from './types';
import GitHubActivitySection from './components/GitHubActivitySection';
import BirthdayCelebration from './components/BirthdayCelebration';


const App: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('experience');
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Handle the timeline line drawing
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const rect = contentRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress relative to the content wrapper
      // We want the line to be at the user's visual reading position (approx 1/3 down the screen)
      // relative to the top of the content section.
      const triggerPoint = windowHeight * 0.4;
      const scrollDist = triggerPoint - rect.top;

      // Clamp the height between 0 and the total height of the content
      const newHeight = Math.max(0, Math.min(scrollDist, rect.height));

      setLineHeight(newHeight);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial calculation
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px', // Triggers when section is near the top-third of viewport
        threshold: 0.1
      }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const getCircleClass = (sectionId: string) => {
    const baseClass = "absolute -left-[17px] md:-left-[44px] top-2 w-2.5 h-2.5 rounded-full bg-white dark:bg-[#050505] z-20 transition-all duration-300";
    const activeClass = "border border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";
    const inactiveClass = "border border-neutral-300 dark:border-neutral-700";

    return `${baseClass} ${activeSection === sectionId ? activeClass : inactiveClass}`;
  };

  const [showTop, setShowTop] = useState(false);

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
    <div className="min-h-screen bg-white dark:bg-[#050505] text-neutral-600 dark:text-neutral-400 selection:bg-neutral-200 dark:selection:bg-neutral-700 selection:text-black dark:selection:text-white font-sans relative overflow-x-hidden transition-colors duration-300">

      {/* Exact Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-white dark:bg-[#050505] transition-colors duration-300"></div>
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundImage: isDarkMode
              ? `linear-gradient(#333333 1px, transparent 1px), linear-gradient(90deg, #333333 1px, transparent 1px)`
              : `linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            opacity: isDarkMode ? 0.6 : 0.8
          }}
        ></div>

        <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isDarkMode ? 'via-[#050505]/50 to-[#050505]' : 'via-white/50 to-white'} opacity-80 transition-colors duration-300`}></div>
      </div>



      <div className="max-w-2xl mx-auto px-6 py-28 relative z-10">

        {/* Prevent flicker/hydration mismatch by rendering Navbar only after mount */}
        {typeof window === 'undefined' ? null : <Navbar />}

        {/* Hero Section */}
        <div id="home" className="scroll-mt-28">
          <Hero />
        </div>

        {/* Content Wrapper - The Timeline Line lives here */}
        <div ref={contentRef} className="relative">

          {/* Timeline Line (Responsive) */}
          {/* Desktop Green Line */}
          <div className="hidden md:block absolute -left-10 top-2 bottom-0 w-[1px] bg-neutral-200 dark:bg-neutral-800/50">
            <div
              className="absolute top-0 left-0 w-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-100 ease-out"
              style={{ height: `${lineHeight}px` }}
            />
          </div>
          {/* Mobile Green Line */}
          <div className="md:hidden absolute left-[-12px] top-2 bottom-0 w-[1.5px] bg-neutral-200 dark:bg-neutral-800/50">
            <div
              className="absolute top-0 left-0 w-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-all duration-100 ease-out"
              style={{ height: `${lineHeight}px` }}
            />
          </div>



          {/* Experience Section */}
          <Section id="experience" title="Experience">
            <div className={getCircleClass('experience')}></div>

            <div className="pl-2">
              {EXPERIENCE.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </Section>

          {/* Projects Section */}
          <Section id="projects" title="Projects">
            <div className={getCircleClass('projects')}></div>
            <div className="grid grid-cols-1 gap-8">
              {PROJECTS.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </Section>


          {/* Leadership & Recognition Section */}
          <Section id="leadership" title="Leadership & Recognition" collapsible={false}>
            <div className={getCircleClass('leadership')}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LEADERSHIP.map((item) => (
                <LeadershipCard key={item.id} item={item} />
              ))}
            </div>
          </Section>
        </div>

        {/* About Me Section */}
        <AboutMe />
        <GitHubActivitySection />

        {/* Featured Blog Section */}
        <FeaturedBlog />

        {/* Contact Section */}
        <section className="mt-24 mb-12 flex justify-center items-center">
          <div className="w-full max-w-3xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-[#111]/70 shadow-[0_2px_16px_0_rgba(0,0,0,0.10)] backdrop-blur-md px-6 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get In Touch</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
              If you’ve made it this far, we should talk :)<br />
              I’m open to Work , Collaborations, & Interesting problems.<br />
              Have a question or an idea? My inbox is always open.
            </p>
            <a
              href="https://x.com/messages/compose?recipient_id=pranavgawai_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 rounded-lg text-sm font-medium text-white dark:text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-700 transition-all group"
            >
              <Mail size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Say Hello
            </a>
          </div>

        </section>



        {/* Virat Kohli Quote with Person Image Floating Bottom Right */}
        <div style={{ position: 'relative', width: '100%', minHeight: 180, marginBottom: 48 }}>
          {/* Quote floating on the left, with right margin to avoid image overlay */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: 520,
              marginLeft: '2vw',
              padding: '2.5rem 1.5rem 2.5rem 0',
              marginRight: 240, // ensures quote never overlays image
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: 17, fontStyle: 'italic', color: isDarkMode ? '#e0e0e0' : '#222', fontWeight: 500, lineHeight: 1.5, textShadow: isDarkMode ? '0 2px 8px #000' : '0 2px 8px #fff' }}>
              “You don’t get what you wish for, you get what you work for.”
            </span>
            <div style={{ fontSize: 13, color: isDarkMode ? '#aaa' : '#444', marginTop: 12, fontWeight: 400, fontStyle: 'italic' }}>
              — Virat Kohli
            </div>
          </div>
          {/* Person image absolutely positioned bottom right with reduced opacity */}
          <img
            src="/vkbg.png"
            alt="Virat Kohli Person Only"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              height: 168,
              width: 'auto',
              opacity: 0.65,
              objectFit: 'contain',
              objectPosition: 'right bottom',
              zIndex: 1,
              pointerEvents: 'none',
              filter: isDarkMode ? 'brightness(0.8)' : 'brightness(1)',
              transition: 'opacity 0.3s',
            }}
          />
        </div>



        <Footer />

      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Back to Top Button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-6 z-50 p-3 rounded-full bg-neutral-900 dark:bg-neutral-800 text-white shadow-lg hover:bg-neutral-700 dark:hover:bg-neutral-700 transition-all duration-200 flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Birthday Celebration Easter Egg */}
      <BirthdayCelebration />
    </div>
  );
};

export default App;