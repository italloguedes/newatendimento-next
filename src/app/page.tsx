// src/app/page.tsx
import Link from 'next/link'

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 to-blue-500">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Bem-vindo ao Sistema de Atendimentos
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Realize o cadastro e a gestão de atendimentos com facilidade.
        </p>
        <Link href="/Dashboard" className="inline-block px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 hover:bg-teal-700">
          Acessar o Painel de Controle
        </Link>
      </div>
    </div>
  )
}

export default Home
