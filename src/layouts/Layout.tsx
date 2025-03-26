// src/layouts/Layout.tsx
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <header>
        <h1>Gestora de Atendimentos</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>© 2025 - Gestora de Atendimentos</p>
      </footer>
    </div>
  )
}

export default Layout
