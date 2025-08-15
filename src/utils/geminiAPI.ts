import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function getAIRecommendations(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const enhancedPrompt = `
${prompt}
Please format your response in the following way:
1. Start each main section with a number followed by a dot (e.g., "1. Health Assessment")
2. Use bullet points (•) for lists
3. Do not use markdown symbols (* or #)
4. Keep the response clear and well-structured
5. For tasks, format them as: "Task: [task description]"

Make sure to include:
• A brief health assessment
• 3-5 specific tasks
• Dietary recommendations
• Exercise suggestions
• Lifestyle improvement tips`;

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/\*\*/g, '').replace(/\#/g, '').replace(/\*/g, '•').replace(/Task:/g, '🎯 Task:').trim();
      return text;
    } catch (error) {
      if ((error as any)?.status === 503 && attempts < maxAttempts - 1) {
        console.warn(`Attempt ${attempts + 1} failed. Retrying...`);
        await delay(Math.pow(2, attempts) * 1000); // Exponential backoff: 1s, 2s, 4s, 8s...
      } else {
        console.error('Error calling Gemini API:', error);
        throw error;
      }
    }
    attempts++;
  }

  throw new Error('Failed to get AI recommendations after multiple attempts.');
}
