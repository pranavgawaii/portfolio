import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, MicOff, Send, MessageCircle, Volume2, Timer, Loader2 } from 'lucide-react';
import { useGroqChat } from '../../hooks/useGroqChat';

// ── Knowledge base ────────────────────────────────────────────────────────────
const KB: Array<{ patterns: RegExp; answer: string; demo?: 'auren' }> = [
  {
    patterns: /who are you|about pranav|introduce|yourself/i,
    answer: "I'm Pranav Gawai - a pre-final year B.Tech CSE (AI/ML) student at MIT-ADT University, Pune. I build AI-native SaaS products, compete in national hackathons, and work at CraftaStudio as a Software Developer. I'm targeting AI-first startup roles.",
  },
  {
    patterns: /best project|show project|demo|auren|favorite|top project/i,
    answer: "My best project is **Auren** - an AI execution agent built solo in ~6 days. It connects Gmail, Google Calendar, and GitHub via the Model Context Protocol. Every action requires Human-in-the-Loop approval. Let me show you how it's architected:",
    demo: 'auren',
  },
  {
    patterns: /project|build|built|shipped/i,
    answer: "I've shipped 6 projects: **Auren** (AI execution agent with MCP), **Rovn** (AI omnichannel inbox - Top 1% of 10K at OpenAI hackathon), **Specboard** (multi-tenant PRD tracker), **MedSecure24** (healthcare compliance SaaS), **Sahara** (RAG-based student assistant), and **PlacePro** (placement management system). Ask me to 'show Auren' for a live architecture demo!",
  },
  {
    patterns: /experience|job|work|internship|company|craftastudio|danges|yes boss/i,
    answer: "I'm currently a Software Developer at **CraftaStudio** (Jan 2026 – Present), building an AI-native code generation platform. I also freelance for **Danges Academy** (Nov 2025). Previously interned at **Yes Boss Technology** (Jun–Sep 2025) building Django REST APIs, improving latency by ~30%.",
  },
  {
    patterns: /skill|tech|stack|language|framework/i,
    answer: "Core stack: **TypeScript, Python, Next.js, React, FastAPI, Node.js**. Databases: PostgreSQL, Supabase, Redis. AI: Claude Haiku, OpenRouter, Groq, pgvector. Infra: Vercel, Railway, Docker. Tools: Prisma, BullMQ, ReactFlow, Monaco Editor, Clerk.",
  },
  {
    patterns: /education|university|college|degree|mit/i,
    answer: "I'm at **MIT-ADT University, Pune** doing B.Tech CSE with AI/ML specialisation (2023–2027). Also serving as **Placement Coordinator** - helping batchmates prep for interviews and land engineering roles.",
  },
  {
    patterns: /hackathon|award|win|achievement|rank|top/i,
    answer: "Key wins: **Top 1% of 10,000+ teams** at the OpenAI × Outskill Hackathon with Rovn (88/100 judge score). Built **Auren** solo in ~6 days for the Corsair × ChaiCode Hackathon. Currently competing in ChaiCode Builder Mode On with Specboard.",
  },
  {
    patterns: /contact|reach|hire|email|dm|message/i,
    answer: "Reach me at pranavgawai1518@gmail.com, X @pranavgawai_, LinkedIn at linkedin.com/in/pranavgawai, or GitHub at github.com/pranavgawaii. Open to AI-first startup roles and interesting freelance projects.",
  },
  {
    patterns: /dsa|leetcode|coding|striver/i,
    answer: "I'm currently doing the **Striver SDE Sheet** challenge - solving one problem daily and posting on X. All solutions (code + markdown notes) are on GitHub at github.com/pranavgawaii/Striver-SDE-Sheet. Check the DSA page on this site for progress!",
  },
];

const OFF_TOPIC = "I'm focused on Pranav's professional work - try asking about his projects, experience, skills, education, or how to contact him. You can also say 'show best project' for a live demo!";

function getResponse(query: string): { answer: string; demo?: 'auren' } {
  const trimmed = query.trim();
  if (!trimmed) return { answer: "Go ahead - ask me anything about Pranav, his projects, experience, or skills." };
  for (const { patterns, answer, demo } of KB) {
    if (patterns.test(trimmed)) return { answer, demo };
  }
  return { answer: OFF_TOPIC };
}

