// src/pages/Login.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../lib/supabaseClient'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('Erro ao fazer login: ' + error.message)
    } else {
      router.push('/dashboard') // Redireciona para o painel de controle
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>

      {erro && <p>{erro}</p>}
    </div>
  )
}

export default Login
