
export type ClientStatus = 'Ativo' | 'Atrasado' | 'Expirado';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  value: number;
  date: string;
  status: ClientStatus;
  notes: string;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Sale {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  description: string;
}

export type AppView = 'clients' | 'sales' | 'categories' | 'settings' | 'ai-agent';

export interface ClientFormData {
  name: string;
  phone: string;
  email: string;
  value: number;
  date: string;
  status: ClientStatus;
  notes: string;
  categoryId?: string;
}

export interface AIAnalysis {
  summary: string;
  sentiment: string;
  nextSteps: string[];
}
