"use client"

import { Utensils } from "lucide-react"
import { motion } from "framer-motion"

export function Logo({ className }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center justify-center w-8 h-8 bg-amber-400 rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Utensils className="w-4 h-4 text-white" />
      </motion.div>
      <span className="font-bold text-xl">Mealtracker</span>
    </motion.div>
  )
}