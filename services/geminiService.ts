
import { GoogleGenAI } from "@google/genai";
import type { Evolution } from '../types';

// IMPORTANT: This key is managed by the execution environment. Do not change it.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateEvolution = async (keywords: string, history: Evolution[]): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("AI functionality is disabled. Please configure the API Key.");
  }

  const historyText = history
    .slice(-3) // Get the last 3 entries
    .map(e => `Em ${e.date.toLocaleDateString()}: ${e.content}`)
    .join('\n');

  const prompt = `
    Tarefa: Escrever uma nota de evolução de paciente concisa e profissional.
    
    Instruções:
    - Baseie-se no histórico recente do paciente e nas palavras-chave da sessão de hoje.
    - Mantenha um tom clínico, objetivo e direto.
    - Estruture a nota de forma clara.

    HISTÓRICO RECENTE DO PACIENTE:
    ${historyText || 'Nenhum histórico anterior fornecido.'}

    ---

    PALAVRAS-CHAVE DA SESSÃO DE HOJE:
    "${keywords}"

    ---

    Com base nas informações, gere a nota de evolução para a sessão de hoje.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error generating AI response. Please check the console for details.";
  }
};