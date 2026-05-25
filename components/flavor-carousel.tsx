"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Shield, Server, Trash2, Leaf, Zap, MapPin, Hash } from "lucide-react"

const domains = [
  {
    slug: "recycling",
    name: "Recycling Encyclopedia",
    tagline: "Device-specific workflows",
    count: 44,
    icon: BookOpen,
    color: "#00d084",
    bg: "from-[#00d084]/15 to-[#00d084]/5",
    border: "border-[#00d084]/25",
    features: ["Smartphone components", "Battery recycling", "PCB sorting", "Material recovery"],
  },
  {
    slug: "compliance",
    name: "Compliance Standards",
    tagline: "CPCB · KSPCB · EPR · DPDP",
    count: 22,
    icon: Shield,
    color: "#13b5ec",
    bg: "from-[#13b5ec]/15 to-[#13b5ec]/5",
    border: "border-[#13b5ec]/25",
    features: ["WEEE Rules 2016", "EPR certification", "Hazardous waste", "Cross-border rules"],
  },
  {
    slug: "itad",
    name: "ITAD Knowledge Base",
    tagline: "Enterprise asset disposition",
    count: 2,
    icon: Server,
    color: "#8b5cf6",
    bg: "from-[#8b5cf6]/15 to-[#8b5cf6]/5",
    border: "border-[#8b5cf6]/25",
    features: ["Server disposal", "Chain-of-custody", "Audit trails", "Certified ITAD"],
  },
  {
    slug: "data-destruction",
    name: "Data Destruction",
    tagline: "NIST 800-88 · Sanitization",
    count: 2,
    icon: Trash2,
    color: "#ef4444",
    bg: "from-[#ef4444]/15 to-[#ef4444]/5",
    border: "border-[#ef4444]/25",
    features: ["NIST 800-88", "SSD vs HDD", "Degaussing", "Physical destruction"],
  },
  {
    slug: "esg",
    name: "ESG Intelligence",
    tagline: "Circular economy · Sustainability",
    count: 1,
    icon: Leaf,
    color: "#22c55e",
    bg: "from-[#22c55e]/15 to-[#22c55e]/5",
    border: "border-[#22c55e]/25",
    features: ["Carbon footprint", "ESG reporting", "Circular economy", "LCA metrics"],
  },
  {
    slug: "materials",
    name: "Material Intelligence",
    tagline: "Precious metals · Recovery",
    count: 1,
    icon: Zap,
    color: "#f59e0b",
    bg: "from-[#f59e0b]/15 to-[#f59e0b]/5",
    border: "border-[#f59e0b]/25",
    features: ["Gold recovery", "Silver extraction", "Copper economics", "Rare earths"],
  },
  {
    slug: "localities",
    name: "Kerala Localities",
    tagline: "14 district-level guides",
    count: 14,
    icon: MapPin,
    color: "#06b6d4",
    bg: "from-[#06b6d4]/15 to-[#06b6d4]/5",
    border: "border-[#06b6d4]/25",
    features: ["Kochi guide", "KSPCB rules", "All 14 districts", "Local regulations"],
  },
  {
    slug: "glossary",
    name: "Glossary",
    tagline: "156 definitions · A–Z",
    count: 156,
    icon: Hash,
    color: "#a78bfa",
    bg: "from-[#a78bfa]/15 to-[#a78bfa]/5",
    border: "border-[#a78bfa]/25",
    features: ["EPR · ITAD · CPCB", "Technical terms", "Regulatory acronyms", "Entity-linked"],
  },
]

function DomainCard({ domain, index }: { domain: (typeof domains)[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.4, 0.25, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-shrink-0 w-72"
    >
      <Link href={`/wiki/${domain.slug}`}>
        <div
          className={`relative rounded-2xl p-6 border ${domain.border} bg-[#0f1f1a] overflow-hidden cursor-pointer group h-full`}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={hovered ? { boxShadow: `0 0 32px ${domain.color}20` } : { boxShadow: "none" }}
            transition={{ duration: 0.3 }}
          />

          <div className="flex items-start justify-between mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${domain.color}18` }}
            >
              <domain.icon className="w-5 h-5" style={{ color: domain.color }} />
            </div>
            <div className="text-right">
              <div className="text-xl font-black" style={{ color: domain.color }}>
                {domain.count}
              </div>
              <div className="text-[10px] font-mono text-[#ecfdf5]/40">articles</div>
            </div>
          </div>

          <h3 className="font-black text-[#ecfdf5] text-base mb-1 tracking-tight">{domain.name}</h3>
          <p className="text-xs font-mono text-[#ecfdf5]/45 mb-4">{domain.tagline}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {domain.features.map((f) => (
              <span
                key={f}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                style={{ borderColor: `${domain.color}30`, color: `${domain.color}aa` }}
              >
                {f}
              </span>
            ))}
          </div>

          <motion.div
            className="flex items-center gap-1.5 text-xs font-bold"
            style={{ color: `${domain.color}99` }}
            animate={hovered ? { x: 4, color: domain.color } : { x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Explore domain <ArrowRight className="w-3.5 h-3.5" />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 h-[2px] rounded-full"
            style={{ backgroundColor: domain.color }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.32 }}
          />
        </div>
      </Link>
    </motion.div>
  )
}

export function FlavorCarousel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="domains" className="relative py-20 bg-[#07120f] overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00d084]/25 to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <motion.span
            className="font-mono text-[#00d084] text-[10px] tracking-[0.35em] uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Knowledge Domains
          </motion.span>

          <div className="flex items-end justify-between mt-2">
            <div className="overflow-hidden">
              <motion.h2
                className="text-3xl md:text-5xl font-black text-[#ecfdf5] tracking-tight"
                initial={{ y: 60 }}
                animate={isInView ? { y: 0 } : { y: 60 }}
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.15 }}
              >
                8 Pillars of{" "}
                <span className="text-[#00d084]">Intelligence</span>
              </motion.h2>
            </div>
            <Link
              href="/wiki"
              className="hidden md:flex items-center gap-1.5 text-sm font-bold text-[#00d084]/60 hover:text-[#00d084] transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.p
            className="text-sm text-[#ecfdf5]/40 font-mono mt-2 max-w-xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Semantic knowledge spanning recycling science, regulatory compliance, enterprise ITAD,
            and geo-specific locality intelligence.
          </motion.p>
        </motion.div>

        <div className="overflow-x-auto pb-6 -mx-6 px-6" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-4" style={{ minWidth: "max-content" }}>
            {domains.map((domain, index) => (
              <DomainCard key={domain.slug} domain={domain} index={index} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00d084]/20 to-transparent" />
    </section>
  )
}
