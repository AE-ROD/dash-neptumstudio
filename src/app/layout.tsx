import type { Metadata } from 'next'
import { Nunito, DM_Sans, Outfit, Cormorant_Garamond } from 'next/font/google'
import { PanelProvider } from '@/context/PanelContext'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800', '900'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'NeptumStudio Panel',
  description: 'Panel de control de NeptumStudio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${nunito.variable} ${dmSans.variable} ${outfit.variable} ${cormorant.variable}`}>
      <body><PanelProvider>{children}</PanelProvider></body>
    </html>
  )
}
