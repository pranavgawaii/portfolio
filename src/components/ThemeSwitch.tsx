import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"
import { motion, AnimatePresence } from "motion/react"

export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX
    const y = e.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )

    // @ts-ignore
    if (!document.startViewTransition) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
      return
    }

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]

      document.documentElement.animate(
        {
          clipPath: resolvedTheme === "dark" ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement:
            resolvedTheme === "dark"
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)",
        }
      )
    })
  }

  if (!mounted) {
    return (
      <button className={`p-2 rounded-full bg-gray-200 dark:bg-gray-800 ${className}`}>
        <span className="sr-only">Toggle theme</span>
        <div className="w-6 h-6" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white/50 dark:bg-white/5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group ${className}`}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          {resolvedTheme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ y: 20, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="w-5 h-5 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: 20, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="w-5 h-5 text-indigo-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle hover glow */}
      <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}
