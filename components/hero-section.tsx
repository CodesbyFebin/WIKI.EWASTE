"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Truck, Building2 } from "lucide-react"

const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }

const stats = [
  { value: "242+", label: "Knowledge Articles" },
  { value: "7", label: "Semantic Domains" },
  { value: "156+", label: "Glossary Definitions" },
  { value: "Kerala", label: "Pickup Network" },
]

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const y = useSpring(rawY, springConfig)
  const rawOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const opacity = useSpring(rawOpacity, springConfig)
  const rawTextX1 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const textX1 = useSpring(rawTextX1, springConfig)
  const rawTextX2 = useTransform(scrollYProgress, [0, 1], [0, 80])
  const textX2 = useSpring(rawTextX2, springConfig)

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#07120f] noise-overlay scan-overlay"
    >
      {/* Ambient orbs */}
      <motion.div
        className="absolute top-24 left-16 w-56 h-56 rounded-full bg-[#00d084]/12 blur-[80px]"
        animate={{ x: [0, 28, 0], y: [0, -24, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-20 w-72 h-72 rounded-full bg-[#13b5ec]/10 blur-[100px]"
        animate={{ x: [0, -36, 0], y: [0, 28, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#8b5cf6]/5 blur-[120px]"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,208,132,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,208,132,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 bg-[#00d084]/10 border border-[#00d084]/30 text-[#00d084] px-4 py-2 rounded-full text-xs font-mono tracking-widest">
            <motion.span
              className="w-2 h-2 bg-[#00d084] rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            AI-NATIVE ENVIRONMENTAL INTELLIGENCE PLATFORM
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center space-y-3 mb-8">
          <motion.h1
            style={{ x: textX1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#ecfdf5] leading-[0.9]"
          >
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              className="block"
            >
              INDIA&apos;S
            </motion.span>
          </motion.h1>
          <motion.h1
            style={{ x: textX2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
          >
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              className="block text-[#00d084]"
            >
              RECYCLING
            </motion.span>
          </motion.h1>
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#ecfdf5] leading-[0.9]"
          >
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              className="block"
            >
              INTELLIGENCE
            </motion.span>
          </motion.h1>
        </div>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-center text-lg md:text-xl font-mono text-[#ecfdf5]/55 max-w-2xl mx-auto tracking-tight mb-10"
        >
          Enterprise recycling · ITAD · data destruction · compliance knowledge
          infrastructure for Kerala and India.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          <Link href="/wiki">
            <motion.button
              className="flex items-center gap-2 bg-[#00d084] text-[#07120f] px-7 py-3.5 rounded-full font-bold text-sm tracking-wide relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.55 }}
              />
              <BookOpen className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Explore Wiki</span>
            </motion.button>
          </Link>

          <Link href="/services/schedule-pickup">
            <motion.button
              className="flex items-center gap-2 border border-[#00d084]/40 text-[#ecfdf5] px-7 py-3.5 rounded-full font-bold text-sm tracking-wide hover:border-[#00d084] hover:text-[#00d084] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Truck className="w-4 h-4" />
              Schedule Pickup
            </motion.button>
          </Link>

          <Link href="/services/enterprise-itad">
            <motion.button
              className="flex items-center gap-2 border border-[#13b5ec]/30 text-[#13b5ec] px-7 py-3.5 rounded-full font-bold text-sm tracking-wide hover:border-[#13b5ec] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Building2 className="w-4 h-4" />
              Enterprise ITAD
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#00d084]/15 rounded-2xl overflow-hidden border border-[#00d084]/15"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-[#07120f] px-6 py-5 text-center group hover:bg-[#0f1f1a] transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + i * 0.08 }}
            >
              <div className="text-2xl md:text-3xl font-black text-[#00d084]">{stat.value}</div>
              <p className="text-xs font-mono text-[#ecfdf5]/45 mt-1 tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border-2 border-[#ecfdf5]/20 rounded-full flex justify-center pt-1.5"
        >
          <motion.div
            className="w-1 h-2 bg-[#00d084]/60 rounded-full"
            animate={{ y: [0, 6, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
