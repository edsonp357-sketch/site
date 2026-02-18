import React, { useState } from 'react';
import { 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Sparkles, 
  XCircle,
  ChevronRight,
  MessageSquare,
  Send,
  Zap,
  Loader2,
  Calendar
} from 'lucide-react';
import { Client, AIAnalysis } from '../types';
import { analyzeClientNotes, generateAIMessage } from '../services/geminiService';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onNotify?: (client: Client) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onEdit, onDelete, onNotify }) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{id: string, data: AIAnalysis} | null>(null);
  const [aiMessageId, setAiMessageId] = useState<string | null>(null);
  const [aiMessageDraft, setAiMessageDraft] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'Ativo':
        return <span className="inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black bg-green-50 text-green-700 border border-green-100 tracking-widest shadow-sm">ATIVO</span>;
      case 'Atrasado':
        return <span className="inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-100 tracking-widest shadow-sm">ATRASADO</span>;
      case 'Expirado':
        return <span className="inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black bg-red-50 text-red-700 border border-red-100 tracking-widest shadow-sm">EXPIRADO</span>;
      default:
        return null;
    }
  };

  const handleAIAnalysis = async (client: Client) => {
    setAnalyzingId(client.id);
    const result = await analyzeClientNotes(client);
    if (result) {
      setAnalysisResult({ id: client.id, data: result });
    } else {
      alert("Não foi possível gerar insights agora. Verifique a chave da API.");
    }
    setAnalyzingId(null);
  };

  const handleGenerateAIMessage = async (client: Client) => {
    setAnalyzingId(`msg-${client.id}`);
    const message = await generateAIMessage(client);
    setAiMessageDraft(message);
    setAiMessageId(client.id);
    setAnalyzingId(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[950px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-200">
            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Informações Base</th>
            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vencimento / Contato</th>
            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {clients.map((client) => (
            <React.Fragment key={client.id}>
              <tr className="hover:bg-indigo-50/30 transition-all group">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-600 font-black text-xs group-hover:scale-110 transition-transform">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 leading-none mb-2 uppercase text-xs tracking-tight">{client.name}</p>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleAIAnalysis(client)}
                          disabled={analyzingId === client.id}
                          className="text-[8px] flex items-center gap-1.5 text-indigo-600 font-black uppercase tracking-widest py-1.5 px-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors shadow-sm"
                        >
                          {analyzingId === client.id ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                          Análise IA
                        </button>
                        <button 
                          onClick={() => handleGenerateAIMessage(client)}
                          disabled={analyzingId === `msg-${client.id}`}
                          className="text-[8px] flex items-center gap-1.5 text-green-600 font-black uppercase tracking-widest py-1.5 px-3 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors shadow-sm"
                        >
                          {analyzingId === `msg-${client.id}` ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <MessageSquare className="w-2.5 h-2.5" />}
                          Gerar Msg
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-900">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Vence em: {formatDate(client.date)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {client.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  {getStatusBadge(client.status)}
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex items-center justify-end gap-1 lg:gap-2">
                    {onNotify && (
                      <button 
                        onClick={() => onNotify(client)}
                        title="Notificar via Webhook"
                        className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all active:scale-90 group/zap"
                      >
                        <Zap className="w-4 h-4 fill-current group-hover/zap:animate-pulse" />
                      </button>
                    )}
                    <button 
                      onClick={() => onEdit(client)}
                      title="Editar Cliente"
                      className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(client.id)}
                      title="Excluir Definitivamente"
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110 active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              {/* Box de Mensagem Sugerida */}
              {aiMessageId === client.id && (
                <tr className="bg-green-50/40">
                  <td colSpan={4} className="px-6 py-8 animate-in slide-in-from-top-4">
                    <div className="bg-white p-8 rounded-[2rem] border border-green-100 shadow-2xl relative overflow-hidden">
                      <button onClick={() => setAiMessageId(null)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"><XCircle className="w-6 h-6" /></button>
                      <div className="flex items-start gap-6">
                        <div className="p-4 bg-green-600 rounded-2xl shadow-xl shadow-green-600/20"><MessageSquare className="w-6 h-6 text-white" /></div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div>
                               <h4 className="text-[10px] font-black text-green-900 uppercase tracking-[0.2em]">Sugestão do Agente Nexus IA</h4>
                               <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest mt-1">Personalizado para status {client.status}</p>
                            </div>
                            <div className="flex gap-3">
                              <button onClick={() => copyToClipboard(aiMessageDraft)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-md ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-900 text-white hover:bg-black hover:-translate-y-0.5'}`}>
                                {copied ? 'Copiado!' : 'Copiar Texto'}
                              </button>
                              <a 
                                href={`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(aiMessageDraft)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase bg-green-500 text-white hover:bg-green-600 transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5"
                              >
                                <Send className="w-3 h-3" /> Abrir WhatsApp
                              </a>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 text-sm font-medium leading-relaxed shadow-inner italic">
                            "{aiMessageDraft}"
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {/* Box de Análise de Insights */}
              {analysisResult?.id === client.id && (
                <tr className="bg-indigo-50/40">
                  <td colSpan={4} className="px-6 py-8 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white p-8 rounded-[2rem] border border-indigo-100 shadow-2xl relative overflow-hidden">
                      <button onClick={() => setAnalysisResult(null)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"><XCircle className="w-6 h-6" /></button>
                      <div className="flex items-start gap-6">
                        <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20"><Sparkles className="w-6 h-6 text-white" /></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.2em]">Análise Proativa do Cliente</h4>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${analysisResult.data.sentiment === 'Positivo' ? 'bg-green-100 text-green-700 border border-green-200' : analysisResult.data.sentiment === 'Negativo' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>Clima: {analysisResult.data.sentiment}</span>
                          </div>
                          <p className="text-slate-700 text-sm font-medium mb-6 leading-relaxed">{analysisResult.data.summary}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {analysisResult.data.nextSteps.map((step, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:bg-white transition-all cursor-default shadow-sm group/step">
                                <ChevronRight className="w-4 h-4 text-indigo-500 group-hover/step:translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;