// ── Bold renderer ─────────────────────────────────────────────────────────────
function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="text-neutral-900 dark:text-white">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

// ── Auren architecture demo ───────────────────────────────────────────────────
const AUREN_LAYERS = [
  { label: 'Frontend',        tech: 'Next.js + Clerk Auth',       color: '#3B82F6' },
  { label: 'MCP Layer',       tech: 'Corsair MCP integrations',   color: '#8B5CF6' },
  { label: 'AI Core',         tech: 'Claude Haiku + OpenRouter',  color: '#10B981' },
  { label: 'Memory',          tech: 'Supabase + pgvector',        color: '#F59E0B' },
  { label: 'Human-in-Loop',   tech: 'Confirmation UI gate',       color: '#EF4444' },
];

const AurenDemo: React.FC = () => {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= AUREN_LAYERS.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 600);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="mt-3 rounded-xl border border-border-light dark:border-border-dark bg-neutral-50 dark:bg-[#0f0f0f] p-4 overflow-hidden">
      <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">Auren - System Architecture</p>
      <div className="flex flex-col gap-2">
        {AUREN_LAYERS.map((layer, i) => (
          <AnimatePresence key={i}>
            {i < visible && (
              <motion.div
                initial={{ opacity: 0, x: -12, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              >
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border"
                  style={{ borderColor: layer.color + '55', backgroundColor: layer.color + '10' }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-widest block opacity-50" style={{ color: layer.color }}>
                      {layer.label}
                    </span>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">{layer.tech}</span>
                  </div>
                </div>
                {i < AUREN_LAYERS.length - 1 && (
                  <div className="flex flex-col items-center ml-4 py-0.5">
                    <div className="w-px h-2 bg-neutral-300 dark:bg-neutral-700" />
                    <svg width="7" height="4" viewBox="0 0 7 4"><path d="M0 0L3.5 4L7 0" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-neutral-400"/></svg>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
};

// ── Voice countdown ───────────────────────────────────────────────────────────
const VOICE_LIMIT = 5 * 60; // 5 minutes

interface Msg { role: 'user' | 'bot'; text: string; demo?: 'auren' }
interface Props { isOpen: boolean; onClose: () => void }

const AskMeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab]               = useState<'chat' | 'voice'>('chat');
  const [msgs, setMsgs]             = useState<Msg[]>([{ role: 'bot', text: 'Hey! Ask me anything about Pranav — his projects, experience, skills, or how to reach him. Try "show best project" for a live demo!' }]);
  const [input, setInput]           = useState('');
  const groq = useGroqChat();
  const [listening, setListening]   = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceAnswer, setVoiceAnswer]         = useState('');
  const [timeLeft, setTimeLeft]     = useState(VOICE_LIMIT);
  const [sessionActive, setSessionActive] = useState(false);
  const endRef   = useRef<HTMLDivElement>(null);
  const recRef   = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const transcriptRef = useRef('');

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      window.speechSynthesis?.cancel();
      clearInterval(timerRef.current);
      setTimeLeft(VOICE_LIMIT);
      setSessionActive(false);
      groq.clearHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (sessionActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      stopListening();
      window.speechSynthesis?.cancel();
      setSessionActive(false);
    }
    return () => clearInterval(timerRef.current);
  }, [sessionActive, timeLeft]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || groq.isThinking || groq.isStreaming) return;
    setInput('');
    // Check for Auren demo trigger first (local KB)
    const local = getResponse(q);
    if (local.demo === 'auren') {
      setMsgs(m => [...m, { role: 'user', text: q }, { role: 'bot', text: local.answer, demo: 'auren' }]);
      return;
    }
    // Otherwise use real Groq AI
    setMsgs(m => [...m, { role: 'user', text: q }]);
    await groq.sendMessage(q);
  };

  // Sync Groq streaming response into msgs
  useEffect(() => {
    if (groq.isStreaming && groq.aiResponse) {
      setMsgs(m => {
        const last = m[m.length - 1];
        if (last?.role === 'bot' && last.text !== groq.aiResponse) {
          return [...m.slice(0, -1), { role: 'bot', text: groq.aiResponse }];
        }
        if (last?.role === 'user') {
          return [...m, { role: 'bot', text: groq.aiResponse }];
        }
        return m;
      });
    }
  }, [groq.aiResponse, groq.isStreaming]);

  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const startListening = useCallback(() => {
    if (!SpeechRec) { alert('Speech recognition not supported in this browser.'); return; }
    if (!sessionActive) { setSessionActive(true); setTimeLeft(VOICE_LIMIT); }
    window.speechSynthesis?.cancel();
    const rec = new SpeechRec();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onstart = () => { setListening(true); setVoiceStatus('listening'); setVoiceTranscript(''); transcriptRef.current = ''; };
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setVoiceTranscript(t);
      transcriptRef.current = t;
    };
    rec.onend = () => {
      setListening(false);
      const q = transcriptRef.current;
      if (!q.trim()) { setVoiceStatus('idle'); return; }
      setVoiceStatus('speaking');
      const { answer } = getResponse(q);
      const clean = answer.replace(/\*\*/g, '');
      setVoiceAnswer(clean);
      const utt = new SpeechSynthesisUtterance(clean);
      utt.rate = 1.05;
      utt.onend = () => setVoiceStatus('idle');
      window.speechSynthesis.speak(utt);
    };
    rec.onerror = () => { setListening(false); setVoiceStatus('idle'); };
    recRef.current = rec;
    rec.start();
  }, [SpeechRec, sessionActive]);

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
    setVoiceStatus('idle');
  };

  const isSessionExpired = sessionActive && timeLeft === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 48, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 32, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full sm:max-w-md bg-white dark:bg-[#0f0f0f] sm:rounded-2xl rounded-t-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col"
            style={{ maxHeight: '88dvh', paddingBottom: 'env(safe-area-inset-bottom)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <div>
                <p className="font-sans font-bold text-base text-neutral-900 dark:text-white">Ask me anything</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">About Pranav · projects · experience · skills</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 transition-colors text-lg">×</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 pt-3 shrink-0">
              {(['chat', 'voice'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    if (t === 'voice') {
                      const utt = new SpeechSynthesisUtterance("Voice feature coming soon");
                      window.speechSynthesis?.cancel();
                      window.speechSynthesis?.speak(utt);
                    }
                    setTab(t);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    tab === t
                      ? 'bg-neutral-100 dark:bg-white/[0.08] text-neutral-900 dark:text-white'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {t === 'chat' ? <MessageCircle size={12} /> : <Mic size={12} />}
                  {t === 'chat' ? 'Chat' : 'Voice'}
                </button>
              ))}
            </div>

            {/* ── Chat tab ── */}
            {tab === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
                  {msgs.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[88%] ${m.role === 'user' ? '' : 'w-full'}`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-br-sm'
                            : 'bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 rounded-bl-sm'
                        }`}>
                          {m.role === 'bot' ? <Bold text={m.text} /> : m.text}
                        </div>
                        {m.demo === 'auren' && <AurenDemo />}
                      </div>
                    </div>
                  ))}
                  {/* Thinking indicator */}
                  {groq.isThinking && (
                    <div className="flex justify-start">
                      <div className="bg-neutral-100 dark:bg-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                        {[0, 1, 2].map(i => (
                          <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* Quick chips */}
                <div className="px-5 pb-2 flex gap-1.5 flex-wrap shrink-0">
                  {['Show best project', 'Projects', 'Experience', 'Skills', 'Contact'].map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>

                <div className="px-5 pb-5 shrink-0">
                  <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Ask something..."
                      className="flex-1 bg-neutral-100 dark:bg-white/[0.05] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-blue-500/40 transition-colors"
                    />
                    <button type="submit" className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors shrink-0">
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* ── Voice tab ── */}
            {tab === 'voice' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-0 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400 mb-6 relative">
                  <span className="absolute inset-0 rounded-full border border-neutral-200 dark:border-neutral-700 animate-ping opacity-20" />
                  <Mic size={32} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Voice AI Coming Soon</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[250px] mx-auto leading-relaxed">
                  Real-time conversational AI with Pranav's voice clone is currently in development.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AskMeModal;
