'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../lib/supabaseClient'
import Layout from '../layouts/Layout'

const Dashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/login') // Redireciona para login se não estiver autenticado
      } else {
        setUser(session.user)
        setCarregando(false)
      }
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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

  if (carregando) {
    return (
      <Layout>
        <p className="text-center text-lg">Carregando...</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-semibold">Painel de Controle</h1>
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600">
          Sair
        </button>
      </div>

      <p className="mb-4 text-lg">Bem-vindo, <strong>{user?.email}</strong>!</p>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <button onClick={() => router.push('/Atendimentos')} className="btn-dashboard">
          Cadastrar Atendimento
        </button>
        <button onClick={() => router.push('/Relatorios')} className="btn-dashboard">
          Relatórios
        </button>
        <button onClick={() => router.push('/ConsultaAtendimento')} className="btn-dashboard">
          Consultar Atendimento
        </button>
        <button onClick={() => router.push('/CadastrarCIN')} className="btn-dashboard">
          Cadastrar CIN
        </button>
      </div>

      <style jsx>{`
        .btn-dashboard {
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          background-color: #4a90e2;
          color: white;
          border-radius: 6px;
          transition: background 0.3s ease;
        }
        .btn-dashboard:hover {
          background-color: #357ac7;
        }
      `}</style>
    </Layout>
  )
}

export default Dashboard
