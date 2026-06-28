"use client"

import * as React from "react"
import { useRef } from "react";
import {
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";

import { cn } from "../../lib/utils";

export interface AnimatedDockProps {
    className?: string;
    items: DockItemData[];
}

export interface DockItemData {
    link: string;
    Icon: React.ReactNode;
    target?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const AnimatedDock = ({ className, items }: AnimatedDockProps) => {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto flex h-16 items-end gap-4 rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg px-4 pb-3",
                className,
            )}
        >
            {items.map((item, index) => (
                <DockItem key={index} mouseX={mouseX}>
                    {item.onClick ? (
                        <button
                            onClick={item.onClick}
                            className="grow flex items-center justify-center w-full h-full text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                            {item.Icon}
                        </button>
                    ) : (
                        <a
                            href={item.link}
                            target={item.target}
                            className="grow flex items-center justify-center w-full h-full text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                            {item.Icon}
                        </a>
                    )}
                </DockItem>
            ))}
        </motion.div>
    );
};

interface DockItemProps {
    mouseX: MotionValue<number>;
    children: React.ReactNode;
}

export const DockItem = ({ mouseX, children }: DockItemProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const iconScale = useTransform(width, [40, 80], [1, 1.5]);
    const iconSpring = useSpring(iconScale, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square w-10 flex items-center justify-center"
        >
            <motion.div
                style={{ scale: iconSpring }}
                className="flex items-center justify-center w-full h-full grow"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};
