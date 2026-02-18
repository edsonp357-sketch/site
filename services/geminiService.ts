
import { Client, AIAnalysis } from "../types";

/**
 * Chama o endpoint serverless para analisar as notas do cliente.
 */
export const analyzeClientNotes = async (client: Client): Promise<AIAnalysis | null> => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'analyze', client })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro na comunicação com o servidor');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na análise da IA:", error);
    return null;
  }
};

/**
 * Chama o endpoint serverless para gerar uma mensagem personalizada.
 */
export const generateAIMessage = async (client: Client): Promise<string> => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'message', client })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro na comunicação com o servidor');
    }

    const data = await response.json();
    return data.text || "Olá, gostaria de conversar sobre sua conta na Nexus.";
  } catch (error) {
    console.error("Erro ao gerar mensagem:", error);
    return "Olá, gostaria de dar um acompanhamento em nosso projeto. Como você está?";
  }
};
