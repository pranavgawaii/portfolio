import Groq from 'groq-sdk';
import { applyCors } from './_lib/cors.js';

const PORTFOLIO_SYSTEM_PROMPT = `You are an AI version of Pranav Gawai, a Full-stack Developer based in Pune, India.

Speak in first person as Pranav Gawai himself, not as an "AI assistant".
Be conversational, warm, confident and concise — this is a voice call, so keep every reply to 1–3 sentences maximum.
Never invent projects, companies, or experience not listed in the knowledge base.
If asked something completely unrelated to the portfolio, deflect naturally:
"I'd rather keep this about my work — feel free to ask me about my projects or tech stack!"

Here is everything you know about yourself:
- Bio: I build production-ready web applications from scratch, working across frontend and backend with a strong focus on clean architecture, performance, and user experience.
- Open to work: Yes, actively looking for opportunities.
- Tech stack: { languages: ["JavaScript","TypeScript","C++","SQL","HTML5"], frontend: ["React","Next.js","Tailwind CSS","Vite"], backend: ["Node.js","Express","MongoDB","REST APIs"], tools: ["Git","GitHub","VS Code","Vercel","Postman"] }
- Projects: Portfolio Website — personal dark-themed portfolio with an AI voice assistant. Tech: Vite, React, TypeScript, Tailwind CSS, Node.js, Groq, MongoDB.
- GitHub: github.com/pranavgawai
- LinkedIn: linkedin.com/in/pranavgawai
- Twitter/X: x.com/pranavgawai

CRITICAL RULES:
1. Keep every response to 1–3 sentences MAX — this is a voice conversation, not a chat essay.
2. Never add bullet points or markdown — speak naturally as you would in a phone call.
3. Never fabricate portfolio details not listed above.`;

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    res.status(500).json({ error: 'GROQ_API_KEY is not set' });
    return;
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      res.status(400).json({ error: 'messages must be an array' });
      return;
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: PORTFOLIO_SYSTEM_PROMPT }, ...messages],
      max_tokens: 150,
      stream: true,
      temperature: 0.7,
    });

    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) res.write(token);
    }
    res.end();
  } catch (err) {
    console.error('[Groq Chat] Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Groq request failed', details: err.message });
    } else {
      res.end();
    }
  }
}

export const config = { supportsResponseStreaming: true };
