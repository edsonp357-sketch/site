
import { Client } from "../types";

/**
 * Envia os dados do cliente para a URL de Webhook configurada.
 */
export const triggerWebhook = async (webhookUrl: string, client: Client, type: 'manual' | 'automatico' = 'manual') => {
  if (!webhookUrl) {
    throw new Error("URL do Webhook não configurada.");
  }

  const payload = {
    event_type: `vencimento_cliente_${type}`,
    timestamp: new Date().toISOString(),
    client_id: client.id,
    client_name: client.name,
    due_date: client.date,
    amount: client.value,
    status: client.status,
    email: client.email,
    phone: client.phone,
    notes: client.notes
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro no Webhook: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Erro ao disparar Webhook:", error);
    throw error;
  }
};
