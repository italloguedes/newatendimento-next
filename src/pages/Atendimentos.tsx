'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../lib/supabaseClient'
import Layout from '../layouts/Layout'

const Atendimentos = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [solicitante, setSolicitante] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: session } = await supabase.auth.getSession()

      if (!session?.session?.user) {
        router.push('/login') // Redireciona para login se não estiver autenticado
      } else {
        setUser(session.session.user)
        setCarregando(false)
      }
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session?.user) {
        router.push('/login')
      } else {
        setUser(session.user)
        setCarregando(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login') // Redireciona para a página de login após o logout
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // Pegando a data e hora atual
    const diaAtual = new Date().toISOString()
    const horario = new Date().toISOString()  // Aqui é o horário atual
  
    // Enviando os dados para o Supabase
    const { data, error } = await supabase.from('atendimentos').insert([
      {
        nome,
        cpf,
        email,
        solicitante,
        dia_atual: diaAtual, // A data e hora do cadastro
        horario,             // Salvando o horário
        usuario_id: user?.id,   // ID do usuário logado
        created_at: diaAtual, // Coluna de criação
        updated_at: diaAtual, // Coluna de atualização
      },
    ])
  
    if (error) {
      alert('Erro ao cadastrar atendimento: ' + error.message)
    } else {
      setSucesso('Atendimento cadastrado com sucesso!')
      setNome('')
      setCpf('')
      setEmail('')
      setSolicitante('')
    }
  }

  if (carregando) {
    return <p>Carregando...</p>
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Cadastro de Atendimentos</h1>
        <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white', padding: '8px 12px', border: 'none', cursor: 'pointer' }}>
          Sair
        </button>
      </div>

      <p>Usuário logado: {user?.email}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF (somente números)"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={solicitante}
          onChange={(e) => setSolicitante(e.target.value)}
          placeholder="Responsável"
          required
        />
        <button type="submit">Cadastrar Atendimento</button>
      </form>

      {sucesso && <p>{sucesso}</p>}
    </Layout>
  )
}

export default Atendimentos
