'use client'

import { useState } from 'react'
import supabase from '../lib/supabaseClient'
import Layout from '../layouts/Layout'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Definição do tipo para os dados de atendimento
interface Atendimento {
  id: string
  nome: string
  cpf: string
  dia_atual: string
  solicitante: string
  email?: string // Opcional, caso esteja presente
  usuario_id?: string // Opcional, caso esteja presente
  created_at?: string // Opcional
  updated_at?: string // Opcional
}

const Relatorios = () => {
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [resultados, setResultados] = useState<Atendimento[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const buscarAtendimentos = async () => {
    setErro(null)

    if (!dataInicial || !dataFinal) {
      setErro('Selecione uma data inicial e final.')
      return
    }

    if (dataFinal < dataInicial) {
      setErro('A data final não pode ser menor que a data inicial.')
      return
    }

    setCarregando(true)

    const { data, error } = await supabase
      .from('atendimentos')
      .select('*')
      .gte('dia_atual', dataInicial)
      .lte('dia_atual', dataFinal)

    if (error) {
      setErro('Erro ao buscar atendimentos: ' + error.message)
    } else if (data.length === 0) {
      setErro('Nenhum atendimento encontrado no período.')
    } else {
      setResultados(data)
    }

    setCarregando(false)
  }

  const gerarPDF = () => {
    if (resultados.length === 0) {
      setErro('Nenhum dado para gerar PDF.')
      return
    }

    const doc = new jsPDF()
    doc.text('Relatório de Atendimentos', 14, 15)

    const tabela = resultados.map((atendimento) => [
      atendimento.nome,
      atendimento.cpf,
      atendimento.dia_atual,
      atendimento.solicitante,
    ])

    autoTable(doc, {
      head: [['Nome', 'CPF', 'Data', 'Solicitante']],
      body: tabela,
      startY: 20,
    })

    doc.save('relatorio_atendimentos.pdf')
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
        <h1 className="text-2xl font-bold text-center mb-4">Gerar Relatórios</h1>

        {/* Inputs de data */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Data Inicial:</label>
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Data Final:</label>
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Botão de busca */}
        <button
          onClick={buscarAtendimentos}
          disabled={carregando}
          className={`w-full p-2 text-white font-semibold rounded ${
            carregando ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {carregando ? 'Buscando...' : 'Buscar Atendimentos'}
        </button>

        {/* Exibição de erros */}
        {erro && <p className="text-red-500 text-center mt-4">{erro}</p>}

        {/* Resultados da busca */}
        {resultados.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-center">Resultados</h2>
            <div className="border border-gray-300 rounded p-4 max-h-60 overflow-y-auto">
              {resultados.map((atendimento) => (
                <div key={atendimento.id} className="border-b py-2">
                  <p><strong>Nome:</strong> {atendimento.nome}</p>
                  <p><strong>CPF:</strong> {atendimento.cpf}</p>
                  <p><strong>Data:</strong> {atendimento.dia_atual}</p>
                  <p><strong>Solicitante:</strong> {atendimento.solicitante}</p>
                </div>
              ))}
            </div>

            {/* Botão de gerar PDF */}
            <button
              onClick={gerarPDF}
              className="w-full mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Gerar PDF
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Relatorios