import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import HomePage from './pages/HomePage';

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
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
