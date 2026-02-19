import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Blog {
    title: string;
    description: string;
    image: string;
    link: string;
    date?: string;
    tags?: string[];
}

const ALL_BLOGS: Blog[] = [
    {
        title: "Git Visual Workflow",
        description: "A beginner's guide to mastering Git visually. Understand branches, commits, and merges with easy-to-follow diagrams.",
        image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2076&auto=format&fit=crop",
        link: "https://pranavgawai.hashnode.dev/git-for-beginners-visual-workflow",
        date: "Oct 12, 2023",
        tags: ["Git", "DevOps"]
    },
    {
        title: "SIH 2024 Experience",
        description: "From Ideas to Impact: My detailed journey through the Smart India Hackathon, challenges faced, and lessons learned.",
        image: "/blogsih2024.png",
        link: "https://medium.com/@pranavgawai1518/from-ideas-to-impact-my-experience-at-the-smart-india-hackathon-34831673024d",
        date: "Sep 20, 2024",
        tags: ["Hackathon", "Experience"]
    },
    {
        title: "The Future of Web Dev",
        description: "Exploring Server Components, AI-driven development, and what the next generation of web frameworks holds for us.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
        link: "#",
        date: "Jan 15, 2025",
        tags: ["Web Dev", "AI"]
    },
    // Add more placeholder blogs if needed to demonstrate "all blogs"
    {
        title: "Understanding React Server Components",
        description: "A deep dive into RSCs, how they differ from Client Components, and when to use them for optimal performance.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
        link: "#",
        date: "Feb 2, 2025",
        tags: ["React", "Performance"]
    }
];

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="w-full max-w-5xl h-[85vh] bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-neutral-200 dark:border-neutral-800"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-[#111]/50 backdrop-blur-md sticky top-0 z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">All Blog Posts</h2>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Thoughts, tutorials, and experiences</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content Grid */}
                            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50 dark:bg-[#0a0a0a]">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {ALL_BLOGS.map((blog, index) => (
                                        <a
                                            key={index}
                                            href={blog.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex flex-col bg-white dark:bg-[#151515] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={blog.image}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                                    {blog.tags?.map(tag => (
                                                        <span key={tag} className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider bg-black/50 text-white backdrop-blur-md rounded">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="text-xs text-neutral-500 mb-2">{blog.date}</div>
                                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4 flex-1">
                                                    {blog.description}
                                                </p>
                                                <div className="flex items-center text-sm font-medium text-blue-500 mt-auto">
                                                    Read Article
                                                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BlogModal;
