import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BLOGS } from '../../config/constants';

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
                        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-3xl max-h-[85vh] bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-neutral-200 dark:border-neutral-800">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Writing</h2>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Thoughts, tutorials, and experience reports</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Blog list */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {BLOGS.map((blog) => (
                                    <a
                                        key={blog.id}
                                        href={blog.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex gap-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:-translate-y-0.5"
                                    >
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                                    {blog.platform}
                                                </span>
                                                <span className="text-xs text-neutral-400">{blog.date}</span>
                                                {blog.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="font-bold text-neutral-900 dark:text-white text-base leading-snug group-hover:text-blue-500 transition-colors">
                                                {blog.title}
                                            </h3>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                                                {blog.description}
                                            </p>
                                        </div>
                                        <div className="self-center text-neutral-300 dark:text-neutral-600 group-hover:text-blue-500 transition-colors shrink-0">
                                            <ArrowRight size={16} />
                                        </div>
                                    </a>
                                ))}

                                {/* Coming soon placeholder */}
                                <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 text-center">
                                    <p className="text-sm text-neutral-400 dark:text-neutral-500">More articles coming soon —</p>
                                    <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">Follow me on <a href="https://x.com/pranavgawai_" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">X @pranavgawai_</a> for updates</p>
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
