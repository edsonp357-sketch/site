
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Category } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('bg-blue-500');

  const colors = [
    { name: 'Azul', value: 'bg-blue-500' },
    { name: 'Verde', value: 'bg-green-500' },
    { name: 'Vermelho', value: 'bg-red-500' },
    { name: 'Roxo', value: 'bg-purple-500' },
    { name: 'Amarelo', value: 'bg-yellow-500' },
    { name: 'Indigo', value: 'bg-indigo-500' },
    { name: 'Rosa', value: 'bg-pink-500' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, color);
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border border-slate-100">
        <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Nova Categoria</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Categoria</label>
            <input 
              type="text"
              autoFocus
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-900 shadow-sm"
              placeholder="Ex: VIP, Leads, Antigos..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cor de Identificação</label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-12 rounded-2xl transition-all border-4 ${color === c.value ? 'border-slate-900 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'} ${c.value}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-xl shadow-indigo-600/20 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Criar Categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
