// ─── Web Speech API TypeScript Declarations ───────────────────────────────────
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  class SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionErrorCode;
    readonly message: string;
  }

  type SpeechRecognitionErrorCode =
    | 'aborted'
    | 'audio-capture'
    | 'bad-grammar'
    | 'language-not-supported'
    | 'network'
    | 'no-speech'
    | 'not-allowed'
    | 'service-not-allowed';
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
import { useState, useRef, useCallback, useEffect } from 'react';

export type MicPermission = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface UseSpeechRecognitionReturn {
  /** Accumulated final (confirmed) transcript for the current session */
  transcript: string;
  /** Live interim text the user is currently speaking (not yet final) */
  interimTranscript: string;
  isListening: boolean;
  micPermission: MicPermission;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

const SILENCE_TIMEOUT_MS = 1500;

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState<MicPermission>('prompt');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isListeningRef = useRef(false); // stable ref for closures

  // ── Browser support check ──────────────────────────────────────────────────
  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // ── Clear silence timer ────────────────────────────────────────────────────
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // ── Reset silence timer — called on every speech result ───────────────────
  const resetSilenceTimer = useCallback(
    (onSilence: () => void) => {
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(onSilence, SILENCE_TIMEOUT_MS);
    },
    [clearSilenceTimer]
  );

  // ── Stop listening (exported) ──────────────────────────────────────────────
  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
    }
    isListeningRef.current = false;
    setIsListening(false);
    setInterimTranscript('');
  }, [clearSilenceTimer]);

  // ── Start listening (exported) ─────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Use Chrome for voice features');
      setMicPermission('unsupported');
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');

    // Request mic permission first so we can surface the state
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Stop the stream immediately — we just needed the permission grant
        stream.getTracks().forEach((t) => t.stop());
        setMicPermission('granted');
        setError(null);

        // ── Build recognition instance ─────────────────────────────────────
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
          isListeningRef.current = true;
          setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalChunk = '';
          let interimChunk = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalChunk += result[0].transcript + ' ';
            } else {
              interimChunk += result[0].transcript;
            }
          }

          if (finalChunk) {
            setTranscript((prev) => prev + finalChunk);
          }
          setInterimTranscript(interimChunk);

          // Restart silence timer on every result so we only stop after real pause
          resetSilenceTimer(() => {
            /* TODO: Prompt 3 — send finalTranscript to Groq here */
            stopListening();
          });
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          clearSilenceTimer();
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setMicPermission('denied');
            setError('Please allow mic access in browser settings');
          } else if (event.error === 'no-speech') {
            // Silently ignore — silence timer will handle stop
            return;
          } else if (event.error === 'aborted') {
            // Intentional stop — no error to surface
            return;
          } else {
            setError(`Speech error: ${event.error}`);
          }
          isListeningRef.current = false;
          setIsListening(false);
          setInterimTranscript('');
        };

        recognition.onend = () => {
          setInterimTranscript('');
          // If we ended unexpectedly while still wanting to listen, restart
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch {
              isListeningRef.current = false;
              setIsListening(false);
            }
          }
        };

        recognition.start();
      })
      .catch(() => {
        setMicPermission('denied');
        setError('Please allow mic access in browser settings');
      });
  }, [isSupported, resetSilenceTimer, stopListening, clearSilenceTimer]);

  // ── Reset transcript ───────────────────────────────────────────────────────
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        isListeningRef.current = false;
        recognitionRef.current.abort();
      }
    };
  }, [clearSilenceTimer]);

  // ── If browser not supported, surface error immediately ───────────────────
  useEffect(() => {
    if (!isSupported) {
      setMicPermission('unsupported');
      setError('Use Chrome for voice features');
    }
  }, [isSupported]);

  return {
    transcript,
    interimTranscript,
    isListening,
    micPermission,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
