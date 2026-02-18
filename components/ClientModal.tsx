
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Client, ClientFormData, ClientStatus } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => void;
  initialData?: Client;
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    phone: '',
    email: '',
    value: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'Ativo',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        phone: initialData.phone,
        email: initialData.email,
        value: initialData.value,
        date: initialData.date,
        status: initialData.status,
        notes: initialData.notes
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        value: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'Ativo',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Partial<Record<keyof ClientFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório';
    if (!formData.phone.trim()) newErrors.phone = 'O telefone é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'O e-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Formato de e-mail inválido';
    if (formData.value < 0) newErrors.value = 'O valor deve ser maior ou igual a zero';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border border-slate-100">
        <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              {initialData ? 'Editar Cadastro' : 'Novo Cliente'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">Portal de Gestão Nexus</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Cliente *</label>
              <input 
                type="text"
                placeholder="Nome completo ou Razão Social"
                className={`w-full px-5 py-3 rounded-2xl border bg-white ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 shadow-sm`}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              {errors.name && <p className="text-red-500 text-[10px] font-black mt-1 uppercase flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail de Contato *</label>
              <input 
                type="email"
                placeholder="email@dominio.com"
                className={`w-full px-5 py-3 rounded-2xl border bg-white ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 shadow-sm`}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {errors.email && <p className="text-red-500 text-[10px] font-black mt-1 uppercase flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone / WhatsApp *</label>
              <input 
                type="text"
                placeholder="(00) 00000-0000"
                className={`w-full px-5 py-3 rounded-2xl border bg-white ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 shadow-sm`}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              {errors.phone && <p className="text-red-500 text-[10px] font-black mt-1 uppercase flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor do Contrato *</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">R$</span>
                <input 
                  type="number"
                  step="0.01"
                  className={`w-full pl-12 pr-5 py-3 rounded-2xl border bg-white ${errors.value ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 shadow-sm`}
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                />
              </div>
              {errors.value && <p className="text-red-500 text-[10px] font-black mt-1 uppercase flex items-center gap-1 ml-1"><AlertCircle className="w-3 h-3" /> {errors.value}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status da Conta</label>
              <select 
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 shadow-sm appearance-none"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as ClientStatus})}
              >
                <option value="Ativo">🟢 Ativo</option>
                <option value="Atrasado">🟡 Atrasado</option>
                <option value="Expirado">🔴 Expirado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data de Referência</label>
              <input 
                type="date"
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 shadow-sm"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observações e Notas</label>
              <textarea 
                placeholder="Notas de reuniões, pendências ou histórico do cliente..."
                rows={4}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none font-bold text-slate-800 text-sm shadow-sm"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 font-black text-slate-500 hover:bg-slate-50 transition-all text-[10px] uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-[2] px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 text-[10px] uppercase tracking-widest"
            >
              <Save className="w-5 h-5" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
