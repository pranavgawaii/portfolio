import { useState, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface UseGroqChatReturn {
  sendMessage: (userText: string) => Promise<void>;
  /** The current AI response token-by-token while streaming */
  aiResponse: string;
  /** True while waiting for the very first token from Groq */
  isThinking: boolean;
  /** True while tokens are still arriving */
  isStreaming: boolean;
  /** Full conversation history (user + assistant turns) */
  history: ChatMessage[];
  clearHistory: () => void;
  error: string | null;
}

const CHAT_API_URL = '/api/chat';

export function useGroqChat(): UseGroqChatReturn {
  const [aiResponse, setAiResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Keep a stable ref to the latest history so closures don't go stale
  const historyRef = useRef<ChatMessage[]>([]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    historyRef.current = [];
    setAiResponse('');
    setError(null);
  }, []);

  const sendMessage = useCallback(async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    // ── 1. Optimistically add user message ────────────────────────────────────
    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const nextHistory = [...historyRef.current, userMsg];
    historyRef.current = nextHistory;
    setHistory(nextHistory);

    // ── 2. Enter thinking state ───────────────────────────────────────────────
    setIsThinking(true);
    setIsStreaming(false);
    setAiResponse('');
    setError(null);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`${res.status}: ${errBody}`);
      }

      if (!res.body) throw new Error('No response body returned from /api/chat');

      // ── 3. Stream tokens ──────────────────────────────────────────────────
      setIsThinking(false);
      setIsStreaming(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullResponse = '';

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const token = decoder.decode(value, { stream: true });
        fullResponse += token;
        setAiResponse(fullResponse);
      }

      // ── 4. Stream complete — commit to history ────────────────────────────
      setIsStreaming(false);

      const assistantMsg: ChatMessage = { role: 'assistant', content: fullResponse };
      const finalHistory = [...nextHistory, assistantMsg];
      historyRef.current = finalHistory;
      setHistory(finalHistory);

      /* TODO: Prompt 4 — pass `fullResponse` to ElevenLabs TTS here */

    } catch (err) {
      console.error('[useGroqChat] Error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setIsThinking(false);
      setIsStreaming(false);
      setAiResponse("Sorry, something went wrong. Try again!");
    }
  }, []);

  return {
    sendMessage,
    aiResponse,
    isThinking,
    isStreaming,
    history,
    clearHistory,
    error,
  };
}
