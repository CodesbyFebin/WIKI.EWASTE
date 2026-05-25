"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { Hospital, GraduationCap, Building2, Landmark, ArrowRight } from "lucide-react"

const segments = [
  {
    icon: Hospital,
    title: "Hospitals & Healthcare",
    description:
      "HIPAA-aligned data destruction, medical device recycling, and compliance-ready ITAD for healthcare institutions.",
    cta: "Enterprise ITAD",
    href: "/services/enterprise-itad",
    color: "#ef4444",
  },
  {
    icon: GraduationCap,
    title: "Schools & Universities",
    description:
      "Bulk device collection, free pickup for educational institutions, and transparent material recovery reports.",
    cta: "Schedule Pickup",
    href: "/services/schedule-pickup",
    color: "#00d084",
  },
  {
    icon: Building2,
    title: "IT Parks & Startups",
    description:
      "End-to-end ITAD for Infopark, Technopark, and SoftwareTech Park tenants. Certificate of destruction included.",
    cta: "View ITAD",
    href: "/services/enterprise-itad",
    color: "#13b5ec",
  },
  {
    icon: Landmark,
    title: "Government & PSUs",
    description:
      "CPCB-compliant disposal with full audit trails. Meets e-waste management rules for public sector organisations.",
    cta: "Compliance Guide",
    href: "/wiki/compliance",
    color: "#8b5cf6",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 90, damping: 18 },
  },
}

export function ActivationsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="enterprise" className="relative py-20 bg-[#0f1f1a] overflow-hidden">
      {/* Top separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00d084]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-12"
        >
          <motion.span
            className="font-mono text-[#00d084] text-[10px] tracking-[0.35em] uppercase inline-block"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Collection Ecosystem
          </motion.span>

          <h2 className="text-3xl md:text-5xl font-black text-[#ecfdf5] tracking-tighter mt-2 overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1], delay: 0.2 }}
            >
              ENTERPRISE{" "}
            </motion.span>
            <motion.span
              className="text-[#00d084] inline-block"
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1], delay: 0.3 }}
            >
              SEGMENTS
            </motion.span>
          </h2>

          <motion.p
            className="text-sm text-[#ecfdf5]/45 font-mono mt-3 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Tailored recycling and compliance solutions for every sector of the Kerala economy.
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {segments.map((seg) => (
            <motion.div
              key={seg.title}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 400, damping: 17 } }}
              className="group rounded-2xl p-6 cursor-pointer relative overflow-hidden border border-[#00d084]/12 bg-[#07120f] hover:border-[#00d084]/30 transition-colors"
            >
              {/* Hover fill */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `${seg.color}08` }}
              />

              <div className="relative z-10">
                <motion.div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{ backgroundColor: `${seg.color}18` }}
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <seg.icon className="w-5 h-5" style={{ color: seg.color }} />
                </motion.div>

                <h3 className="text-base font-black text-[#ecfdf5] tracking-tight mb-2">
                  {seg.title}
                </h3>
                <p className="text-[#ecfdf5]/45 font-mono text-xs leading-relaxed mb-5">
                  {seg.description}
                </p>

                <Link href={seg.href}>
                  <motion.div
                    className="flex items-center gap-1.5 text-xs font-bold transition-colors duration-300"
                    style={{ color: `${seg.color}99` }}
                    whileHover={{ x: 4, color: seg.color }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {seg.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-mono text-[#ecfdf5]/30"
        >
          {["CPCB Authorised Recycler", "KSPCB Compliant", "ISO 14001 Process", "NIST 800-88 Data Destruction", "Certificate of Destruction"].map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00d084]/50" />
              {badge}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00d084]/20 to-transparent" />
    </section>
  )
}
