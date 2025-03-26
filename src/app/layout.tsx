import type { Metadata } from 'next'
import { ReactNode } from 'react'
import './globals.css' // Importando estilos globais se houver

export const metadata: Metadata = {
  title: 'Sistema de Atendimentos',
  description: 'Gerencie seus atendimentos de forma prática',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children} {/* Renderiza as páginas dentro do <body> */}
      </body>
    </html>
  )
}
