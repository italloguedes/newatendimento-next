// src/app/login/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabaseClient';

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro('Erro ao fazer login: ' + error.message);
    } else {
      // Redireciona para a página de Dashboard após login bem-sucedido
      router.push('/Dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 to-blue-500">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Login</h1>
        {erro && <p className="text-red-500 mb-4">{erro}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg transition duration-300 hover:bg-teal-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;