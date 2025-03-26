'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../lib/supabaseClient'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('Erro ao fazer login: ' + error.message)
    } else {
      router.push('/dashboard') // Redireciona para o painel de controle
    }
    
    setCarregando(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            disabled={carregando}
            className={`w-full p-2 text-white font-semibold rounded ${carregando ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {erro && <p className="text-red-500 text-sm mt-2 text-center">{erro}</p>}
      </div>
    </div>
  )
}

export default Login
