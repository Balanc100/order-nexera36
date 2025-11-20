import { GoogleGenAI } from "@google/genai";
import { Order } from "../types";

// Use import.meta.env for Vite applications
const apiKey = import.meta.env.VITE_API_KEY;

export const generateOrderSummary = async (order: Order): Promise<string> => {
  if (!apiKey) {
    return "AI Disabled: No API Key configured.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Create a concise summary of items
    const itemsList = order.items
      .map(item => `- ${item.name} (${item.quantity} ชิ้น)`)
      .join('\n');

    const prompt = `
      You are a helpful shop assistant AI for a health and wellness store.
      The customer name is "${order.customerName}".
      They purchased the following items:
      ${itemsList}
      
      Please generate a short, friendly "Thank You" note in Thai language. 
      Also, provide one brief health tip or usage instruction relevant to one of the purchased items (e.g., "Take supplements with water" or "Apply cream gently").
      Keep it under 3 sentences.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "ขอบคุณที่ใช้บริการ";
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return "ขอบคุณสำหรับการสั่งซื้อ (AI connection failed)";
  }
};