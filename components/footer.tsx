"use client"

import { motion, useInView } from "framer-motion"
import { useState, useRef } from "react"
import Link from "next/link"
import { Recycle, ArrowRight } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
}

const footerLinks = [
  {
    title: "Wiki",
    links: [
      { label: "Recycling Encyclopedia", href: "/wiki/recycling" },
      { label: "Compliance Standards", href: "/wiki/compliance" },
      { label: "ITAD Knowledge Base", href: "/wiki/itad" },
      { label: "Data Destruction", href: "/wiki/data-destruction" },
      { label: "Glossary", href: "/wiki/glossary" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Schedule Pickup", href: "/services/schedule-pickup" },
      { label: "Battery Recycling", href: "/services/battery-recycling" },
      { label: "Data Destruction", href: "/services/data-destruction" },
      { label: "Enterprise ITAD", href: "/services/enterprise-itad" },
      { label: "Recycling Kochi", href: "/services/recycling-kochi" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About EWasteKochi", href: "#" },
      { label: "Kerala Collection Network", href: "/wiki/localities" },
      { label: "ESG & Sustainability", href: "/wiki/esg" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "CPCB Compliance", href: "/wiki/compliance/e-waste-compliance-india" },
    ],
  },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, margin: "-80px" })

  const handleSubmit = () => {
    if (!email.trim()) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3500)
    setEmail("")
  }

  return (
    <footer ref={footerRef} className="relative bg-[#07120f] pt-16 pb-6 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00d084]/25 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* CTA headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] overflow-hidden">
            <motion.span
              className="block text-[#ecfdf5]"
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
            >
              READY TO
            </motion.span>
            <motion.span
              className="block text-[#00d084]"
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1], delay: 0.1 }}
            >
              RECYCLE RIGHT?
            </motion.span>
          </h2>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="max-w-lg mx-auto mb-14"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@company.com"
              className="flex-1 bg-[#0f1f1a] border-2 border-[#00d084]/20 rounded-xl px-4 py-3 text-[#ecfdf5] placeholder:text-[#ecfdf5]/30 font-mono text-sm focus:outline-none focus:border-[#00d084]/50 transition-all duration-300"
            />
            <motion.button
              className="bg-[#00d084] text-[#07120f] px-6 py-3 rounded-xl font-bold text-sm tracking-wide whitespace-nowrap flex items-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={handleSubmit}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10">
                {submitted ? "Subscribed!" : "Get Compliance Updates"}
              </span>
              {!submitted && <ArrowRight className="w-4 h-4 relative z-10" />}
            </motion.button>
          </div>
          <p className="text-[#ecfdf5]/30 font-mono text-xs mt-2 text-center">
            Regulations, recycling guides, Kerala pickup updates. No spam.
          </p>
        </motion.div>

        {/* Links grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-[#00d084]/10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="font-bold text-[#ecfdf5] text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((item) => (
                  <li key={item.label}>
                    <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                      <Link
                        href={item.href}
                        className="text-[#ecfdf5]/45 hover:text-[#00d084] font-mono text-xs transition-colors inline-block"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-[#00d084]/10 gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#00d084]/15 border border-[#00d084]/30 flex items-center justify-center">
              <Recycle className="w-3.5 h-3.5 text-[#00d084]" />
            </div>
            <span className="text-base font-black">
              <span className="text-[#ecfdf5]">EWaste</span>
              <span className="text-[#00d084]">Kochi</span>
            </span>
          </Link>

          <p className="text-[#ecfdf5]/25 font-mono text-xs">
            © 2026 EWasteKochi. CPCB Authorised · Kerala, India
          </p>

          <p className="text-[#ecfdf5]/25 font-mono text-xs">
            Circular economy · environmental intelligence
          </p>
        </motion.div>
      </div>

      {/* Watermark */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[12rem] md:text-[22rem] font-black text-[#ecfdf5]/[0.015] pointer-events-none select-none leading-none"
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        EWK
      </motion.div>
    </footer>
  )
}
