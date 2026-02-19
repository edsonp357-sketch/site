import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        console.warn("Supabase não configurado.");
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      console.log("Sessão atual:", data);
      if (error) console.error("Erro ao obter sessão:", error);
    };

    checkSession();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* Adicione outras rotas aqui se precisar */}
    </Routes>
  );
};

export default App;
