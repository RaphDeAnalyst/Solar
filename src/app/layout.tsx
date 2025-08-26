import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Solar Calculator Nigeria - Calculate Your Solar Power Needs',
  description: 'Calculate the perfect solar system for your Nigerian home. Get instant quotes for solar panels, inverters, batteries and complete solar kits. Mobile-friendly solar calculator.',
  keywords: 'solar calculator Nigeria, solar panels Nigeria, solar system cost, inverter calculator, battery calculator, Lagos solar, Abuja solar',
  authors: [{ name: 'Solar Solutions Nigeria' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Solar Calculator Nigeria - Calculate Your Solar Power Needs',
    description: 'Calculate the perfect solar system for your Nigerian home. Get instant quotes and recommendations.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Solar Calculator Nigeria',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Calculator Nigeria',
    description: 'Calculate your solar power needs for Nigerian homes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen bg-gray-50`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}