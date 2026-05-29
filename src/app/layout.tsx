import type { Metadata } from 'next'
import { Nunito, DM_Sans } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'NeptumStudio Panel',
  description: 'Panel de control de NeptumStudio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${nunito.variable} ${dmSans.variable}`}>
      <body><PanelProvider>{children}</PanelProvider></body>
    </html>
  )
}
