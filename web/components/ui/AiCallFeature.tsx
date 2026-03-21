import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { PhoneOff, Mic, MicOff, X, Sparkles, MessageCircle, Send, Plus } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

// ─── Types ────────────────────────────────────────────────────────────────────
type CallState = 'idle' | 'choice' | 'activeCall' | 'activeChat';
type ChatMessage = { id: number; sender: 'ai' | 'user'; text: string };

// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_TRANSCRIPT =
  "Hey! I'm Pranav's AI. I'm a full-stack developer from Pune, India. You're on my portfolio — ask me anything about my work, projects, or tech stack. Let's go!";

const avatarUrl = '/avatar.jpg';

// ─── Waveform bar state helpers ───────────────────────────────────────────────
type WaveMode = 'idle' | 'ai' | 'user';

function getBarStyle(mode: WaveMode, idx: number) {
  const delay = (idx * 0.06) - 4; // continuous phase-shifted wave
  if (mode === 'user') {
    return {
      height: '4px',
      animation: `wavePremium 1.0s infinite ease-in-out ${delay}s`,
      background: '#8b5cf6',
      boxShadow: '0 0 10px rgba(139,92,246,0.5)',
    } as React.CSSProperties;
  }
  if (mode === 'ai') {
    return {
      height: '4px',
      animation: `wavePremium 1.2s infinite ease-in-out ${delay}s`,
      background: 'rgba(255,255,255,0.85)',
      boxShadow: '0 0 12px rgba(255,255,255,0.4)',
    } as React.CSSProperties;
  }
  // idle
  return { height: '4px', background: '#2a2a2a' } as React.CSSProperties;
}

