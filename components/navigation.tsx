"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useLenis } from "lenis/react"
import { Menu, X, Recycle } from "lucide-react"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id)
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -100 })
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { label: "Wiki", href: "/wiki" as const, isRoute: true },
    { label: "Services", href: "#services", isRoute: false },
    { label: "Enterprise", href: "#enterprise", isRoute: false },
    { label: "Compliance", href: "/wiki/compliance" as const, isRoute: true },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#07120f]/95 backdrop-blur-md border-b border-[#00d084]/15"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="w-8 h-8 rounded-lg bg-[#00d084]/15 border border-[#00d084]/30 flex items-center justify-center"
            whileHover={{ scale: 1.08, borderColor: "rgba(0,208,132,0.6)" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Recycle className="w-4 h-4 text-[#00d084]" />
          </motion.div>
          <motion.span
            className="text-lg font-black tracking-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="text-[#ecfdf5]">EWaste</span>
            <span className="text-[#00d084]">Kochi</span>
          </motion.span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) =>
            item.isRoute ? (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  className="text-sm font-medium tracking-wide text-[#ecfdf5]/70 hover:text-[#00d084] transition-colors relative group"
                >
                  {item.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#00d084] origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                </Link>
              </motion.div>
            ) : (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium tracking-wide text-[#ecfdf5]/70 hover:text-[#00d084] transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#00d084] origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25 }}
                />
              </motion.button>
            )
          )}
        </div>

        {/* CTA */}
        <Link href="/services/schedule-pickup">
          <motion.button
            className="hidden md:flex items-center gap-2 bg-[#00d084] text-[#07120f] px-5 py-2.5 rounded-full font-bold text-sm tracking-wide relative overflow-hidden"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3 }}
            />
            <span className="relative z-10">Schedule Pickup</span>
          </motion.button>
        </Link>

        {/* Mobile toggle */}
        <motion.button
          className="md:hidden p-2 text-[#ecfdf5]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="md:hidden bg-[#07120f]/97 backdrop-blur-md border-t border-[#00d084]/15 overflow-hidden"
          >
            <div className="px-6 py-5 space-y-4">
              {navLinks.map((item, i) =>
                item.isRoute ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-[#ecfdf5]/80 hover:text-[#00d084] text-lg font-medium py-2 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <motion.button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left text-[#ecfdf5]/80 hover:text-[#00d084] text-lg font-medium py-2 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    {item.label}
                  </motion.button>
                )
              )}
              <Link href="/services/schedule-pickup" onClick={() => setMobileMenuOpen(false)}>
                <motion.button
                  className="w-full bg-[#00d084] text-[#07120f] px-6 py-3 rounded-full font-bold text-sm tracking-wide mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Schedule Pickup
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
