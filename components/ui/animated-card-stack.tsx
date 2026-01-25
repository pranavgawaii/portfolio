"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

interface Card {
    id: number
    contentType: 1 | 2 | 3
}

const cardData = {
    1: {
        title: "Git Visual Workflow",
        description: "A beginner's guide to mastering Git visually",
        image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2076&auto=format&fit=crop", // GitHub/Code collaboration vibe
        link: "https://pranavgawai.hashnode.dev/git-for-beginners-visual-workflow"
    },
    2: {
        title: "SIH 2024 Experience",
        description: "From Ideas to Impact: My Smart India Hackathon Journey",
        image: "/blogsih2024.png",
        link: "https://medium.com/@pranavgawai1518/from-ideas-to-impact-my-experience-at-the-smart-india-hackathon-34831673024d"
    },
    3: {
        title: "The Future of Web Dev",
        description: "Exploring Server Components and AI-driven development",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop", // Cyberpunk/Tech vibe
        link: "#"
    },
}

const initialCards: Card[] = [
    { id: 1, contentType: 1 },
    { id: 2, contentType: 2 },
    { id: 3, contentType: 3 },
]

const positionStyles = [
    { scale: 1, y: 12 },
    { scale: 0.95, y: -16 },
    { scale: 0.9, y: -44 },
]

const exitAnimation = {
    y: 340,
    scale: 1,
    zIndex: 10,
}

const enterAnimation = {
    y: -16,
    scale: 0.9,
}

function CardContent({ contentType }: { contentType: 1 | 2 | 3 }) {
    const data = cardData[contentType]

    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className="-outline-offset-1 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl outline outline-black/10 dark:outline-white/10">
                <img
                    src={data.image || "/placeholder.svg"}
                    alt={data.title}
                    className="h-full w-full select-none object-cover"
                />
            </div>
            <div className="flex w-full items-center justify-between gap-2 px-3 pb-6">
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-foreground text-lg">{data.title}</span>
                    <span className="text-muted-foreground text-sm truncate">{data.description}</span>
                </div>
                <a
                    href={data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 shrink-0 cursor-pointer select-none items-center gap-0.5 rounded-full bg-foreground pl-4 pr-3 text-sm font-medium text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                    Read
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="square"
                    >
                        <path d="M9.5 18L15.5 12L9.5 6" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

function AnimatedCard({
    card,
    index,
    isAnimating,
}: {
    card: Card
    index: number
    isAnimating: boolean
}) {
    const { scale, y } = positionStyles[index] ?? positionStyles[2]
    const zIndex = index === 0 && isAnimating ? 10 : 3 - index

    const exitAnim = index === 0 ? exitAnimation : undefined
    const initialAnim = index === 2 ? enterAnimation : undefined

    return (
        <motion.div
            key={card.id}
            initial={initialAnim}
            animate={{ y, scale }}
            exit={exitAnim}
            transition={{
                type: "spring",
                duration: 1,
                bounce: 0,
            }}
            style={{
                zIndex,
                left: "50%",
                x: "-50%",
                bottom: 0,
            }}
            className="absolute flex h-[280px] w-[324px] items-center justify-center overflow-hidden rounded-t-xl border-x border-t border-border bg-card p-1 shadow-lg will-change-transform sm:w-[512px]"
        >
            <CardContent contentType={card.contentType} />
        </motion.div>
    )
}

import BlogModal from "../BlogModal"

export default function AnimatedCardStack() {
    const [cards, setCards] = useState(initialCards)
    const [isAnimating, setIsAnimating] = useState(false)
    const [nextId, setNextId] = useState(4)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleAnimate = () => {
        setIsAnimating(true)

        const nextContentType = ((cards[2].contentType % 3) + 1) as 1 | 2 | 3

        setCards([...cards.slice(1), { id: nextId, contentType: nextContentType }])
        setNextId((prev) => prev + 1)
        setIsAnimating(false)
    }

    return (
        <div className="flex w-full flex-col items-center justify-center pt-2">
            <div className="relative h-[380px] w-full overflow-hidden sm:w-[644px]">
                <AnimatePresence initial={false}>
                    {cards.slice(0, 3).map((card, index) => (
                        <AnimatedCard key={card.id} card={card} index={index} isAnimating={isAnimating} />
                    ))}
                </AnimatePresence>
            </div>

            <div className="relative z-10 -mt-px flex w-full items-center justify-center gap-4 border-t border-border py-4">
                <button
                    onClick={handleAnimate}
                    className="flex h-[50px] cursor-pointer select-none items-center justify-center gap-1 overflow-hidden rounded-lg border border-border bg-background px-6 font-medium text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-[0.98]"
                >
                    New Post
                </button>

                <button
                    className="group flex min-w-[180px] decoration-0 transition-transform active:scale-95 cursor-pointer outline-none w-auto h-[50px] pr-6 pl-6 relative items-center justify-center"
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "8px", border: "none" }}
                >
                    {/* Glow Layer */}
                    <div className="pointer-events-none transition-opacity ease-in-out duration-[1200ms] group-hover:opacity-0 opacity-100 absolute top-0 right-0 bottom-0 left-0" style={{ background: "radial-gradient(15% 50% at 50% 100%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)", borderRadius: "8px", filter: "blur(15px)" }}></div>

                    {/* Glow Hover Layer */}
                    <div className="pointer-events-none transition-opacity ease-in-out duration-[1200ms] group-hover:opacity-100 opacity-0 absolute top-0 right-0 bottom-0 left-0" style={{ background: "radial-gradient(60.6% 50% at 50% 100%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)", borderRadius: "8px", filter: "blur(18px)" }}></div>

                    {/* Stroke Layer */}
                    <div className="pointer-events-none will-change-auto transition-opacity ease-in-out duration-[1200ms] group-hover:opacity-0 opacity-100 absolute top-0 right-0 bottom-0 left-0" style={{ background: "radial-gradient(10.7% 50% at 50% 100%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)", borderRadius: "8px" }}></div>

                    {/* Stroke Hover Layer */}
                    <div className="pointer-events-none will-change-auto transition-opacity ease-in-out duration-[1200ms] group-hover:opacity-100 opacity-0 absolute top-0 right-0 bottom-0 left-0" style={{ background: "radial-gradient(60.1% 50% at 50% 100%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)", borderRadius: "8px" }}></div>

                    {/* Fill Layer */}
                    <div className="rounded-[7px] absolute top-[1px] right-[1px] bottom-[1px] left-[1px] bg-black opacity-100"></div>

                    {/* Content Layer */}
                    <div className="relative z-20 flex items-center justify-center gap-2 opacity-100">
                        <span className="m-0 p-0 font-sans text-[15px] font-medium text-white tracking-wide" style={{ WebkitFontSmoothing: "antialiased", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                            Read More
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right transition-transform duration-300 group-hover:translate-x-1">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </div>
                </button>
            </div>

            <BlogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}
