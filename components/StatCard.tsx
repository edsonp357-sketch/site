
import React, { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, bgColor = 'bg-slate-50' }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {trend && (
          <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
