import { useState, useRef, useCallback, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface UseGroqChatReturn {
  sendMessage: (userText: string) => Promise<void>;
  /** Cancel an in-flight request */
  cancelRequest: () => void;
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
  /** How many retry attempts have been made for the current message */
  retryCount: number;
}

const CHAT_API_URL = '/api/chat';
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 500;

export function useGroqChat(): UseGroqChatReturn {
  const [aiResponse, setAiResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // AbortController ref so we can cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Keep a stable ref to the latest history so closures don't go stale
  const historyRef = useRef<ChatMessage[]>([]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsThinking(false);
    setIsStreaming(false);
  }, []);

  const clearHistory = useCallback(() => {
    cancelRequest();
    setHistory([]);
    historyRef.current = [];
    setAiResponse('');
    setError(null);
    setRetryCount(0);
  }, [cancelRequest]);

  const sendMessage = useCallback(async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

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
    setRetryCount(0);

    // ── Retry loop with exponential back-off ─────────────────────────────────
    let attempt = 0;
    while (attempt <= MAX_RETRIES) {
      try {
        const res = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: nextHistory }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`${res.status}: ${errBody}`);
        }

        if (!res.body) throw new Error('No response body returned from /api/chat');

        // ── 3. Stream tokens ────────────────────────────────────────────────
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

        // ── 4. Stream complete — commit to history ──────────────────────────
        setIsStreaming(false);
        abortControllerRef.current = null;

        const assistantMsg: ChatMessage = { role: 'assistant', content: fullResponse };
        const finalHistory = [...nextHistory, assistantMsg];
        historyRef.current = finalHistory;
        setHistory(finalHistory);

        /* TODO: Prompt 4 — pass `fullResponse` to ElevenLabs TTS here */
        return; // success — exit retry loop

      } catch (err) {
        // Don't retry if the request was intentionally cancelled
        if (err instanceof DOMException && err.name === 'AbortError') {
          setIsThinking(false);
          setIsStreaming(false);
          return;
        }

        attempt++;
        setRetryCount(attempt);

        if (attempt > MAX_RETRIES) {
          console.error('[useGroqChat] Max retries reached:', err);
          const message = err instanceof Error ? err.message : 'Unknown error';
          setError(message);
          setIsThinking(false);
          setIsStreaming(false);
          setAiResponse('Sorry, something went wrong. Try again!');
          return;
        }

        // Exponential back-off before next attempt
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        console.warn(`[useGroqChat] Retry ${attempt}/${MAX_RETRIES} in ${delay}ms…`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }, [cancelRequest]);

  // Cleanup: abort any pending request when the component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    sendMessage,
    cancelRequest,
    aiResponse,
    isThinking,
    isStreaming,
    history,
    clearHistory,
    error,
    retryCount,
  };
}
