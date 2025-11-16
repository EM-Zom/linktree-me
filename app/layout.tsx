import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Links Emergência - Médicos Emergencistas',
  description: 'Plataforma de links para médicos emergencistas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

