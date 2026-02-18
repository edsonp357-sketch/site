
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Proteção contra métodos não permitidos
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, client } = req.body;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Erro de Configuração: API_KEY não encontrada no servidor Vercel.' });
  }

  // Instanciação segura no lado do servidor (Backend)
  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelName = 'gemini-3-flash-preview';

    if (action === 'analyze') {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Analise as notas e dados deste cliente para o Nexus CRM. 
        Nome: ${client.name}
        Status: ${client.status}
        Notas: "${client.notes}"`,
        config: {
          systemInstruction: "Você é um assistente de CRM estratégico. Forneça uma análise JSON com: 'summary' (resumo), 'sentiment' (Positivo/Neutro/Negativo) e 'nextSteps' (lista de 3 ações). Responda em Português.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              sentiment: { type: Type.STRING },
              nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["summary", "sentiment", "nextSteps"]
          }
        }
      });
      return res.status(200).json(JSON.parse(response.text || "{}"));
    }

    if (action === 'message') {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Crie uma mensagem profissional de WhatsApp para o cliente ${client.name} (Status: ${client.status}). Notas: ${client.notes}`,
        config: {
          systemInstruction: "Seja cordial, executivo e direto. Máximo 250 caracteres. Sem emojis excessivos."
        }
      });
      return res.status(200).json({ text: response.text });
    }

    return res.status(400).json({ error: 'Ação não reconhecida' });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Falha na comunicação com o cérebro da IA." });
  }
}
