"use client";

import React, { useId } from "react";
import { motion } from "motion/react";
import { playClick } from "../../lib/clickSound";

interface Props {
  isDark: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

/**
 * Theme toggle icon — sun morphs into moon and back.
 * Tight spring so the icon animation feels snappy.
 * Page theme switch is instant via next-themes toggling .dark on <html>.
 */
export function AnimatedThemeToggler({ isDark, onToggle }: Props) {
  const rawId = useId();
  const maskId = `att${rawId.replace(/:/g, "")}`;

  // Very tight spring — snappy not sluggish
  const snap = { type: "spring" as const, stiffness: 600, damping: 36, mass: 0.6 };

  return (
    <motion.button
      onClick={(e) => { playClick(); onToggle(e); }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        color: "currentColor",
        // Prevent any CSS color transition on button itself
        transition: "transform 0ms",
      }}
      aria-label="Toggle theme"
    >
      <motion.svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{ rotate: isDark ? 270 : 0 }}
        transition={snap}
        style={{ overflow: "visible", transition: "none" }}
      >
        {/* Mask carves a bite for the moon crescent */}
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <motion.circle
            initial={false}
            animate={{ cx: isDark ? 17 : 33, cy: isDark ? 8 : 0 }}
            transition={snap}
            r="9"
            fill="black"
          />
        </mask>

        {/* Body: large moon vs small sun */}
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          stroke="none"
          mask={`url(#${maskId})`}
          initial={false}
          animate={{ r: isDark ? 9 : 5 }}
          transition={snap}
        />

        {/* Sun rays */}
        <motion.g
          initial={false}
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.3 : 1, rotate: isDark ? -40 : 0 }}
          transition={snap}
          style={{ transformOrigin: "12px 12px" }}
        >
          <line x1="12" y1="1"  x2="12" y2="3"  />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="1"  y1="12" x2="3"  y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="5.64"  y1="5.64"  x2="4.22"  y2="4.22"  />
          <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
          <line x1="5.64"  y1="18.36" x2="4.22"  y2="19.78" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        </motion.g>
      </motion.svg>
    </motion.button>
  );
}

export default AnimatedThemeToggler;
