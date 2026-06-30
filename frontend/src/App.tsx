import React, { useState, useEffect, Suspense, createContext, useContext } from 'react';
import { track } from './hooks/useAnalytics';
import { playClick, playGeneralClick } from './lib/clickSound';
import { EXPERIENCE, PROJECTS, BLOGS, BlogPost } from './config/constants';
import Hero from './components/sections/Hero';
import Navbar from './components/layout/Navbar';
import StarryBackground from './components/ui/StarryBackground';
import { AnimatePresence, motion } from 'motion/react';
import SearchModal from './components/modals/SearchModal';
import BackToTop from './components/ui/BackToTop';
import { ProjectItem } from './types/index';

const Footer           = React.lazy(() => import('./components/layout/Footer'));
const QuotesCTA        = React.lazy(() => import('./components/sections/QuotesCTA'));
const AboutMe          = React.lazy(() => import('./components/sections/AboutMe'));
const GitHubActivity   = React.lazy(() => import('./components/sections/GitHubActivitySection'));
const Education        = React.lazy(() => import('./components/sections/Education'));
const ExperienceCard   = React.lazy(() => import('./components/features/ExperienceCard'));
const ProjectCard      = React.lazy(() => import('./components/features/ProjectCard'));
const ProjectDetail    = React.lazy(() => import('./components/sections/ProjectDetail'));
const TechMarquee      = React.lazy(() => import('./components/sections/TechMarquee'));
const BlogSection      = React.lazy(() => import('./components/sections/BlogSection'));
const ProjectsPage     = React.lazy(() => import('./components/sections/ProjectsPage'));
const BlogPage         = React.lazy(() => import('./components/sections/BlogPage'));
const BlogPostPage     = React.lazy(() => import('./components/sections/BlogPostPage'));
const DSAPage          = React.lazy(() => import('./components/sections/DSAPage'));
const ResumePage       = React.lazy(() => import('./components/sections/ResumePage'));
const AdminPage        = React.lazy(() => import('./components/sections/AdminPage'));
const NotFoundPage     = React.lazy(() => import('./components/sections/NotFoundPage'));

// ─── Nav context ─────────────────────────────────────────────────────────────
export type Page = 'home' | 'project-detail' | 'projects' | 'blog' | 'blog-post' | 'dsa' | 'resume' | 'admin' | 'not-found';

interface NavCtx {
  page: Page;
  selectedProject: ProjectItem | null;
  selectedBlog: BlogPost | null;
  goHome: () => void;
  openProject: (p: ProjectItem) => void;
  openResume: () => void;
  goProjects: () => void;
  goBlog: () => void;
  openBlog: (b: BlogPost) => void;
  goDSA: () => void;
  goAdmin: () => void;
}

export const NavContext = createContext<NavCtx>({
  page: 'home',
  selectedProject: null,
  selectedBlog: null,
  goHome: () => {},
  openProject: () => {},
  openResume: () => {},
  goProjects: () => {},
  goBlog: () => {},
  openBlog: () => {},
  goDSA: () => {},
  goAdmin: () => {},
});

export const useNav = () => useContext(NavContext);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skel = () => <div className="h-32 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-900" />;

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Sec = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="mb-14 scroll-mt-24">
    <h2 className="font-sans font-bold text-xl sm:text-2xl text-text-light dark:text-text-dark mb-5 tracking-tight">
      {title}
    </h2>
    {children}
  </section>
);

