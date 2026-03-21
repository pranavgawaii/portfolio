import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Phone, PhoneOff, Mic, MicOff, X, Sparkles, MessageCircle, Send, Plus } from 'lucide-react';

type CallState = 'idle' | 'choice' | 'activeCall' | 'activeChat';
type ChatMessage = { id: number; sender: 'ai' | 'user'; text: string };

const INITIAL_TRANSCRIPT = "Hey! I'm Pranav's AI. I'm a full-stack developer from Pune, India. You're on my portfolio — ask me anything about my work, projects, or tech stack. Let's go!";

const AiCallFeature: React.FC = () => {
  const [callState, setCallState] = useState<CallState>('idle');
  
  // Call State
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [callTranscript, setCallTranscript] = useState('');
  const [fullTranscript, setFullTranscript] = useState(INITIAL_TRANSCRIPT);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTypingChat, setIsAiTypingChat] = useState(false);

  const [mounted, setMounted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (callState === 'activeChat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTypingChat, callState]);

  // Handle Call Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callState === 'activeCall') {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          if (prev >= 300) {
            setCallState('idle'); // or 'ended'
            return 300;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Handle Call AI speaking effect
  useEffect(() => {
    let typeInterval: ReturnType<typeof setInterval>;
    if (callState === 'activeCall') {
      setIsSpeaking(true);
      setCallTranscript('');
      const words = fullTranscript.split(' ');
      let currentWord = 0;
      
      typeInterval = setInterval(() => {
        if (currentWord < words.length) {
          setCallTranscript(prev => prev + (prev ? ' ' : '') + words[currentWord]);
          currentWord++;
        } else {
          setIsSpeaking(false);
          clearInterval(typeInterval);
        }
      }, 150);
    }
    return () => clearInterval(typeInterval);
  }, [callState, fullTranscript]);

  // Handle initial Chat AI message
  useEffect(() => {
    if (callState === 'activeChat' && chatMessages.length === 0) {
      setIsAiTypingChat(true);
      const timer = setTimeout(() => {
        setChatMessages([{ id: 1, sender: 'ai', text: "Hey! I'm Pranav's AI assistant. You can ask me about his skills, experience, or projects." }]);
        setIsAiTypingChat(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [callState, chatMessages.length]);

  // Handle Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && callState !== 'idle') {
        setCallState('idle');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callState]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsAiTypingChat(true);

    setTimeout(() => {
      const reply: ChatMessage = { id: Date.now(), sender: 'ai', text: "Thanks for chatting! This is a simulated response for now. Pranav is actively working on the AI backend integration!" };
      setChatMessages(prev => [...prev, reply]);
      setIsAiTypingChat(false);
    }, 1500);
  };

  const handleChipClick = (text: string) => {
    setFullTranscript(text);
    setCallState('activeCall'); 
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isIdleLong = callState === 'activeCall' && !isSpeaking && elapsedSeconds > 0 && elapsedSeconds % 10 === 0;

  const avatarUrl = "/avatar.jpg";

  const modalContent = callState !== 'idle' ? (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 m-0 bg-background/60 backdrop-blur-md animate-fadeUp"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      
      {/* ---------------- CHOICE MENU ---------------- */}
      {callState === 'choice' && (
        <div className="relative w-full max-w-[420px] bg-background border border-border rounded-[32px] p-8 flex flex-col items-center shadow-2xl overflow-hidden">
          <button onClick={() => setCallState('idle')} className="absolute top-5 right-5 p-2 text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 rounded-full">
            <X size={18} />
          </button>

          <div className="w-24 h-24 mb-5 relative">
             <div className="absolute inset-0 rounded-full border border-border animate-ping opacity-20" />
             <img src={avatarUrl} alt="Pranav" className="w-full h-full rounded-full object-cover border-4 border-background shadow-xl relative z-10" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-1 tracking-tight">Talk to Pranav</h2>
          <p className="text-sm text-muted-foreground mb-8">Choose how you'd like to interact</p>

          <div className="flex flex-col gap-4 w-full">
            <button 
              onClick={() => { setCallState('activeCall'); setFullTranscript(INITIAL_TRANSCRIPT); }} 
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

      {/* ---------------- ACTIVE VOICE CALL (Old Landscape Version) ---------------- */}
      {callState === 'activeCall' && (
        <div className="relative w-full max-w-[760px] bg-[#0a0a0a] border border-[#222] rounded-[32px] overflow-hidden flex flex-col shadow-2xl h-[85vh] max-h-[640px]">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f] bg-[#0d0d0d]">
             <div className="flex items-center gap-2.5">
               <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-[pulse_2s_infinite] shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
               <span className="text-white/80 font-mono text-[12px] tracking-wide">Live</span>
             </div>
             
             <div className="flex items-center gap-4 text-[#666] font-mono text-[11px]">
               <span className="text-white w-8 text-right">{formatTime(elapsedSeconds)}</span>
               <div className="w-32 h-[2px] bg-[#222] rounded-full overflow-hidden">
                 <div className="h-full bg-white/80 transition-all duration-1000 ease-linear" style={{ width: `${(elapsedSeconds/300)*100}%`}}></div>
               </div>
               <span className="w-12">{formatTime(300 - elapsedSeconds)}</span>
             </div>

             <button onClick={() => setCallState('idle')} className="text-[#666] hover:text-white transition-colors bg-[#1a1a1a] p-1.5 rounded-full border border-[#2a2a2a]">
                <X size={16} />
             </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Column */}
            <div className="w-[240px] p-8 border-r border-[#1f1f1f] flex flex-col items-start bg-[#0d0d0d]">
              <img 
                src={avatarUrl}
                alt="Pranav Gawai" 
                className="w-[64px] h-[64px] rounded-full border border-[#333] object-cover mb-5 bg-[#111] shadow-xl"
              />
              <h3 className="text-white text-[16px] font-semibold tracking-tight">Pranav Gawai</h3>
              <p className="text-[#888] text-[13px] mb-8 font-mono">Developer</p>

              <div className="w-full h-[1px] bg-[#1a1a1a] mb-8"></div>

              <div className="space-y-3">
                <p className="text-[#555] text-[11px] leading-relaxed font-mono">» powered by ai</p>
                <p className="text-[#555] text-[11px] leading-relaxed font-mono">» responses may vary</p>
                <p className="text-[#555] text-[11px] leading-relaxed font-mono">» built by pranav</p>
              </div>
            </div>

            {/* Right Column Transcript */}
            <div className="flex-1 p-10 overflow-y-auto bg-[#0a0a0a] flex flex-col justify-end">
               <p className="text-white/90 text-[22px] leading-[1.6] font-sans font-light tracking-wide mix-blend-plus-lighter">
                 {callTranscript}
                 {isSpeaking && <span className="inline-block w-1.5 h-[22px] bg-white ml-1 align-middle animate-pulse"></span>}
               </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#1f1f1f] bg-[#0d0d0d] p-6 px-8 flex flex-col gap-6 relative">
            
            {/* Glow backing for wavelength */}
            {isSpeaking && !isMuted && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[40px] bg-white/5 blur-[30px] rounded-full pointer-events-none"></div>
            )}

            {/* Premium Wavelength and idle text */}
            <div className="relative flex items-center justify-center h-[56px] w-full">
              <div className="flex justify-center items-center gap-[3px] h-full absolute inset-0">
                {[...Array(50)].map((_, i) => {
                  const delay = (i * 0.06) - 4; // smooth phase shift for continuous wave
                  return (
                    <div 
                      key={i} 
                      className={`w-[3px] rounded-full transition-all duration-300 ${isSpeaking && !isMuted ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]' : 'bg-[#2a2a2a]'}`}
                      style={{
                          height: '4px',
                          animation: isSpeaking && !isMuted ? `wavePremium 1.2s infinite ease-in-out ${delay}s` : 'none',
                      }}
                    ></div>
                  );
                })}
              </div>
              
              <div className={`absolute right-4 text-[#555] font-mono text-[11px] transition-opacity duration-1000 ${isIdleLong ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                Thinking...
              </div>
            </div>

            {/* Suggested questions */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                "Tell me about yourself",
                "What projects have you built?",
                "What's your tech stack?",
                "Are you open to work?",
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => handleChipClick(q)}
                  className="whitespace-nowrap border border-[#2a2a2a] text-[#aaa] text-[12px] font-sans rounded-full px-4 py-2 hover:bg-[#1a1a1a] hover:text-white hover:border-[#444] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
               <button 
                 onClick={() => setIsMuted(!isMuted)}
                 className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-full border transition-all font-mono text-[12px] tracking-wide ${isMuted ? 'border-[#333] bg-[#111] text-[#666]' : 'border-transparent bg-[#1a1a1a] text-white hover:bg-[#222]'}`}
               >
                 {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                 {isMuted ? 'Muted' : 'Mute Voice'}
               </button>
               <button 
                 onClick={() => setCallState('idle')}
                 className="flex items-center justify-center gap-2.5 px-8 py-3 rounded-full bg-[#ef4444] hover:bg-[#dc2626] active:scale-95 transition-all font-mono text-[12px] text-white tracking-wide shadow-[0_4px_14px_0_rgba(239,68,68,0.39)]"
               >
                 <PhoneOff size={16} />
                 End Call
               </button>
            </div>

          </div>
        </div>
      )}

      {/* ---------------- ACTIVE TEXT CHAT ---------------- */}
      {callState === 'activeChat' && (
        <div className="relative w-full max-w-[500px] h-[70vh] min-h-[500px] bg-background border border-border shadow-2xl rounded-[28px] flex flex-col overflow-hidden">
          
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
             <button onClick={() => { setCallState('idle'); setChatMessages([]); }} className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-muted border border-border rounded-full transition-colors text-foreground">
                <X size={14} />
             </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
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
                  <div className="p-3.5 px-5 rounded-2xl bg-secondary rounded-tl-sm border border-border flex items-center justify-center gap-1.5 h-[46px]">
                     <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                     <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
               </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-border bg-secondary/30">
            <form onSubmit={handleSendChat} className="flex items-center gap-2">
               <button type="button" className="p-2.5 text-muted-foreground hover:text-foreground transition-colors bg-background border border-border rounded-full hover:bg-secondary">
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

  return (
    <>
      <button 
        onClick={() => setCallState('choice')}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border bg-background hover:bg-secondary transition-all font-mono text-[11px] text-muted-foreground hover:text-foreground group"
      >
        {callState !== 'idle' ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_2s_infinite] shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
            On call...
          </>
        ) : (
          <>
            Talk to my AI <Sparkles size={12} className="text-muted-foreground/60 group-hover:text-primary transition-colors" />
          </>
        )}
      </button>

      {/* Render modal directly into the document root via Portal */}
      {mounted && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
};

export default AiCallFeature;
