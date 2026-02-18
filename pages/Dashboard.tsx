
import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Client, Sale } from '../types';
import StatCard from '../components/StatCard';

interface DashboardProps {
  clients: Client[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ clients, sales }) => {
  const chartData = useMemo(() => {
    const statusCounts = {
      Ativo: clients.filter(c => c.status === 'Ativo').length,
      Atrasado: clients.filter(c => c.status === 'Atrasado').length,
      Expirado: clients.filter(c => c.status === 'Expirado').length,
    };

    return [
      { name: 'Ativos', value: statusCounts.Ativo, color: '#4f46e5' },
      { name: 'Atrasados', value: statusCounts.Atrasado, color: '#f59e0b' },
      { name: 'Expirados', value: statusCounts.Expirado, color: '#ef4444' },
    ];
  }, [clients]);

  const salesTrend = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Abr', value: 4500 },
    { name: 'Mai', value: 6000 },
    { name: 'Jun', value: 5500 },
  ];

  const totalRevenue = clients.reduce((sum, c) => sum + (c.status === 'Ativo' ? c.value : 0), 0);
  const activeCount = clients.filter(c => c.status === 'Ativo').length;
  const churnRate = ((clients.filter(c => c.status === 'Expirado').length / (clients.length || 1)) * 100).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Receita Sob Gestão" 
          value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`} 
          icon={<DollarSign className="w-5 h-5 text-green-600" />} 
          trend="+12% este mês" 
          bgColor="bg-green-50" 
        />
        <StatCard 
          label="Base de Clientes" 
          value={clients.length.toString()} 
          icon={<Users className="w-5 h-5 text-indigo-600" />} 
          trend="Crescimento orgânico" 
          bgColor="bg-indigo-50" 
        />
        <StatCard 
          label="Taxa de Churn" 
          value={`${churnRate}%`} 
          icon={<ArrowDownRight className="w-5 h-5 text-red-600" />} 
          trend="Monitoramento crítico" 
          bgColor="bg-red-50" 
        />
        <StatCard 
          label="Performance IA" 
          value="98.2%" 
          icon={<Activity className="w-5 h-5 text-purple-600" />} 
          trend="Insights precisos" 
          bgColor="bg-purple-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 chart-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Fluxo de Receita</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Previsão semestral consolidada</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg">PROJETADO</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700, fontSize: '12px'}}
                  cursor={{stroke: '#4f46e5', strokeWidth: 1}}
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">Status da Carteira</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700, fontSize: '10px'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <Sparkles className="absolute top-0 right-0 w-32 h-32 text-white/5 -mr-10 -mt-10" />
          <h3 className="text-lg font-black uppercase tracking-tight mb-2">Relatórios IA Gratuitos</h3>
          <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Analise sua carteira de clientes com nossa nova engine baseada em Gemini 2.5.</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Gerar Insights Agora</button>
        </div>

        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <TrendingUp className="absolute bottom-0 left-0 w-32 h-32 text-white/10 -ml-10 -mb-10" />
          <h3 className="text-lg font-black uppercase tracking-tight mb-2">Sua Meta Mensal</h3>
          <div className="flex items-center gap-4 mt-4">
             <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
               <div className="h-full bg-white w-3/4 rounded-full"></div>
             </div>
             <span className="font-black text-sm">75%</span>
          </div>
          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-4">Faltam R$ 12.400 para bater a meta do trimestre.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;