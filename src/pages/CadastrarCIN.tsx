'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../lib/supabaseClient'
import Layout from '../layouts/Layout'

const CadastrarCIN = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cpf, setCpf] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: session } = await supabase.auth.getSession()

      if (!session?.session?.user) {
        router.push('/login')
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
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    const cpfLimpo = cpf.replace(/\D/g, '')

    const { data: atendimento, error: atendimentoError } = await supabase
      .from('atendimentos')
      .select('nome, cpf')
      .eq('cpf', cpfLimpo)
      .single()

    if (atendimentoError || !atendimento) {
      setErro('CPF não encontrado no banco de atendimentos ou erro na consulta.')
      return
    }

    const diaAtual = new Date().toISOString()

    const { error } = await supabase.from('cins').insert([
      {
        cpf: atendimento.cpf,
        nome: atendimento.nome,
        status: 'pronta',
        created_at: diaAtual,
        updated_at: diaAtual,
      },
    ])

    if (error) {
      setErro('Erro ao cadastrar a CIN: ' + error.message)
    } else {
      setSucesso('CIN cadastrada com sucesso!')
      setCpf('')
    }
  }

  if (carregando) {
    return <p>Carregando...</p>
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Cadastro de CIN</h1>
        <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white', padding: '8px 12px', border: 'none', cursor: 'pointer' }}>
          Sair
        </button>
      </div>

      <p>Usuário logado: {user?.email}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF (somente números)"
          required
        />
        <button type="submit">Cadastrar CIN</button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
    </Layout>
  )
}

export default CadastrarCIN