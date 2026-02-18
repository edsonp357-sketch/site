import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, TrendingUp, Settings, LogOut, LayoutDashboard, 
  Sparkles, Tag, X, Plus, Trash2 
} from 'lucide-react';
import { Client, Category, Sale } from './types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { triggerWebhook } from './services/webhookService';
import Header from './components/Header';
import CustomerList from './components/ClientTable';
import CustomerForm from './components/ClientModal';
import CategoryModal from './components/CategoryModal';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import Login from './components/Login';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [autoNotified, setAutoNotified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('nexus_clients');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('nexus_categories');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'VIP', color: 'bg-purple-500' },
      { id: '2', name: 'Standard', color: 'bg-blue-500' }
    ];
  });

  const [sales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('nexus_sales');
    return saved ? JSON.parse(saved) : [
      { id: '1', clientId: '1', amount: 15500, date: '2024-03-10', description: 'Renovação Anual' }
    ];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem('nexus_clients', JSON.stringify(clients));
    localStorage.setItem('nexus_categories', JSON.stringify(categories));
  }, [clients, categories]);

  const fetchClients = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      if (clients.length === 0) {
        setClients([
          { id: '1', name: 'Empresa Alpha', phone: '(11) 99999-0001', email: 'contato@alpha.com', value: 15500, date: new Date().toISOString().split('T')[0], status: 'Atrasado', notes: 'Teste de vencimento hoje.' }
        ]);
      }
      return;
    }

    setIsLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase.from('clientes').select('*').order('name');
      if (error) throw error;
      if (data) setClients(data);
    } catch (err) {
      console.error("Supabase error fetching clients:", err);
      // Fallback remains with whatever is in state/localStorage
    } finally {
      setIsLoading(false);
    }
  }, [clients.length]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClients();
    }
  }, [isAuthenticated, fetchClients]);

  useEffect(() => {
    if (isAuthenticated && !autoNotified) {
      const webhookUrl = localStorage.getItem('nexus_webhook_url');
      if (webhookUrl) {
        const today = new Date().toISOString().split('T')[0];
        const dueToday = clients.filter(c => c.date === today && c.status !== 'Ativo');
        
        if (dueToday.length > 0) {
          dueToday.forEach(client => {
            triggerWebhook(webhookUrl, client, 'automatico')
              .catch(err => console.error("Webhook automation failed:", err));
          });
        }
      }
      setAutoNotified(true);
    }
  }, [isAuthenticated, clients, autoNotified]);

  const handleManualWebhook = async (client: Client) => {
    const webhookUrl = localStorage.getItem('nexus_webhook_url');
    if (!webhookUrl) {
      alert("Defina uma URL de Webhook nas Configurações.");
      navigate('/settings');
      return;
    }

    try {
      await triggerWebhook(webhookUrl, client, 'manual');
      alert(`Notificação enviada para ${client.name}!`);
    } catch (err) {
      alert("Erro ao disparar Webhook.");
    }
  };

  const handleUpsert = async (clientData: any) => {
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...clientData } : c));
    } else {
      const newClient = { ...clientData, id: Math.random().toString(36).substr(2, 9) };
      setClients(prev => [newClient, ...prev]);
    }
    setIsModalOpen(false);
    setEditingClient(undefined);
  };

  const handleAddCategory = (name: string, color: string) => {
    setCategories(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name, color }]);
    setIsCategoryModalOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'clients', label: 'Clientes', icon: Users, path: '/clients' },
    { id: 'categories', label: 'Categorias', icon: Tag, path: '/categories' },
    { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings' },
  ];

  if (!isAuthenticated) return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex lg:flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg"><LayoutDashboard className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-black tracking-tight italic">NEXUS</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => { navigate(item.path); setIsSidebarOpen(false); }} 
              className={`flex items-center gap-3 w-full px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${location.pathname === item.path ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className="w-4 h-4" />{item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-3 w-full px-4 py-4 text-xs font-black uppercase tracking-widest rounded-2xl text-slate-400 hover:text-white hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" />Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={navItems.find(i => i.path === location.pathname)?.label || 'Nexus'} onToggleSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Dashboard clients={clients} sales={sales} />} />
                <Route path="/clients" element={
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Base de Clientes</h2>
                      <button onClick={() => { setEditingClient(undefined); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Novo Registro
                      </button>
                    </div>
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
                      <CustomerList 
                        clients={clients} 
                        onEdit={(c) => { setEditingClient(c); setIsModalOpen(true); }} 
                        onDelete={(id) => setClients(prev => prev.filter(c => c.id !== id))}
                        onNotify={handleManualWebhook}
                      />
                    </div>
                  </div>
                } />
                <Route path="/categories" element={
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Gestão de Categorias</h2>
                      <button onClick={() => setIsCategoryModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest">Nova Categoria</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {categories.map(cat => (
                        <div key={cat.id} className="p-6 bg-white rounded-3xl border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${cat.color}`} />
                            <span className="font-black text-slate-800 uppercase text-[11px]">{cat.name}</span>
                          </div>
                          <button onClick={() => setCategories(prev => prev.filter(c => c.id !== cat.id))} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                } />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            )}
          </div>
        </main>
      </div>

      <CustomerForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleUpsert} initialData={editingClient} />
      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSubmit={handleAddCategory} />
    </div>
  );
};

export default App;