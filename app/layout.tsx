import './globals.css'
import React from 'react'

export const metadata = {
  title: 'WIKI EWASTE',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>{children}</div>
      </body>
    </html>
  )
}
