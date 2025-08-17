"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

 function FloatingIcons() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const icons = [
    { color: "bg-amber-500", top: "10%", left: "10%", hideOnMobile: false },
    { color: "bg-green-500", top: "20%", right: "15%", hideOnMobile: false },
    { color: "bg-blue-500", bottom: "30%", left: "20%", hideOnMobile: true },
    { color: "bg-purple-500", bottom: "20%", right: "25%", hideOnMobile: true },
    { color: "bg-red-500", top: "40%", left: "30%", hideOnMobile: true },
    { color: "bg-yellow-500", bottom: "40%", right: "10%", hideOnMobile: true },
  ];

  return (
    <section className="container mx-auto px-4 py-20 text-center relative min-h-[200px] flex flex-col items-center justify-center">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className={`absolute ${icon.hideOnMobile ? 'hidden sm:flex' : 'flex'} w-6 h-6 sm:w-10 sm:h-10 ${icon.color} rounded-full items-center justify-center shadow-lg`}
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
            width="16" height="16" className="sm:w-5 sm:h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
        className="text-3xl sm:text-5xl md:text-6xl font-bold z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Meal Tracker
      </motion.div>
    </section>
  )
}
export default FloatingIcons;
