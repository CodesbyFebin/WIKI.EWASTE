import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/lenis-provider"
import ClickSpark from "@/components/click-spark"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "EWasteKochi — India's E-Waste Intelligence Platform",
    template: "%s | EWasteKochi",
  },
  description:
    "Enterprise e-waste recycling, ITAD, data destruction, compliance intelligence, and circular economy knowledge for Kerala and India.",
  keywords: [
    "e-waste recycling",
    "ITAD India",
    "data destruction Kerala",
    "e-waste compliance",
    "circular economy",
    "CPCB EPR",
    "Kochi recycling",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://wiki.ewastekochi.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "EWasteKochi",
  },
  other: {
    "p:domain_verify": "c84fa25d41d05b9e8576e9253da10658",
  },
}

export const viewport: Viewport = {
  themeColor: "#00d084",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ClickSpark
          sparkColor="#00d084"
          sparkSize={12}
          sparkRadius={20}
          sparkCount={8}
          duration={400}
          easing="ease-out"
        >
          <LenisProvider>{children}</LenisProvider>
        </ClickSpark>
        <Analytics />
      </body>
    </html>
  )
}
