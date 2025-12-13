import React, { useState, useEffect, useRef } from 'react';
import { PROFILE, EXPERIENCE, PROJECTS, EDUCATION, LEADERSHIP } from './constants';
import Section from './components/Section';
import Card from './components/Card';
import Badge from './components/Badge';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import { useTheme } from 'next-themes';
import { Globe, Mail } from 'lucide-react';
import { ProjectItem } from './types';

const App: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('education');
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
        
        <Navbar />

        {/* Hero Section */}
        <div id="home">
          <Hero />
        </div>

        {/* Content Wrapper - The Timeline Line lives here */}
        <div ref={contentRef} className="relative">
            
            {/* Timeline Lines (Desktop Only) */}
            <div className="hidden md:block absolute -left-10 top-2 bottom-0 w-[1px] bg-neutral-200 dark:bg-neutral-800/50">
                <div 
                    className="absolute top-0 left-0 w-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-100 ease-out"
                    style={{ height: `${lineHeight}px` }}
                />
            </div>

            {/* Mobile Timeline Line */}
            <div className="absolute left-[-12px] top-2 bottom-0 w-[1px] bg-neutral-200 dark:bg-neutral-800/50 md:hidden"></div>

            {/* Education Section */}
            <Section id="education" title="Education">
                <div className={getCircleClass('education')}></div>
                <div className="space-y-8">
                    {EDUCATION.map((edu) => (
                        <div key={edu.id} className="relative group">
                            <div className="flex flex-col md:flex-row md:justify-between mb-1">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {edu.institution}
                                </h3>
                                <span className="text-xs font-mono text-neutral-500">{edu.location}</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:justify-between mb-2">
                                <span className="text-sm text-gray-700 dark:text-neutral-300 font-medium">{edu.degree}</span>
                                {edu.period && <span className="text-xs text-neutral-500 font-mono">{edu.period}</span>}
                            </div>
                            {edu.details && (
                                <ul className="list-none space-y-1">
                                    {edu.details.map((detail, i) => (
                                        <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400">{detail}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            {/* Experience Section */}
            <Section id="experience" title="Experience">
                <div className={getCircleClass('experience')}></div>
                
                <div className="space-y-12">
                    {EXPERIENCE.map((exp) => (
                        <div key={exp.id} className="relative group">
                            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2 gap-2">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {exp.role}
                                </h3>
                                <span className="text-xs font-mono text-neutral-500">
                                    {exp.period}
                                </span>
                            </div>
                            
                            <div className="mb-4 flex justify-between items-center">
                                <span className="text-sm text-gray-700 dark:text-neutral-300 font-medium">{exp.company}</span>
                                {exp.location && <span className="text-xs text-neutral-500">{exp.location}</span>}
                            </div>
                            
                            {/* Updated List Styling for Alignment */}
                            <ul className="list-disc list-outside ml-4 space-y-2 mb-5 text-sm text-neutral-600 dark:text-neutral-400 marker:text-neutral-400 dark:marker:text-neutral-700">
                                {exp.description.map((desc, i) => (
                                    <li key={i} className="leading-relaxed pl-1">{desc}</li>
                                ))}
                            </ul>

                            {exp.techStack && (
                                <div className="flex gap-2 flex-wrap">
                                    {exp.techStack.map(tech => (
                                        <Badge key={tech} variant="outline">{tech}</Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            {/* Projects Section */}
            <Section id="projects" title="Projects">
                <div className={getCircleClass('projects')}></div>
                
            <div className="grid grid-cols-1 gap-6">
                {PROJECTS.map((project) => (
                    <Card 
                      key={project.id} 
                      onClick={() => setSelectedProject(project)}
                      className="group hover:bg-neutral-100 dark:hover:bg-neutral-900/30 border-neutral-200 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800 transition-all"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-800 dark:text-neutral-200 text-base group-hover:underline decoration-neutral-400 dark:decoration-neutral-700 underline-offset-4">{project.title}</h3>
                            <div className="flex gap-2">
                                {project.status && (
                                    <span className="px-1.5 py-0.5 text-[10px] bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded border border-green-200 dark:border-green-900/30 uppercase tracking-wider">
                                        {project.status}
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                            {project.techStack.map(tech => (
                                <Badge key={tech} variant="secondary">{tech}</Badge>
                            ))}
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noreferrer" className="ml-auto text-neutral-500 hover:text-black dark:hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                                    <Globe size={14} />
                                </a>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
            </Section>

            {/* Technical Skills Section */}
            <Section id="skills" title="Technical Skills">
                <div className={getCircleClass('skills')}></div>
                <div className="space-y-4">
                    {PROFILE.skills.map((category) => (
                        <div key={category.name} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                            <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300 min-w-[100px] pt-1">
                                {category.name}:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map(skill => (
                                    <Badge key={skill} variant="outline">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Leadership & Recognition Section */}
            <Section id="leadership" title="Leadership & Recognition">
                <div className={getCircleClass('leadership')}></div>
                <div className="grid gap-4">
                    {LEADERSHIP.map((item) => (
                        <div key={item.id} className="p-4 bg-neutral-50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800/50 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-base font-semibold text-gray-800 dark:text-neutral-200">
                                    {item.title}
                                </h3>
                                <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                                    {item.role}
                                </span>
                                {item.description && (
                                    <p className="text-sm text-neutral-500 mt-1">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>

        {/* Contact Section */}
        <section className="mt-24 mb-12 text-center">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get In Touch</h2>
             <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
                I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open!
             </p>
             <a 
                href="mailto:pranavgawai1518@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 rounded-lg text-sm font-medium text-white dark:text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-700 transition-all group"
             >
                <Mail size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                Say Hello
             </a>
        </section>

        <Footer />

      </div>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};

export default App;