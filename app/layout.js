import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Vivum - Evidence Synthesis Platform',
  description: 'Real-time AI agent for research and evidence synthesis',
  icons: {
    icon: '/Vivum.png',
    shortcut: '/Vivum.png',
    apple: '/Vivum.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}