import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

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
      className={`p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors hover:bg-gray-300 dark:hover:bg-gray-700 ${className}`}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-6 h-6 text-gray-800 dark:text-gray-200" />
      ) : (
        <Moon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  )
}
