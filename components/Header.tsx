
import React from 'react';
import { LayoutDashboard, Menu, Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 h-16">
      <div className="px-4 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Nexus Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden md:flex items-center relative group">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisa rápida..." 
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 w-64 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>
            <div className="flex items-center gap-3 pl-1 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Edson Pereira</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administrador</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
