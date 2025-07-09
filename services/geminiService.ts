

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ClientStatus, Client } from '../types';

if (!process.env.API_KEY) {
  // In a real app, this would be a more robust check or handled during build.
  // For this environment, we assume it's set.
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateRenewalReminder = async (clientName: string, dueDate: string): Promise<string> => {
  if (!process.env.API_KEY) return "Serviço de IA indisponível. Chave de API não configurada.";

  const prompt = `Gere uma mensagem curta, amigável e profissional em português para lembrar um cliente sobre o vencimento de sua assinatura.
    Cliente: ${clientName}
    Data de Vencimento: ${dueDate}
    
    A mensagem deve ser concisa e clara. Inclua o nome do cliente e a data. Não adicione saudações como "Prezado" ou "Olá". Comece diretamente com o lembrete. Termine pedindo para entrar em contato para renovar.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating renewal reminder:", error);
    return "Não foi possível gerar a mensagem de renovação no momento.";
  }
};

export const generateDashboardSummary = async (stats: { total: number; active: number; expired: number; expiringSoon: number }): Promise<string> => {
    if (!process.env.API_KEY) return "Serviço de IA indisponível. Chave de API não configurada.";

    const prompt = `Aja como um analista de negócios. Analise os seguintes dados de uma carteira de clientes e gere um resumo conciso (2-3 frases) em português. Destaque o ponto mais importante (positivo ou negativo).
    - Total de Clientes: ${stats.total}
    - Clientes Ativos: ${stats.active}
    - Clientes Vencidos: ${stats.expired}
    - Clientes com Vencimento Próximo (próximos 7 dias): ${stats.expiringSoon}

    Exemplo de saída: "Com ${stats.total} clientes, a saúde da carteira é boa, mas atenção aos ${stats.expiringSoon} clientes prestes a vencer para evitar um aumento na taxa de churn."
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating dashboard summary:", error);
        return "Não foi possível gerar o resumo do painel no momento.";
    }
};

export const generateStrongPassword = async (): Promise<string> => {
    if (!process.env.API_KEY) return "IA-indisponivel";

    const prompt = `Gere uma senha forte e segura com 12 caracteres. Deve incluir letras maiúsculas, minúsculas, números e símbolos. Responda apenas com a senha, sem qualquer texto adicional.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating password:", error);
        return "erro-ao-gerar";
    }
};

export const parseClientDataWithAI = async (text: string): Promise<Partial<Client>> => {
  if (!process.env.API_KEY) {
    throw new Error("Serviço de IA indisponível. Chave de API não configurada.");
  }

  const prompt = `
    Analise o seguinte texto e extraia as informações de um cliente. O texto pode estar em formato livre.
    As informações a serem extraídas são:
    - nome (string): O nome completo do cliente.
    - login (string): O nome de usuário ou login.
    - senha (string, opcional): A senha do cliente.
    - servidor (string, opcional): O servidor associado.
    - telefone (string, opcional): O número de telefone.
    - vencimento (string): A data de vencimento no formato AAAA-MM-DD. Se o ano não for especificado, assuma o ano atual ou o próximo, o que fizer mais sentido.

    Texto para analisar:
    ---
    ${text}
    ---

    Responda APENAS com um objeto JSON contendo os dados extraídos. Não inclua explicações ou formatação markdown. Se um campo não for encontrado, omita-o do JSON.
    Exemplo de resposta:
    {
      "nome": "João da Silva",
      "login": "joao.s",
      "senha": "Password123",
      "servidor": "BR-02",
      "telefone": "(11) 98765-4321",
      "vencimento": "2024-12-25"
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);
    
    // Attempt to normalize date format if it comes as DD/MM/YYYY or DD-MM-YYYY
    if (parsedData.vencimento) {
        const dateParts = parsedData.vencimento.match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
        if (dateParts) {
            // DD/MM/YYYY -> YYYY-MM-DD
            parsedData.vencimento = `${dateParts[3]}-${dateParts[2]}-${dateParts[1]}`;
        }
    }

    return parsedData as Partial<Client>;

  } catch (error) {
    console.error("Error parsing client data with AI:", error);
    throw new Error("Não foi possível processar os dados do cliente com a IA.");
  }
};