// ─── Home page ────────────────────────────────────────────────────────────────
const HomePage: React.FC<{ openProject: (p: ProjectItem) => void }> = ({ openProject }) => (
  <>
    {/* Hero */}
    <section id="home" className="mb-14">
      <Hero />
    </section>

    {/* Experience */}
    <Sec id="experience" title="Experience">
      <Suspense fallback={<Skel />}>
        <div className="space-y-1">
          {EXPERIENCE.map(exp => <ExperienceCard key={exp.id} experience={exp} />)}
        </div>
      </Suspense>
    </Sec>

    {/* Projects — top 3 only */}
    <Sec id="projects" title="Projects">
      <Suspense fallback={<Skel />}>
        <div className="flex flex-col">
          {PROJECTS.slice(0, 3).map(p => (
            <ProjectCard key={p.id} project={p} onClick={() => openProject(p)} />
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => (window as any).__goProjects?.()}
            className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors underline underline-offset-4 decoration-dashed"
          >
            Show all projects →
          </button>
        </div>
      </Suspense>
    </Sec>

    {/* Tech Expertise */}
    <section id="stack" className="mb-14">
      <Suspense fallback={<Skel />}><TechMarquee /></Suspense>
    </section>

    {/* Activity heatmap */}
    <Sec id="github" title="Activity">
      <Suspense fallback={<Skel />}><GitHubActivity /></Suspense>
    </Sec>

    {/* Education */}
    <Sec id="education" title="Education">
      <Suspense fallback={<Skel />}><Education /></Suspense>
    </Sec>

    {/* About */}
    <Sec id="about" title="About">
      <Suspense fallback={<Skel />}><AboutMe /></Suspense>
    </Sec>

    {/* Blog */}
    <Sec id="blog" title="Blog">
      <Suspense fallback={<Skel />}>
        <BlogSection />
      </Suspense>
    </Sec>

    {/* Quote */}
    <Suspense fallback={null}><QuotesCTA /></Suspense>
  </>
);

import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const ClerkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  
  if (!PUBLISHABLE_KEY) return <>{children}</>;

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      localization={{
        signIn: {
          start: {
            title: 'Join the Discussion',
            subtitle: 'Sign in to leave a comment',
          }
        }
      }}
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
        variables: {
          fontFamily: 'inherit',
          colorPrimary: resolvedTheme === 'dark' ? '#ffffff' : '#171717',
          colorBackground: resolvedTheme === 'dark' ? '#0a0a0a' : '#ffffff',
          borderRadius: '0.75rem',
        },
        elements: {
          card: "border border-border-light dark:border-border-dark shadow-2xl",
          headerTitle: "w-full text-center font-sans font-bold text-xl tracking-tight text-text-light dark:text-text-dark",
          headerSubtitle: "w-full text-center text-text-muted-light dark:text-text-muted-dark",
          socialButtonsBlockButton: "border-border-light dark:border-border-dark hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors",
          socialButtonsBlockButtonText: "font-medium text-text-light dark:text-text-dark",
          formFieldLabel: "text-text-light dark:text-text-dark",
          formFieldInput: "bg-transparent border-border-light dark:border-border-dark text-text-light dark:text-text-dark focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded-xl",
          footerActionLink: "text-blue-500 hover:text-blue-600",
          identityPreviewText: "text-text-light dark:text-text-dark",
          formButtonPrimary: "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 rounded-xl font-medium",
          dividerLine: "bg-border-light dark:bg-border-dark",
          dividerText: "text-text-muted-light dark:text-text-muted-dark",
          watermark: "hidden", // Forces removal of "Secured by Clerk"
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [page, setPage]               = useState<Page>('home');
  const [selectedProject, setProjectModal] = useState<ProjectItem | null>(null);
  const [selectedBlog, setSelectedBlog]   = useState<BlogPost | null>(null);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [pageKey, setPageKey]         = useState(0);

  const nav = (p: Page, url: string) => {
    setPage(p);
    setPageKey(k => k + 1);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    track({ type: 'page_view', path: url });
  };

  const goHome     = () => nav('home', '/');
  const goProjects = () => nav('projects', '/projects');
  const goBlog     = () => nav('blog', '/blog');
  const goDSA      = () => nav('dsa', '/dsa');
  const openResume = () => { nav('resume', '/resume'); track({ type: 'resume_view' }); };
  const goAdmin    = () => nav('admin', '/dashboard-x7');
  
  const openProject = (p: ProjectItem) => { setProjectModal(p); track({ type: 'project_click', projectId: p.id, projectName: p.title }); };
  const closeProject = () => setProjectModal(null);
  const openBlog = (b: BlogPost) => {
    setSelectedBlog(b);
    setPage('blog-post');
    window.history.pushState({}, '', `/blog/${b.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    track({ type: 'blog_open', slug: b.slug, title: b.title });
  };

  // expose for the "Show all" buttons inside HomePage
  (window as any).__goProjects = goProjects;
  (window as any).__goBlog = goBlog;

  // Related post navigation from BlogPostPage
  useEffect(() => {
    const h = (e: Event) => { const blog = (e as CustomEvent).detail; if (blog) openBlog(blog); };
    window.addEventListener('open-blog', h);
    return () => window.removeEventListener('open-blog', h);
  }, []);

  // ── Parse URL on mount so direct links work ─────────────────────────────
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      const found = BLOGS.find(b => b.slug === slug);
      if (found) { setSelectedBlog(found); setPage('blog-post'); }
      else setPage('blog');
    } else if (path === '/blog') {
      setPage('blog');
    } else if (path === '/projects') {
      setPage('projects');
    } else if (path === '/dsa') {
      setPage('dsa');
    } else if (path === '/resume') {
      setPage('resume');
    } else if (path === '/dashboard-x7') {
      setPage('admin');
    } else if (path !== '/' && path !== '') {
      setPage('not-found');
    }
    // Handle browser back/forward
    const onPop = () => {
      const p = window.location.pathname;
      if (p === '/' || p === '') { setPage('home'); setSelectedBlog(null); }
      else if (p === '/projects') setPage('projects');
      else if (p === '/blog') { setPage('blog'); setSelectedBlog(null); }
      else if (p.startsWith('/blog/')) {
        const slug = p.replace('/blog/', '');
        const found = BLOGS.find(b => b.slug === slug);
        if (found) { setSelectedBlog(found); setPage('blog-post'); }
      } else if (p === '/dsa') setPage('dsa');
      else if (p === '/resume') setPage('resume');
      else if (p === '/dashboard-x7') setPage('admin');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('button,a,[role="button"]')) {
        if (el.closest('[aria-label="Toggle theme"]')) return;
        playGeneralClick();
      }
    };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, []);


  // Global keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Cmd+K / Ctrl+K — search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(o => !o); return; }
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'g') { e.preventDefault(); goHome(); }
      else if (e.key === 'p') { e.preventDefault(); goProjects(); }
      else if (e.key === 'b') { e.preventDefault(); goBlog(); }
      else if (e.key === 'r') { e.preventDefault(); openResume(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <ClerkWrapper>
      <NavContext.Provider value={{ page, selectedProject, selectedBlog, goHome, openProject, openResume, goProjects, goBlog, openBlog, goDSA, goAdmin }}>
        <div className="min-h-screen bg-transparent text-text-light dark:text-text-dark font-sans antialiased flex flex-col items-center">
          <StarryBackground />
          <Navbar onResumeOpen={openResume} />

          <AnimatePresence mode="wait">
            <motion.main
              key={page === 'blog-post' ? `blog-post-${selectedBlog?.slug}` : page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full max-w-content mx-auto px-4 sm:px-6 pb-24 flex-1"
            >
                {page === 'home' && <HomePage openProject={openProject} />}
                {page === 'projects' && (
                  <Suspense fallback={<Skel />}>
                    <ProjectsPage onSelect={openProject} onBack={goHome} />
                  </Suspense>
                )}
                {page === 'blog' && (
                  <Suspense fallback={<Skel />}>
                    <BlogPage onBack={goHome} onOpenBlog={openBlog} />
                  </Suspense>
                )}
                {page === 'blog-post' && selectedBlog && (
                  <Suspense fallback={<Skel />}>
                    <BlogPostPage blog={selectedBlog} onBack={goBlog} />
                  </Suspense>
                )}
                {page === 'dsa' && (
                  <Suspense fallback={<Skel />}>
                    <DSAPage onBack={goHome} />
                  </Suspense>
                )}
                {page === 'resume' && (
                  <Suspense fallback={<Skel />}>
                    <ResumePage />
                  </Suspense>
                )}
                {page === 'admin' && (
                  <Suspense fallback={<Skel />}>
                    <AdminPage />
                  </Suspense>
                )}
                {page === 'not-found' && (
                  <Suspense fallback={<Skel />}>
                    <NotFoundPage />
                  </Suspense>
                )}
            </motion.main>
          </AnimatePresence>

          {/* Footer outside AnimatePresence — never flickers */}
          <div className="w-full">
            <Suspense fallback={null}><Footer /></Suspense>
          </div>

          {/* Back-to-top + Search */}
          <BackToTop />
          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

          {/* Project detail modal */}
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
                onClick={closeProject}
              >
                <motion.div
                  initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="relative w-full max-w-2xl max-h-[90dvh] bg-white dark:bg-[#0a0a0a] rounded-t-2xl sm:rounded-2xl border border-border-light dark:border-border-dark shadow-2xl overflow-y-auto"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={closeProject}
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors z-10 text-lg leading-none"
                  >×</button>
                  <div className="px-6 py-6">
                    <Suspense fallback={<Skel />}>
                      <ProjectDetail project={selectedProject} onBack={closeProject} />
                    </Suspense>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </NavContext.Provider>
    </ClerkWrapper>
  );
};

export default App;
