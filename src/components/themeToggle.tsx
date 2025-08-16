"use client"

import { useTheme } from "@/utils/Themes/ThemeProvider"
import { Moon, Sun,  } from "lucide-react"

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()



  return (
    <div className=" w-9  flex justify-center items-center rounded-xl">
      <button
        onClick={toggleTheme}
        className=" flex items-center gap-2 px-4  duration-300 ease-in-out py-1 font-base  tracking-tighter hover:rounded-xl  "
      >
        {theme === 'light' ? (
          <Moon className="text-gray-800" />
        ) : (
          <Sun className="text-yellow-400" />
        )}
      </button>

    </div>
  )
}
