import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Assistant endpoint using Gemini API
  app.post('/api/ai-reply', async (req, res) => {
    try {
      const { prompt, history, userName } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Intelligent fallback response if API key is not configured yet
        const fallbackAnswers = [
          `Hello ${userName || 'there'}! I'm your Gemini AI Assistant. How can I help you organize your messages, draft notes, or plan tasks today?`,
          `That's an interesting topic! I can help you draft a response, summarize conversation history, or generate creative ideas.`,
          `I'm standing by to help! Let me know if you need code snippets, text summaries, or translation for your chats.`,
          `Great question! Feel free to ask me anything about your project or general knowledge.`,
        ];
        const reply = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
        return res.json({ reply });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are a helpful, friendly, and concise AI Assistant embedded inside a real-time Messenger application. Respond conversationally, clearly, and concisely, keeping responses suitable for instant messaging chat bubbles. Use markdown formatting sparingly when helpful.`;

      let contents = prompt;
      if (Array.isArray(history) && history.length > 0) {
        const formattedHistory = history.map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`).join('\n');
        contents = `Recent conversation:\n${formattedHistory}\n\nUser: ${prompt}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          maxOutputTokens: 500,
        },
      });

      const reply = response.text || "I'm sorry, I couldn't generate a response right now.";
      return res.json({ reply });
    } catch (error) {
      console.error('Gemini API error:', error);
      return res.status(500).json({
        reply: "I'm experiencing a temporary issue reaching the Gemini service. Please try again shortly!",
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for dev or Static serve for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Messenger App server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
