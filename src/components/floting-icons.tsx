"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function FloatingIcons() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const icons = [
    { color: "bg-amber-500", top: "10%", left: "10%" },
    { color: "bg-green-500", top: "20%", right: "15%" },
    { color: "bg-blue-500", bottom: "30%", left: "20%" },
    { color: "bg-purple-500", bottom: "20%", right: "25%" },
    { color: "bg-red-500", top: "40%", left: "30%" },
    { color: "bg-yellow-500", bottom: "40%", right: "10%" },
  ]

  return (
    <section className="container mx-auto px-4 py-20 text-center relative">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className={`absolute w-10 h-10 ${icon.color} rounded-full flex items-center justify-center shadow-lg`}
          style={{
            top: icon.top,
            left: icon.left,
            right: icon.right,
            bottom: icon.bottom,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: index * 0.1,
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2" />
            <path d="M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            <path d="M18 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
        </motion.div>
      ))}

      <motion.div
        className="text-5xl md:text-6xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        1,000+ users
      </motion.div>
    </section>
  )
}
