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

    // Busca o nome e CPF na tabela 'atendimentos'
    const { data: atendimento, error: atendimentoError } = await supabase
      .from('atendimentos')
      .select('nome, cpf')
      .eq('cpf', cpf)
      .single() // A busca vai retornar um único registro ou nenhum

    if (atendimentoError) {
      alert('Erro ao buscar atendimento: ' + atendimentoError.message)
      return
    }

    if (!atendimento) {
      alert('CPF não encontrado no banco de atendimentos.')
      return
    }

    // Pegando a data e hora atual
    const diaAtual = new Date().toISOString()

    // Enviando os dados para a tabela 'cins'
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
      alert('Erro ao cadastrar a CIN: ' + error.message)
    } else {
      setSucesso('CIN cadastrada com sucesso!')
      setCpf('') // Limpa o campo CPF
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

      {sucesso && <p>{sucesso}</p>}
    </Layout>
  )
}

export default CadastrarCIN
