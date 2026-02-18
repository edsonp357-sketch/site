
import React, { useState } from 'react';
import { LayoutDashboard, Lock, Mail, AlertCircle, HelpCircle, X, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin provisional credentials as requested
    if (email === 'Edsonpereira30110@gmail.com' && password === 'Edson3009@') {
      onLoginSuccess();
    } else {
      setError('Credenciais inválidas. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black relative">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/40 mb-6 animate-bounce">
            <LayoutDashboard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Nexus CRM</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] opacity-80">Portal de Administração Provisória</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 lg:p-10 border border-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail do Administrador</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 shadow-inner"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha de Acesso</label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 hover:underline transition-all"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 shadow-inner"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-[10px] font-black uppercase leading-tight tracking-wide">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 mt-4 group"
            >
              Entrar no Sistema
              <Lock className="inline-block w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Acesso restrito Edson Pereira</p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl relative animate-in zoom-in-95">
            <header className="p-8 text-center bg-indigo-50/50">
              <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Recuperar Acesso</h3>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Informações Provisórias</p>
            </header>
            <div className="p-10 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail do Administrador:</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-800 select-all">
                  Edsonpereira30110@gmail.com
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha Provisória:</p>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 font-black text-indigo-700 text-lg tracking-widest text-center select-all">
                  Edson3009@
                </div>
              </div>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-lg"
              >
                Voltar ao Login
              </button>
            </div>
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
