import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Phone, PhoneOff, Mic, MicOff, X, Sparkles } from 'lucide-react';

type CallState = 'idle' | 'incoming' | 'active' | 'ended';

const INITIAL_TRANSCRIPT = "Hey! I'm Pranav. I'm a full-stack developer from Pune, India. You're on my portfolio — ask me anything about my work, projects, or tech stack. Let's go!";

const AiCallFeature: React.FC = () => {
  const [callState, setCallState] = useState<CallState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [fullTranscript, setFullTranscript] = useState(INITIAL_TRANSCRIPT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callState === 'active') {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          if (prev >= 300) {
            setCallState('ended');
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

  // Typewriter effect
  useEffect(() => {
    let typeInterval: ReturnType<typeof setInterval>;
    if (callState === 'active') {
      setIsSpeaking(true);
      setTranscript('');
      const words = fullTranscript.split(' ');
      let currentWord = 0;
      
      typeInterval = setInterval(() => {
        if (currentWord < words.length) {
          setTranscript(prev => prev + (prev ? ' ' : '') + words[currentWord]);
          currentWord++;
        } else {
          setIsSpeaking(false);
          clearInterval(typeInterval);
        }
      }, 150);
    }
    return () => clearInterval(typeInterval);
  }, [callState, fullTranscript]);

  // Handle Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && callState !== 'idle') {
        setCallState('idle');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callState]);

  const handleStartCall = () => setCallState('incoming');
  const handeAnswer = () => setCallState('active');
  const handleEnd = () => setCallState('idle');

  const handleChipClick = (text: string) => {
    setFullTranscript(text);
    setCallState('active'); 
    // TODO: send chip text to STT/LLM pipeline
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isIdleLong = callState === 'active' && !isSpeaking && elapsedSeconds > 0 && elapsedSeconds % 10 === 0;

  const modalContent = callState !== 'idle' ? (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-[fadeUp_400ms_ease] p-4 m-0"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {callState === 'incoming' && (
        <div className="relative w-full max-w-[480px] bg-[#0a0a0a] border border-[#222] rounded-[32px] p-12 flex flex-col items-center shadow-2xl overflow-hidden">
          {/* Close Button */}
          <button onClick={handleEnd} className="absolute top-6 right-6 text-[#666] hover:text-white transition-colors z-20">
            <X size={20} />
          </button>

          {/* Neutral subtle glow instead of heavy purple */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="lowercase tracking-[0.2em] text-[#666] text-[11px] font-mono mb-10 z-10">
            incoming call
          </div>

           {/* Avatar section */}
          <div className="relative flex justify-center items-center mb-10 h-[180px] w-[180px]">
            {/* White/Grey Rings */}
            <div className="absolute w-[180px] h-[180px] rounded-full border border-white/5 animate-[ripple_2s_infinite]"></div>
            <div className="absolute w-[140px] h-[140px] rounded-full border border-white/10 animate-[ripple_2s_infinite_0.5s]"></div>
            <div className="absolute w-[100px] h-[100px] rounded-full border border-white/20 animate-[ripple_2s_infinite_1s]"></div>
            
            <img 
              src="https://avatars.githubusercontent.com/u/105650178" 
              alt="Pranav Gawai" 
              className="w-[88px] h-[88px] rounded-full border border-[#444] object-cover z-10 bg-[#111] shadow-2xl"
            />
          </div>

          <div className="flex flex-col items-center gap-1.5 mb-14 z-10">
            <h2 className="text-white text-[24px] font-semibold tracking-tight">Pranav Gawai</h2>
            <p className="text-[#666] text-[13px] font-mono text-center">AI · Full-stack Developer · Pune</p>
            <div className="mt-3 flex items-center gap-2 bg-[#111] border border-[#222] rounded-full px-3 py-1 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-[pulse_2s_infinite]"></span>
              <span className="text-[#888] text-[11px] font-mono lowercase tracking-wide">ready to talk</span>
            </div>
          </div>

          {/* Slide to answer */}
          <div className="relative w-[80%] h-[64px] bg-[#111] border border-[#2a2a2a] rounded-[32px] p-[6px] flex items-center overflow-hidden z-10 cursor-pointer shadow-lg" onClick={handeAnswer}>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent flex translate-x-[-100%] animate-[shimmer_2.5s_infinite]"></div>
             <button className="relative z-10 w-[50px] h-[50px] bg-[#22c55e] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-transform" onClick={(e) => { e.stopPropagation(); handeAnswer(); }}>
               <Phone size={22} className="text-white fill-white" />
             </button>
             <span className="absolute inset-0 flex items-center justify-center text-[#666] text-[12px] font-mono pointer-events-none pl-[50px] tracking-wide">
               slide to answer →
             </span>
          </div>

          <div className="mt-8 text-[#444] text-[10px] font-mono z-10">
            press esc to decline
          </div>
        </div>
      )}

      {callState === 'active' && (
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

             <button onClick={handleEnd} className="text-[#666] hover:text-white transition-colors bg-[#1a1a1a] p-1.5 rounded-full border border-[#2a2a2a]">
                <X size={16} />
             </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Column */}
            <div className="w-[240px] p-8 border-r border-[#1f1f1f] flex flex-col items-start bg-[#0d0d0d]">
              <img 
                src="https://avatars.githubusercontent.com/u/105650178"
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
                 {transcript}
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
                 onClick={handleEnd}
                 className="flex items-center justify-center gap-2.5 px-8 py-3 rounded-full bg-[#ef4444] hover:bg-[#dc2626] active:scale-95 transition-all font-mono text-[12px] text-white tracking-wide shadow-[0_4px_14px_0_rgba(239,68,68,0.39)]"
               >
                 <PhoneOff size={16} />
                 End Call
               </button>
            </div>

          </div>
          
        </div>
      )}
      
      {callState === 'ended' && (
        <div className="bg-[#0a0a0a] border border-[#222] rounded-[32px] p-10 flex flex-col items-center shadow-2xl animate-[fadeUp_400ms_ease]">
          <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center mb-6">
             <PhoneOff size={24} className="text-[#666]" />
          </div>
          <p className="text-white font-sans text-[16px] mb-8 font-light">Session ended.</p>
          <button 
            onClick={() => setCallState('idle')}
            className="px-8 py-3 bg-white hover:bg-[#f0f0f0] text-black font-mono text-[12px] rounded-full transition-colors font-medium tracking-wide"
          >
            Close
          </button>
        </div>
      )}
    </div>
  ) : null;

  return (
    <>
      <button 
        onClick={handleStartCall}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#333] bg-[#0a0a0a]/50 hover:bg-[#111] hover:border-[#666] transition-all font-mono text-[11px] text-[#aaa] hover:text-white"
      >
        {callState !== 'idle' ? (
          <>
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-[pulse_2s_infinite] shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
            On call...
          </>
        ) : (
          <>
            Talk to my AI <Sparkles size={12} className="text-white/60" />
          </>
        )}
      </button>

      {/* Render modal directly into the document root via Portal to avoid CSS filter clipping bugs */}
      {mounted && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
};

export default AiCallFeature;