// ─── Component ────────────────────────────────────────────────────────────────
const AiCallFeature: React.FC = () => {
  const [callState, setCallState] = useState<CallState>('idle');

  // ── Voice-call UI state ───────────────────────────────────────────────────
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);      // AI typing words
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [aiTranscript, setAiTranscript] = useState('');     // words shown in white
  const [aiFullText, setAiFullText] = useState(INITIAL_TRANSCRIPT);

  // ── Speech recognition ────────────────────────────────────────────────────
  const {
    transcript: userTranscript,
    interimTranscript,
    isListening,
    micPermission,
    error: micError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // ── Chat state ────────────────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTypingChat, setIsAiTypingChat] = useState(false);

  const [mounted, setMounted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // ── Determine waveform mode ───────────────────────────────────────────────
  const waveMode: WaveMode =
    isMuted ? 'idle' :
    isListening ? 'user' :
    isSpeaking ? 'ai' :
    'idle';

  // ── Chat auto-scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    if (callState === 'activeChat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTypingChat, callState]);

  // ── Call timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callState === 'activeCall') {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          if (prev >= 300) { handleEndCall(); return 300; }
          return prev + 1;
        });
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callState]);

  // ── AI text typewriter ────────────────────────────────────────────────────
  useEffect(() => {
    let typeInterval: ReturnType<typeof setInterval>;
    if (callState === 'activeCall') {
      setIsSpeaking(true);
      setAiTranscript('');
      const words = aiFullText.split(' ');
      let i = 0;
      typeInterval = setInterval(() => {
        if (i < words.length) {
          setAiTranscript(prev => prev + (prev ? ' ' : '') + words[i]);
          i++;
        } else {
          setIsSpeaking(false);
          clearInterval(typeInterval);
        }
      }, 150);
    }
    return () => clearInterval(typeInterval);
  }, [callState, aiFullText]);

  // ── Start mic when call opens; stop when it closes ───────────────────────
  useEffect(() => {
    if (callState === 'activeCall') {
      resetTranscript();
      // Start listening only after AI finishes speaking
      // (handled by isSpeaking → false transition below)
    } else {
      stopListening();
    }
  }, [callState]); // eslint-disable-line

  // ── Auto-start listening after AI finishes its greeting ──────────────────
  useEffect(() => {
    if (!isSpeaking && callState === 'activeCall' && !isMuted) {
      startListening();
    }
    if (isSpeaking && isListening) {
      stopListening();
    }
  }, [isSpeaking]); // eslint-disable-line

  // ── Mute toggle wires into start/stop ────────────────────────────────────
  const handleMuteToggle = useCallback(() => {
    if (!isMuted) {
      stopListening();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      if (!isSpeaking) startListening();
    }
  }, [isMuted, isSpeaking, startListening, stopListening]);

  // ── End call cleanly ──────────────────────────────────────────────────────
  const handleEndCall = useCallback(() => {
    stopListening();
    setIsMuted(false);
    resetTranscript();
    setCallState('idle');
  }, [stopListening, resetTranscript]);

  // ── Chip click — re-trigger AI typewriter with a new question ─────────────
  const handleChipClick = useCallback((text: string) => {
    stopListening();
    resetTranscript();
    setAiFullText(text);
    setCallState('activeCall');
  }, [stopListening, resetTranscript]);

  // ── Chat initial greeting ─────────────────────────────────────────────────
  useEffect(() => {
    if (callState === 'activeChat' && chatMessages.length === 0) {
      setIsAiTypingChat(true);
      const t = setTimeout(() => {
        setChatMessages([{ id: 1, sender: 'ai', text: "Hey! I'm Pranav's AI assistant. Ask me about his skills, experience, or projects." }]);
        setIsAiTypingChat(false);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [callState, chatMessages.length]);

  // ── Escape always closes ──────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && callState !== 'idle') handleEndCall();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [callState, handleEndCall]);

  // ── Chat send ─────────────────────────────────────────────────────────────
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsAiTypingChat(true);
    setTimeout(() => {
      const reply: ChatMessage = {
        id: Date.now(), sender: 'ai',
        text: "Thanks for chatting! This is a simulated response — AI backend coming soon.",
      };
      setChatMessages(prev => [...prev, reply]);
      setIsAiTypingChat(false);
    }, 1500);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const isIdleLong = callState === 'activeCall' && !isSpeaking && elapsedSeconds > 0 && elapsedSeconds % 10 === 0;

  // ── Mic permission badge ──────────────────────────────────────────────────
  const MicPermissionBadge = () => {
    if (micPermission === 'granted' || micPermission === 'prompt') return null;
    if (micPermission === 'unsupported') {
      return (
        <div className="flex items-center gap-2 text-[#aaa] font-mono text-[11px]">
          <MicOff size={13} /> Use Chrome for voice features
        </div>
      );
    }
    // denied
    return (
      <div className="flex items-center gap-2 font-mono text-[11px]" style={{ color: '#dc2626' }}>
        <MicOff size={13} /> Please allow mic access in browser settings
      </div>
    );
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MODAL CONTENT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const modalContent = callState !== 'idle' ? (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 m-0 bg-background/60 backdrop-blur-md animate-fadeUp"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >

      {/* ─────────────── CHOICE MENU ─────────────── */}
      {callState === 'choice' && (
        <div className="relative w-full max-w-[420px] bg-background border border-border rounded-[32px] p-8 flex flex-col items-center shadow-2xl overflow-hidden">
          <button
            onClick={() => setCallState('idle')}
            className="absolute top-5 right-5 p-2 text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 rounded-full"
          >
            <X size={18} />
          </button>

          <div className="w-24 h-24 mb-5 relative">
            <div className="absolute inset-0 rounded-full border border-border animate-ping opacity-20" />
            <img src={avatarUrl} alt="Pranav" className="w-full h-full rounded-full object-cover border-4 border-background shadow-xl relative z-10" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-1 tracking-tight">Talk to Pranav</h2>
          <p className="text-sm text-muted-foreground mb-8">Choose how you'd like to interact</p>

          <div className="flex flex-col gap-4 w-full">
            {/* Voice option */}
            <button
              onClick={() => {
                setAiFullText(INITIAL_TRANSCRIPT);
                setCallState('activeCall');
              }}
              className="flex items-center gap-5 p-4 rounded-2xl bg-secondary hover:bg-muted border border-transparent hover:border-border transition-all group shadow-sm text-left"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Mic size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground text-[15px]">Chat with me</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">Live audio conversation</div>
              </div>
            </button>

            {/* Text chat option */}
            <button
              onClick={() => setCallState('activeChat')}
              className="flex items-center gap-5 p-4 rounded-2xl bg-secondary hover:bg-muted border border-transparent hover:border-border transition-all group shadow-sm text-left"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <MessageCircle size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground text-[15px]">Ask question via AI</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">Get answers instantly</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────── ACTIVE VOICE CALL ─────────────── */}
      {callState === 'activeCall' && (
        <div className="relative w-full max-w-[760px] bg-[#0a0a0a] border border-[#222] rounded-[32px] overflow-hidden flex flex-col shadow-2xl h-[85vh] max-h-[640px]">

          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f] bg-[#0d0d0d]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-[pulse_2s_infinite] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-white/80 font-mono text-[12px] tracking-wide">Live</span>
            </div>

            <div className="flex items-center gap-4 text-[#666] font-mono text-[11px]">
              <span className="text-white w-8 text-right">{formatTime(elapsedSeconds)}</span>
              <div className="w-32 h-[2px] bg-[#222] rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 transition-all duration-1000 ease-linear"
                  style={{ width: `${(elapsedSeconds / 300) * 100}%` }}
                />
              </div>
              <span className="w-12">{formatTime(300 - elapsedSeconds)}</span>
            </div>

            <button
              onClick={handleEndCall}
              className="text-[#666] hover:text-white transition-colors bg-[#1a1a1a] p-1.5 rounded-full border border-[#2a2a2a]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">

            {/* Left column */}
            <div className="w-[240px] p-8 border-r border-[#1f1f1f] flex flex-col items-start bg-[#0d0d0d]">
              <img
                src={avatarUrl}
                alt="Pranav Gawai"
                className="w-[64px] h-[64px] rounded-full border border-[#333] object-cover mb-5 bg-[#111] shadow-xl"
              />
              <h3 className="text-white text-[16px] font-semibold tracking-tight">Pranav Gawai</h3>
              <p className="text-[#888] text-[13px] mb-8 font-mono">Developer</p>

              <div className="w-full h-[1px] bg-[#1a1a1a] mb-8" />

              <div className="space-y-3">
                <p className="text-[#555] text-[11px] leading-relaxed font-mono">» powered by ai</p>
                <p className="text-[#555] text-[11px] leading-relaxed font-mono">» responses may vary</p>
                <p className="text-[#555] text-[11px] leading-relaxed font-mono">» built by pranav</p>
              </div>
            </div>

            {/* Right column — transcript area */}
            <div className="flex-1 p-10 overflow-y-auto bg-[#0a0a0a] flex flex-col justify-end gap-4">

              {/* Mic permission warning (shown until granted) */}
              {micPermission === 'prompt' && !isListening && !isSpeaking && (
                <div className="flex items-center gap-2 text-[#666] font-mono text-[11px] animate-fadeUp">
                  <Mic size={13} className="text-[#555]" />
                  Microphone access needed
                </div>
              )}

              {/* Mic denied / unsupported error */}
              {(micPermission === 'denied' || micPermission === 'unsupported') && (
                <div className="flex items-center gap-2 font-mono text-[11px] animate-fadeUp" style={{ color: micPermission === 'unsupported' ? '#aaa' : '#dc2626' }}>
                  <MicOff size={13} />
                  {micError}
                </div>
              )}

              {/* AI transcript (white) */}
              {aiTranscript && (
                <p className="text-white/90 text-[22px] leading-[1.6] font-sans font-light tracking-wide">
                  {aiTranscript}
                  {isSpeaking && (
                    <span className="inline-block w-1.5 h-[22px] bg-white ml-1 align-middle animate-pulse" />
                  )}
                </p>
              )}

              {/* User live transcript */}
              {(userTranscript || interimTranscript) && (
                <div className="border-t border-[#1f1f1f] pt-4 animate-fadeUp">
                  {userTranscript && (
                    <p className="text-white/70 text-[16px] leading-[1.6] font-mono font-light">
                      {userTranscript}
                    </p>
                  )}
                  {interimTranscript && (
                    <p className="text-[#666] text-[16px] leading-[1.6] font-mono italic">
                      {interimTranscript}
                      <span className="inline-block w-1 h-[16px] bg-[#555] ml-1 align-middle animate-pulse" />
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-[#1f1f1f] bg-[#0d0d0d] p-6 px-8 flex flex-col gap-6 relative">

            {/* Glow backing */}
            {waveMode !== 'idle' && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[40px] blur-[30px] rounded-full pointer-events-none transition-colors duration-500"
                style={{ background: waveMode === 'user' ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.05)' }}
              />
            )}

            {/* Waveform */}
            <div className="relative flex items-center justify-center h-[56px] w-full">
              <div className="flex justify-center items-center gap-[3px] h-full absolute inset-0">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full transition-all duration-300"
                    style={getBarStyle(waveMode, i)}
                  />
                ))}
              </div>

              {/* "Thinking…" label when AI is idle long */}
              <div className={`absolute right-4 text-[#555] font-mono text-[11px] transition-opacity duration-1000 ${isIdleLong ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                Thinking...
              </div>

              {/* Listening indicator */}
              {isListening && !isMuted && (
                <div className="absolute left-4 flex items-center gap-1.5 text-[#8b5cf6] font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
                  Listening
                </div>
              )}
            </div>

            {/* Suggested chips */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {['Tell me about yourself', "What projects have you built?", "What's your tech stack?", 'Are you open to work?'].map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(q)}
                  className="whitespace-nowrap border border-[#2a2a2a] text-[#aaa] text-[12px] font-sans rounded-full px-4 py-2 hover:bg-[#1a1a1a] hover:text-white hover:border-[#444] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Action row */}
            <div className="flex items-center justify-between pt-2">

              {/* Mic permission badge shown here only when denied/unsupported */}
              <MicPermissionBadge />

              {/* Mute button (only when permission is ok) */}
              {(micPermission === 'granted' || micPermission === 'prompt') && (
                <button
                  onClick={handleMuteToggle}
                  className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-full border transition-all font-mono text-[12px] tracking-wide ${isMuted ? 'border-[#333] bg-[#111] text-[#666]' : 'border-transparent bg-[#1a1a1a] text-white hover:bg-[#222]'}`}
                >
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  {isMuted ? 'Muted' : 'Mute'}
                </button>
              )}

              {/* End call */}
              <button
                onClick={handleEndCall}
                className="flex items-center justify-center gap-2.5 px-8 py-3 rounded-full bg-[#ef4444] hover:bg-[#dc2626] active:scale-95 transition-all font-mono text-[12px] text-white tracking-wide shadow-[0_4px_14px_0_rgba(239,68,68,0.39)]"
              >
                <PhoneOff size={16} />
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────── ACTIVE TEXT CHAT ─────────────── */}
      {callState === 'activeChat' && (
        <div className="relative w-full max-w-[500px] h-[70vh] min-h-[500px] bg-background border border-border shadow-2xl rounded-[28px] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={avatarUrl} className="w-10 h-10 rounded-full border border-border object-cover" alt="Pranav" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-foreground leading-tight">Pranav's AI</h3>
                <p className="text-[12px] text-muted-foreground font-medium">Always Online</p>
              </div>
            </div>
            <button
              onClick={() => { setCallState('idle'); setChatMessages([]); }}
              className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-muted border border-border rounded-full transition-colors text-foreground"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {msg.sender === 'ai' && (
                  <img src={avatarUrl} className="w-8 h-8 rounded-full border border-border object-cover flex-shrink-0" alt="Pranav" />
                )}
                <div className={`p-3.5 px-5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-secondary text-foreground rounded-tl-sm border border-border'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiTypingChat && (
              <div className="flex gap-3 max-w-[85%] self-start animate-fadeUp">
                <img src={avatarUrl} className="w-8 h-8 rounded-full border border-border object-cover flex-shrink-0" alt="Pranav" />
                <div className="p-3.5 px-5 rounded-2xl bg-secondary rounded-tl-sm border border-border flex items-center gap-1.5 h-[46px]">
                  <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-secondary/30">
            <form onSubmit={handleSendChat} className="flex items-center gap-2">
              <button
                type="button"
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors bg-background border border-border rounded-full hover:bg-secondary"
              >
                <Plus size={18} />
              </button>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message Pranav's AI..."
                className="flex-1 bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-full px-5 py-3 text-[14px] focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-3 bg-primary text-primary-foreground rounded-full shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center"
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  ) : null;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NAVBAR TRIGGER BUTTON
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <>
      <button
        onClick={() => setCallState('choice')}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border bg-background hover:bg-secondary transition-all font-mono text-[11px] text-muted-foreground hover:text-foreground group"
      >
        {callState !== 'idle' ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_2s_infinite] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            On call...
          </>
        ) : (
          <>
            Talk to my AI <Sparkles size={12} className="text-muted-foreground/60 group-hover:text-primary transition-colors" />
          </>
        )}
      </button>

      {mounted && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
};

export default AiCallFeature;
