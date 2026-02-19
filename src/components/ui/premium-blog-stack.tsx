"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BlogModal from "../modals/BlogModal"

interface Card {
    id: number
    contentType: 1 | 2 | 3
}

const cardData = {
    1: {
        title: "Git Visual Workflow",
        description: "A beginner's guide to mastering Git visually",
        image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2076&auto=format&fit=crop",
        link: "https://pranavgawai.hashnode.dev/git-for-beginners-visual-workflow",
        date: "JAN 2024"
    },
    2: {
        title: "SIH 2024 Experience",
        description: "From Ideas to Impact: My Smart India Hackathon Journey",
        image: "/blogsih2024.png",
        link: "https://medium.com/@pranavgawai1518/from-ideas-to-impact-my-experience-at-the-smart-india-hackathon-34831673024d",
        date: "DEC 2023"
    },
    3: {
        title: "Future of AI in Web",
        description: "Exploring the bridge between LLMs and modern frameworks",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2032&auto=format&fit=crop",
        link: "#",
        date: "FEB 2024"
    },
}

const initialCards: Card[] = [
    { id: 1, contentType: 1 },
    { id: 2, contentType: 2 },
    { id: 3, contentType: 3 },
]

const positionStyles = [
    { scale: 1, y: 0, opacity: 1 },
    { scale: 0.94, y: -25, opacity: 0.6 },
    { scale: 0.88, y: -50, opacity: 0.3 },
]

export default function PremiumBlogStack() {
    const [cards, setCards] = useState(initialCards)
    const [isAnimating, setIsAnimating] = useState(false)
    const [nextId, setNextId] = useState(4)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleAnimate = () => {
        if (isAnimating) return
        setIsAnimating(true)

        const nextContentType = ((cards[2].contentType % 3) + 1) as 1 | 2 | 3

        setCards(prev => {
            const newCards = [...prev.slice(1), { id: nextId, contentType: nextContentType }]
            return newCards
        })
        setNextId(prev => prev + 1)

        setTimeout(() => setIsAnimating(false), 600)
    }

    return (
        <div className="flex w-full flex-col items-center justify-center py-10">
            <div className="relative h-[420px] w-full max-w-[560px] perspective-1000">
                <AnimatePresence initial={false}>
                    {cards.slice(0, 3).map((card, index) => {
                        const data = cardData[card.contentType]
                        const pos = positionStyles[index]

                        return (
                            <motion.div
                                key={card.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{
                                    opacity: pos.opacity,
                                    scale: pos.scale,
                                    y: pos.y,
                                    zIndex: 10 - index
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 1.1,
                                    y: 100,
                                    rotate: -5,
                                    transition: { duration: 0.4 }
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 25
                                }}
                                className="absolute inset-x-0 bottom-0 mx-auto w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-3xl border border-border-light dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] origin-bottom p-2 group"
                            >
                                <div className="relative h-full w-full overflow-hidden rounded-2xl flex flex-col">
                                    <div className="relative h-[65%] w-full overflow-hidden">
                                        <img
                                            src={data.image}
                                            className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                            alt={data.title}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-6">
                                            <span className="text-[10px] font-mono text-white/70 tracking-[0.2em] uppercase">{data.date}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-6 flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-display text-2xl text-text-light dark:text-text-dark leading-tight group-hover:text-primary transition-colors">{data.title}</h3>
                                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark font-mono line-clamp-1 mt-1 opacity-70">
                                                {data.description}
                                            </p>
                                        </div>

                                        <a
                                            href={data.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-4 w-12 h-12 rounded-full bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                        >
                                            <span className="material-icons-outlined text-[20px]">call_made</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            <div className="mt-12 flex items-center gap-4">
                <button
                    onClick={handleAnimate}
                    className="flex h-12 items-center gap-2 rounded-full border border-border-light dark:border-border-dark bg-white/50 dark:bg-white/5 backdrop-blur-sm px-6 text-sm font-medium text-text-light dark:text-text-dark hover:border-primary/30 transition-all active:scale-95 shadow-sm"
                >
                    <span className="material-icons-outlined text-[18px]">refresh</span>
                    Next Article
                </button>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="h-12 flex items-center gap-2 rounded-full bg-text-light dark:bg-text-dark px-8 text-sm font-semibold text-background-light dark:text-background-dark hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    View All Stories
                    <span className="material-icons-outlined text-[18px]">arrow_forward</span>
                </button>
            </div>

            <BlogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
