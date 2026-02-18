
import React, { useState, useEffect } from 'react';
import { Globe, Save, ShieldCheck, Zap } from 'lucide-react';

const Settings: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('nexus_webhook_url') || '';
    setWebhookUrl(savedUrl);
  }, []);

  const handleSave = () => {
    localStorage.setItem('nexus_webhook_url', webhookUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
        <header className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Integrações Externas</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Conecte o Nexus ao seu ecossistema</p>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest">Webhook de Notificação (n8n / Zapier)</h3>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Sempre que um cliente vencer ou um disparo manual for acionado, enviaremos um POST JSON para esta URL.
            </p>
            <div className="flex gap-4">
              <input 
                type="url"
                placeholder="https://sua-url-de-webhook.com/endpoint"
                className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 shadow-inner"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <button 
                onClick={handleSave}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                {isSaved ? 'Salvo!' : 'Salvar Config'}
              </button>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center gap-6">
            <div className="p-4 bg-white/10 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-1">Segurança de Dados</h4>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Suas URLs de integração são armazenadas localmente no seu navegador para máxima privacidade. O Nexus não compartilha suas chaves com terceiros.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
