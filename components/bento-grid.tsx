"use client"

import type React from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { BookOpen, Shield, Server, Trash2, Leaf, Zap, MapPin, Search } from "lucide-react"
import Link from "next/link"

const intelligenceCards = [
  {
    icon: BookOpen,
    stat: "44",
    label: "Recycling Articles",
    description: "Device-specific workflows, material recovery, precious metals",
    accent: "#00d084",
    href: "/wiki/recycling",
  },
  {
    icon: Shield,
    stat: "22",
    label: "Compliance Guides",
    description: "CPCB, DPDP, KSPCB, EPR, and WEEE rules frameworks",
    accent: "#13b5ec",
    href: "/wiki/compliance",
  },
  {
    icon: Server,
    stat: "ITAD",
    label: "Enterprise Disposition",
    description: "Certified IT asset disposal with chain-of-custody",
    accent: "#8b5cf6",
    href: "/wiki/itad",
  },
  {
    icon: Trash2,
    stat: "NIST",
    label: "Data Destruction",
    description: "800-88 sanitization, SSD vs HDD, certified destruction",
    accent: "#ef4444",
    href: "/wiki/data-destruction",
  },
  {
    icon: Leaf,
    stat: "ESG",
    label: "Sustainability Intelligence",
    description: "Circular economy metrics, carbon footprint, CSR reporting",
    accent: "#22c55e",
    href: "/wiki/esg",
  },
  {
    icon: Zap,
    stat: "Au/Ag",
    label: "Material Science",
    description: "Gold, silver, copper recovery economics and processes",
    accent: "#f59e0b",
    href: "/wiki/materials",
  },
  {
    icon: MapPin,
    stat: "14",
    label: "Kerala Localities",
    description: "Kochi, Trivandrum, Kozhikode and all 14 district guides",
    accent: "#06b6d4",
    href: "/wiki/localities",
  },
  {
    icon: Search,
    stat: "156",
    label: "Glossary Terms",
    description: "Searchable A–Z definitions for every e-waste concept",
    accent: "#a78bfa",
    href: "/wiki/glossary",
  },
]

function IntelCard({
  card,
  index,
}: {
  card: (typeof intelligenceCards)[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <Link href={card.href}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.4, 0.25, 1] }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false) }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative group cursor-pointer h-full"
      >
        {/* Glow border */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{
            background: `linear-gradient(135deg, ${card.accent}35, transparent, ${card.accent}35)`,
            filter: "blur(6px)",
          }}
        />

        <div className="relative bg-[#0f1f1a] rounded-2xl p-5 border border-[#00d084]/12 overflow-hidden h-full min-h-[148px] hover:border-[#00d084]/30 transition-colors">
          {/* Shine */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
            animate={
              isHovered
                ? { background: ["linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.025) 25%, transparent 30%)", "linear-gradient(105deg, transparent 70%, rgba(255,255,255,0.025) 75%, transparent 80%)"] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 flex flex-col h-full">
            <motion.div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${card.accent}18` }}
              whileHover={{ scale: 1.08 }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: card.accent }}
                animate={isHovered ? { opacity: [0.1, 0.25, 0.1], scale: [1, 1.15, 1] } : { opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <card.icon className="w-4 h-4 relative z-10" style={{ color: card.accent }} />
            </motion.div>

            <div className="flex-1">
              <motion.div
                className="text-2xl font-black tracking-tight"
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.15 + index * 0.07 }}
                style={{ color: card.accent }}
              >
                {card.stat}
              </motion.div>
              <h3 className="text-sm font-semibold text-[#ecfdf5] mt-1">{card.label}</h3>
              <p className="text-xs text-[#ecfdf5]/40 mt-1 font-mono leading-relaxed">{card.description}</p>
            </div>

            <motion.div
              className="h-[1.5px] rounded-full mt-4"
              style={{ backgroundColor: card.accent }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 + index * 0.07 }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export function BentoGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="wiki-domains" className="relative py-20 bg-[#07120f] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#07120f] via-[#050e0b] to-[#07120f]" />

      <div ref={ref} className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-block font-mono text-[#00d084] text-[10px] tracking-[0.35em] uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Knowledge Infrastructure
          </motion.span>

          <div className="overflow-hidden mt-2">
            <motion.h2
              className="text-3xl md:text-5xl font-black text-[#ecfdf5] tracking-tight"
              initial={{ y: 60 }}
              animate={isInView ? { y: 0 } : { y: 60 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.15 }}
            >
              Semantic Intelligence Grid
            </motion.h2>
          </div>

          <motion.p
            className="text-[#ecfdf5]/45 font-mono text-sm mt-3 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Entity-linked knowledge across 8 domains. Built for AI retrieval, human discovery, and compliance grounding.
          </motion.p>

          <motion.div
            className="h-[1.5px] w-10 bg-[#00d084] mx-auto mt-4 rounded-full"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {intelligenceCards.map((card, index) => (
            <IntelCard key={card.label} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
