'use client'

import { useState } from 'react'
import supabase from '../lib/supabaseClient'
import Layout from '../layouts/Layout'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' // Importação correta

const Relatorios = () => {
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [resultados, setResultados] = useState<any[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const buscarAtendimentos = async () => {
    if (!dataInicial || !dataFinal) {
      setErro('Selecione uma data inicial e final.')
      return
    }

    setCarregando(true)
    setErro(null)

    const { data, error } = await supabase
      .from('atendimentos')
      .select('*')
      .gte('dia_atual', dataInicial)
      .lte('dia_atual', dataFinal)

    if (error) {
      setErro('Erro ao buscar atendimentos.')
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
      atendimento.solicitante
    ])

    // Chamada correta de autoTable
    autoTable(doc, {
      head: [['Nome', 'CPF', 'Data', 'Solicitante']],
      body: tabela,
      startY: 20
    })

    doc.save('relatorio_atendimentos.pdf')
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Gerar Relatórios</h1>

        <div className="mb-4">
          <label className="block text-gray-700">Data Inicial:</label>
          <input
            type="date"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Data Final:</label>
          <input
            type="date"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={buscarAtendimentos}
          disabled={carregando}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {carregando ? 'Buscando...' : 'Buscar Atendimentos'}
        </button>

        {erro && <p className="text-red-500 mt-4">{erro}</p>}

        {resultados.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Resultados:</h2>
            <ul className="border border-gray-300 rounded p-4">
              {resultados.map((atendimento) => (
                <li key={atendimento.id} className="border-b py-2">
                  <strong>Nome:</strong> {atendimento.nome} <br />
                  <strong>CPF:</strong> {atendimento.cpf} <br />
                  <strong>Data:</strong> {atendimento.dia_atual} <br />
                  <strong>Solicitante:</strong> {atendimento.solicitante}
                </li>
              ))}
            </ul>

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
