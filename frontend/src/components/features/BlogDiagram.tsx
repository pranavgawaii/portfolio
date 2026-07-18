import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Play, RefreshCw, Layers, Database, Globe, Sliders, ArrowRight, Network } from 'lucide-react';

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">{children}</div>
);

const Note = ({ children, center = false }: { children: React.ReactNode; center?: boolean }) => (
  <div className={`text-[11.5px] font-sans text-neutral-500 dark:text-neutral-400 leading-relaxed ${center ? 'text-center' : ''}`}>{children}</div>
);

const Arrow = () => <div className="text-neutral-300 dark:text-neutral-700 text-center text-xs leading-none py-1.5">↓</div>;

/* Reusable SQL Query component with elegant copy button */
const SqlQuery = ({ query }: { query: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group w-full my-2">
      <div className="absolute right-2.5 top-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/85 dark:border-neutral-700 text-[10px] font-sans font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shadow-sm"
        >
          {copied ? (
            <>
              <Check size={11} className="text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="w-full border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 font-mono text-[10.5px] leading-relaxed text-neutral-800 dark:text-neutral-200 overflow-x-auto">
        <code>{query}</code>
      </pre>
    </div>
  );
};

// ─── 1. TABLE ANATOMY ──────────────────────────────────────────────────────────
const TableAnatomy = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'schema'>('records');
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);

  const columns = [
    { name: 'id', type: 'INT', desc: 'Primary Key' },
    { name: 'name', type: 'TEXT', desc: 'User full name' },
    { name: 'email', type: 'TEXT', desc: 'Unique login email' },
    { name: 'created_at', type: 'DATE', desc: 'Record creation timestamp' }
  ];

  return (
    <div className="w-full">
      <Label>Database Schema Inspector</Label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-3 py-1 text-[11px] font-sans font-medium rounded-md border transition-all ${
            activeTab === 'records'
              ? 'bg-neutral-900 border-neutral-800 text-white dark:bg-white dark:text-neutral-900'
              : 'border-neutral-250 dark:border-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Table Records
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1 text-[11px] font-sans font-medium rounded-md border transition-all ${
            activeTab === 'schema'
              ? 'bg-neutral-900 border-neutral-800 text-white dark:bg-white dark:text-neutral-900'
              : 'border-neutral-250 dark:border-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Schema Definition (DDL)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'records' ? (
          <motion.div
            key="records"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900/40"
          >
            <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              {columns.map(c => (
                <div
                  key={c.name}
                  onMouseEnter={() => setHoveredCol(c.name)}
                  onMouseLeave={() => setHoveredCol(null)}
                  className={`font-mono text-[10px] font-bold cursor-help transition-colors ${
                    hoveredCol === c.name ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
                  }`}
                  title={`${c.type} - ${c.desc}`}
                >
                  {c.name} <span className="text-[8px] font-normal opacity-60">({c.type})</span>
                </div>
              ))}
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-4 gap-2 px-3 py-2 border border-neutral-900 dark:border-neutral-100 rounded-lg bg-white dark:bg-neutral-950 font-mono text-[10.5px]">
                <div className={hoveredCol === 'id' ? 'font-bold' : ''}>1</div>
                <div className={`font-sans ${hoveredCol === 'name' ? 'font-bold' : ''}`}>Pranav</div>
                <div className={`truncate ${hoveredCol === 'email' ? 'font-bold' : ''}`}>pranav@pranavx.in</div>
                <div className={hoveredCol === 'created_at' ? 'font-bold' : ''}>2026-07-12</div>
              </div>
              <div className="grid grid-cols-4 gap-2 px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-[10.5px] text-neutral-500">
                <div className={hoveredCol === 'id' ? 'font-bold text-neutral-800 dark:text-neutral-200' : ''}>2</div>
                <div className={`font-sans ${hoveredCol === 'name' ? 'font-bold text-neutral-800 dark:text-neutral-200' : ''}`}>Asha</div>
                <div className={`truncate ${hoveredCol === 'email' ? 'font-bold text-neutral-800 dark:text-neutral-200' : ''}`}>asha@gmail.com</div>
                <div className={hoveredCol === 'created_at' ? 'font-bold text-neutral-800 dark:text-neutral-200' : ''}>2026-07-14</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="schema"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <SqlQuery query={`CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── 2. QUERY RESULT ──────────────────────────────────────────────────────────
const QueryResult = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [scanIndex, setScanIndex] = useState(-1);
  const [results, setResults] = useState<any[]>([]);

  const rows = [
    { id: 1, name: 'Pranav', email: 'pranav@pranavx.in', created_at: '2026-07-12' },
    { id: 2, name: 'Asha', email: 'asha@gmail.com', created_at: '2026-07-14' },
    { id: 3, name: 'Kabir', email: 'kabir@yahoo.com', created_at: '2026-07-17' }
  ];

  const handleRunQuery = () => {
    if (isRunning) return;
    setIsRunning(true);
    setScanIndex(0);
    setResults([]);

    let current = 0;
    const interval = setInterval(() => {
      const row = rows[current];
      const match = new Date(row.created_at) > new Date('2026-07-13');
      if (match) {
        setResults(prev => [...prev, row]);
      }
      current++;
      setScanIndex(current);

      if (current >= rows.length) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 800);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Label>SQL Filtering Pipeline</Label>
      <div className="w-full flex items-center justify-between gap-3 mb-2.5">
        <SqlQuery query="SELECT name, email FROM users WHERE created_at > '2026-07-13';" />
        <button
          onClick={handleRunQuery}
          disabled={isRunning}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white dark:bg-white dark:text-neutral-900 text-[11px] font-sans font-semibold disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
        >
          <Play size={11} fill="currentColor" />
          {isRunning ? 'Running...' : 'Run Query'}
        </button>
      </div>

      <div className="w-full gap-4 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 relative">
        <div className="space-y-2.5">
          {rows.map((row, idx) => {
            const isScanning = scanIndex === idx;
            const hasPassed = scanIndex > idx && new Date(row.created_at) > new Date('2026-07-13');
            const hasFailed = scanIndex > idx && new Date(row.created_at) <= new Date('2026-07-13');

            return (
              <div
                key={row.id}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300 bg-white dark:bg-neutral-950 font-mono text-[10.5px] ${
                  isScanning
                    ? 'border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900/10 dark:ring-white/10 scale-[1.01]'
                    : hasFailed
                    ? 'opacity-20 border-neutral-200 dark:border-neutral-800'
                    : hasPassed
                    ? 'border-neutral-900 dark:border-neutral-100 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>{row.name}</div>
                  <div className="truncate">{row.email}</div>
                  <div>{row.created_at}</div>
                </div>
                <div className="min-w-[80px] text-right font-mono text-[9px] font-bold">
                  {isScanning && <span className="text-neutral-500 animate-pulse">⚙ Scanning...</span>}
                  {hasFailed && <span className="text-red-500">✕ Skipped</span>}
                  {hasPassed && <span className="text-emerald-500">✓ Match</span>}
                </div>
              </div>
            );
          })}
        </div>

        {results.length > 0 && !isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-3.5 border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className="font-mono text-[9px] font-bold text-neutral-400 uppercase mb-2">Output Rows (name, email)</div>
            <div className="space-y-1.5">
              {results.map(r => (
                <div key={r.id} className="flex gap-4 font-mono text-[10.5px] text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800">
                  <div className="font-bold">{r.name}</div>
                  <div>{r.email}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─── 3. SYSTEM ARCHITECTURE ───────────────────────────────────────────────────
const SystemArchitecture = () => {
  const [pulseStage, setPulseStage] = useState<'idle' | 'request' | 'query' | 'response'>('idle');

  const triggerRequest = () => {
    if (pulseStage !== 'idle') return;
    setPulseStage('request');
    setTimeout(() => {
      setPulseStage('query');
      setTimeout(() => {
        setPulseStage('response');
        setTimeout(() => {
          setPulseStage('idle');
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="w-full">
      <Label>Request Lifecycle simulation</Label>
      <div className="flex flex-col items-center border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 relative">
        <button
          onClick={triggerRequest}
          disabled={pulseStage !== 'idle'}
          className="absolute right-4 top-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-[10.5px] font-sans font-semibold disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all active:scale-95"
        >
          <Play size={11} fill="currentColor" />
          Send Request
        </button>

        <div className="grid grid-cols-3 gap-6 items-center w-full my-6 relative">
          {/* Connector Paths with flowing pulses */}
          <div className="absolute inset-x-[15%] top-1/2 -translate-y-1/2 h-[1px] bg-neutral-200 dark:bg-neutral-800 -z-10 flex justify-between">
            <div className="w-full relative h-full">
              {pulseStage === 'request' && (
                <motion.div
                  initial={{ left: '0%' }}
                  animate={{ left: '100%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute w-2 h-2 rounded-full bg-neutral-900 dark:bg-white -mt-1 shadow-sm"
                />
              )}
              {pulseStage === 'response' && (
                <motion.div
                  initial={{ left: '100%' }}
                  animate={{ left: '0%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute w-2 h-2 rounded-full bg-neutral-900 dark:bg-white -mt-1 shadow-sm"
                />
              )}
            </div>
            <div className="w-full relative h-full">
              {pulseStage === 'query' && (
                <motion.div
                  initial={{ left: '0%' }}
                  animate={{ left: '100%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute w-2 h-2 rounded-full bg-neutral-900 dark:bg-white -mt-1 shadow-sm"
                />
              )}
            </div>
          </div>

          {/* Node 1 */}
          <div className={`flex flex-col items-center p-3 border rounded-xl text-center bg-white dark:bg-neutral-950 shadow-sm transition-all duration-300 ${
            pulseStage === 'request' || pulseStage === 'response' ? 'border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900/5 dark:ring-white/5' : 'border-neutral-200 dark:border-neutral-800'
          }`}>
            <Globe size={16} className="text-neutral-500" />
            <div className="text-[11.5px] font-sans font-bold text-neutral-800 dark:text-neutral-200 mt-1">Client UI</div>
            <div className="text-[9px] font-mono text-neutral-400">Browser</div>
          </div>

          {/* Node 2 */}
          <div className={`flex flex-col items-center p-3 border rounded-xl text-center bg-white dark:bg-neutral-950 shadow-sm transition-all duration-300 ${
            pulseStage === 'query' ? 'border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900/5 dark:ring-white/5' : 'border-neutral-200 dark:border-neutral-800'
          }`}>
            <Network size={16} className="text-neutral-500" />
            <div className="text-[11.5px] font-sans font-bold text-neutral-800 dark:text-neutral-200 mt-1">API Server</div>
            <div className="text-[9px] font-mono text-neutral-400">Next.js Route</div>
          </div>

          {/* Node 3 */}
          <div className={`flex flex-col items-center p-3 border rounded-xl text-center bg-white dark:bg-neutral-950 shadow-sm transition-all duration-300 ${
            pulseStage === 'query' ? 'border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900/5 dark:ring-white/5' : 'border-neutral-200 dark:border-neutral-800'
          }`}>
            <Database size={16} className="text-neutral-500" />
            <div className="text-[11.5px] font-sans font-bold text-neutral-800 dark:text-neutral-200 mt-1">Database</div>
            <div className="text-[9px] font-mono text-neutral-400">PostgreSQL</div>
          </div>
        </div>

        <div className="w-full bg-neutral-950 text-neutral-300 border border-neutral-900 rounded-lg p-3 font-mono text-[10px] leading-relaxed">
          {pulseStage === 'idle' && <span># Ready. Click "Send Request" to trigger client lifecycle.</span>}
          {pulseStage === 'request' && <span className="text-neutral-200">1. Client fires HTTPS GET request to Next.js API server...</span>}
          {pulseStage === 'query' && <span className="text-emerald-400">2. Server opens TCP socket to Postgres & executes dynamic SELECT query...</span>}
          {pulseStage === 'response' && <span className="text-neutral-250">3. Server parses returned rows, maps to JSON, and responds to browser.</span>}
        </div>
      </div>
    </div>
  );
};

// ─── 4. JOIN TABLES ───────────────────────────────────────────────────────────
const JoinTables = () => {
  const [hoveredOrder, setHoveredOrder] = useState<number | null>(null);

  const users = [
    { id: 1, name: 'Pranav' },
    { id: 2, name: 'Asha' }
  ];

  const orders = [
    { id: 101, user_id: 1, total: '₹499 (Domain)' },
    { id: 102, user_id: 2, total: '₹1,250 (Hosting)' },
    { id: 103, user_id: 1, total: '₹89 (SSL)' }
  ];

  return (
    <div className="w-full">
      <Label>Hover Join Connector Map</Label>
      <div className="space-y-4 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40">
        
        {/* Table displays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Table: Users */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 p-3">
            <div className="font-mono text-[10px] font-bold text-neutral-450 mb-1.5 uppercase">Table: users</div>
            <div className="space-y-1">
              {users.map(u => {
                const isActive = hoveredOrder !== null && orders.find(o => o.id === hoveredOrder)?.user_id === u.id;
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between px-3 py-1.5 rounded border transition-all duration-300 font-mono text-[10.5px] ${
                      isActive
                        ? 'border-neutral-900 dark:border-neutral-100 font-bold bg-neutral-100/50 dark:bg-neutral-900/50 scale-[1.01]'
                        : 'border-transparent text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <span>ID: {u.id}</span>
                    <span className="font-sans font-bold">{u.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table: Orders */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 p-3">
            <div className="font-mono text-[10px] font-bold text-neutral-450 mb-1.5 uppercase">Table: orders (Hover to JOIN)</div>
            <div className="space-y-1">
              {orders.map(o => (
                <div
                  key={o.id}
                  onMouseEnter={() => setHoveredOrder(o.id)}
                  onMouseLeave={() => setHoveredOrder(null)}
                  className={`flex items-center justify-between px-3 py-1.5 rounded border cursor-crosshair transition-all duration-200 font-mono text-[10.5px] ${
                    hoveredOrder === o.id
                      ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100/50 dark:bg-neutral-900/50 font-semibold scale-[1.01]'
                      : 'border-transparent text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <span>Order: {o.id}</span>
                  <span>User ID: <span className="font-bold text-neutral-800 dark:text-neutral-200">{o.user_id}</span></span>
                  <span>{o.total}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <SqlQuery query={`SELECT u.name, o.total \nFROM orders o \nJOIN users u ON u.id = o.user_id;`} />

        {/* Output Row preview based on hover */}
        <div className="border border-neutral-250 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 p-3.5 shadow-sm min-h-[90px] flex flex-col justify-center">
          {hoveredOrder === null ? (
            <div className="text-center font-sans text-[11px] text-neutral-400">Hover over any row in the **orders** table to visualize key matching joining.</div>
          ) : (
            <div>
              <div className="font-mono text-[9px] font-bold text-neutral-400 uppercase mb-1.5">JOIN Output Record</div>
              {orders.filter(o => o.id === hoveredOrder).map(o => {
                const u = users.find(u => u.id === o.user_id);
                return (
                  <div key={o.id} className="flex items-center justify-between font-mono text-[11px] bg-neutral-100 dark:bg-neutral-900 px-3 py-2 rounded border border-neutral-200 dark:border-neutral-850">
                    <span className="font-sans font-bold">{u?.name}</span>
                    <span>{o.total}</span>
                    <span className="text-emerald-500 text-[10px] font-semibold">Match u.id({u?.id}) = o.user_id({o.user_id})</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── 5. N+1 PROBLEM ──────────────────────────────────────────────────────────
const NPlusOne = () => {
  const [simulating, setSimulating] = useState<'n1' | 'join' | null>(null);
  const [dbHits, setDbHits] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const triggerSimulation = (type: 'n1' | 'join') => {
    if (simulating !== null) return;
    setSimulating(type);
    setDbHits(0);
    setTotalTime(0);

    if (type === 'n1') {
      let hits = 0;
      const interval = setInterval(() => {
        hits++;
        setDbHits(hits);
        setTotalTime(hits * 60);

        if (hits >= 6) {
          clearInterval(interval);
          setSimulating(null);
        }
      }, 500);
    } else {
      setTimeout(() => {
        setDbHits(1);
        setTotalTime(35);
        setSimulating(null);
      }, 400);
    }
  };

  return (
    <div className="w-full">
      <Label>Query Speed & Latency Simulator</Label>
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => triggerSimulation('n1')}
          disabled={simulating !== null}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-neutral-300 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-[11.5px] font-sans font-semibold disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-white/5 active:scale-95 transition-all"
        >
          Simulate N+1 Loop
        </button>
        <button
          onClick={() => triggerSimulation('join')}
          disabled={simulating !== null}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-neutral-900 dark:border-neutral-100 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[11.5px] font-sans font-semibold disabled:opacity-50 hover:scale-[1.01] active:scale-95 transition-all"
        >
          Simulate SQL JOIN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40">
        {/* Latency statistics */}
        <div className="flex flex-col justify-center space-y-3 p-4 border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-xl shadow-sm">
          <div className="font-sans font-bold text-[13px] text-neutral-800 dark:text-neutral-200">Simulation Statistics</div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border border-neutral-100 dark:border-neutral-900 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/20">
              <div className="font-mono text-[18px] font-bold text-neutral-900 dark:text-white">{dbHits}</div>
              <div className="font-sans text-[9px] text-neutral-400 uppercase mt-0.5">Database hits</div>
            </div>
            <div className="border border-neutral-100 dark:border-neutral-900 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/20">
              <div className="font-mono text-[18px] font-bold text-neutral-900 dark:text-white">{totalTime}ms</div>
              <div className="font-sans text-[9px] text-neutral-400 uppercase mt-0.5">Total latency</div>
            </div>
          </div>
        </div>

        {/* Visual timeline execution */}
        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 rounded-xl shadow-sm min-h-[140px] flex flex-col justify-center">
          {simulating === null && dbHits === 0 ? (
            <div className="text-center font-sans text-[11px] text-neutral-400">Click a simulation button to compare database loops and single trip speeds.</div>
          ) : (
            <div className="space-y-1.5 font-mono text-[9px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {simulating === 'n1' && (
                <>
                  <div className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded">1. SELECT * FROM students;</div>
                  {dbHits >= 2 && <div className="px-2 py-0.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded">2. SELECT name FROM depts WHERE id = 1;</div>}
                  {dbHits >= 3 && <div className="px-2 py-0.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded">3. SELECT name FROM depts WHERE id = 2;</div>}
                  {dbHits >= 4 && <div className="px-2 py-0.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded">4. SELECT name FROM depts WHERE id = 3;</div>}
                  {dbHits >= 5 && <div className="text-center py-0.5 text-neutral-400 animate-pulse">Running loop hits...</div>}
                </>
              )}
              {simulating === 'join' && (
                <div className="px-2 py-2 border border-emerald-500 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white rounded font-semibold">
                  1. SELECT s.*, d.name FROM students s JOIN depts d ON d.id = s.dept_id;
                  <div className="text-[8.5px] text-emerald-500 font-bold mt-1">✓ Complete in single trip</div>
                </div>
              )}
              {simulating === null && dbHits > 0 && (
                <div className="text-center font-sans text-[11px] text-neutral-500">
                  {dbHits > 1 ? (
                    <span className="text-red-500 font-semibold">N+1 query resulted in 6 sequential trips!</span>
                  ) : (
                    <span className="text-emerald-500 font-semibold">JOIN completed in 1 quick trip.</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── 6. QUERY PLANNER ────────────────────────────────────────────────────────
const QueryPlanner = () => {
  const [indexActive, setIndexActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(-1);

  const dataset = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}` }));

  const startScanSimulation = () => {
    if (scanning) return;
    setScanning(true);
    setScanStep(-1);

    if (indexActive) {
      // Index scan leaps directly
      setTimeout(() => {
        setScanStep(6); // index target is row #7 (id = 7)
        setScanning(false);
      }, 600);
    } else {
      // Seq scan steps through row-by-row
      let current = 0;
      const interval = setInterval(() => {
        setScanStep(current);
        current++;
        if (current >= 7) { // Stop at index target row (id = 7)
          clearInterval(interval);
          setScanning(false);
        }
      }, 250);
    }
  };

  return (
    <div className="w-full">
      <Label>Query Planner Scan Simulator</Label>
      
      <div className="flex flex-col items-center border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40">
        <div className="w-full flex items-center justify-between gap-3 mb-2.5">
          <SqlQuery query="SELECT * FROM users WHERE id = 7;" />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-[11.5px] font-sans font-medium text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={indexActive}
                onChange={(e) => setIndexActive(e.target.checked)}
                disabled={scanning}
                className="rounded border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 focus:ring-0 cursor-pointer"
              />
              Index Active
            </label>
            <button
              onClick={startScanSimulation}
              disabled={scanning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-850 text-white dark:bg-white dark:text-neutral-900 text-[10.5px] font-sans font-semibold disabled:opacity-50 hover:scale-[1.01] active:scale-95"
            >
              Scan
            </button>
          </div>
        </div>

        {/* Database Page Blocks */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 w-full my-4">
          {dataset.map((row, idx) => {
            const isTarget = row.id === 7;
            const isCurrent = scanStep === idx;
            const hasPassed = scanStep > idx;

            return (
              <div
                key={row.id}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center font-mono text-[10px] transition-all duration-200 bg-white dark:bg-neutral-950 ${
                  isCurrent
                    ? 'border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900/10 dark:ring-white/10 scale-105'
                    : isTarget && scanStep === 6
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : hasPassed && !indexActive
                    ? 'opacity-40 border-neutral-250 dark:border-neutral-850'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <span className="text-[8px] font-sans text-neutral-400">Row {row.id}</span>
                <span className="font-bold">{row.id}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-neutral-950 text-neutral-300 border border-neutral-900 rounded-lg p-3 font-mono text-[10px] leading-relaxed min-h-[52px] flex items-center">
          {scanning ? (
            <span className="text-neutral-400 animate-pulse">
              {indexActive ? '→ Seeking idx_users_id B-Tree key user_id=7...' : `→ Reading block ${scanStep + 1} from disk...`}
            </span>
          ) : scanStep === 6 ? (
            <span className="text-emerald-500 font-semibold">
              {indexActive
                ? '✓ Index hit! Jumped directly to Row 7 in 1 lookup. Cost: 0.1ms'
                : '✓ Found Row 7! But read through 7 pages sequentially. Cost: 48ms'}
            </span>
          ) : (
            <span className="text-neutral-500">Select whether to use the database index, then click "Scan".</span>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── 7. EXPLAIN OUTPUT ───────────────────────────────────────────────────────
const ExplainOutput = () => {
  const [activeTab, setActiveTab] = useState<'raw' | 'index'>('raw');

  return (
    <div className="w-full">
      <Label>Planner Explain Plan Dashboard</Label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-3 py-1 text-[11px] font-sans font-medium rounded-md border transition-all ${
            activeTab === 'raw'
              ? 'bg-neutral-900 border-neutral-800 text-white dark:bg-white dark:text-neutral-900'
              : 'border-neutral-250 dark:border-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          EXPLAIN (Seq Scan)
        </button>
        <button
          onClick={() => setActiveTab('index')}
          className={`px-3 py-1 text-[11px] font-sans font-medium rounded-md border transition-all ${
            activeTab === 'index'
              ? 'bg-neutral-900 border-neutral-800 text-white dark:bg-white dark:text-neutral-900'
              : 'border-neutral-250 dark:border-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          EXPLAIN (Index Scan)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'raw' ? (
          <motion.div key="raw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SqlQuery query={`EXPLAIN ANALYZE SELECT * FROM messages WHERE chat_id = 42;\n\nSeq Scan on messages  (cost=0.00..4382.00 rows=180 width=64)\n  Filter: (chat_id = 42)\n  Rows Removed by Filter: 213,820\nPlanning Time: 0.110 ms\nExecution Time: 48.943 ms`} />
            <div className="mt-2.5 p-3 rounded-lg border border-red-150 bg-red-50/20 dark:bg-red-950/5 text-[11px] font-sans text-red-500">
              <strong>Seq Scan Warning</strong>: The database had to scan and filter out <strong>213,820 rows</strong> because there was no index on `chat_id`.
            </div>
          </motion.div>
        ) : (
          <motion.div key="index" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SqlQuery query={`EXPLAIN ANALYZE SELECT * FROM messages WHERE chat_id = 42;\n\nIndex Scan using idx_chat on messages  (cost=0.42..12.19 rows=180 width=64)\n  Index Cond: (chat_id = 42)\nPlanning Time: 0.125 ms\nExecution Time: 0.212 ms`} />
            <div className="mt-2.5 p-3 rounded-lg border border-emerald-150 bg-emerald-50/20 dark:bg-emerald-950/5 text-[11px] font-sans text-emerald-600">
              <strong>Index Hit</strong>: Jumped straight to the matching rows. Execution time decreased to **0.2ms** (a 240x speed improvement).
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── 8. COMPOUND INDEX ───────────────────────────────────────────────────────
const CompoundIndex = () => {
  const [searchBy, setSearchBy] = useState<'both' | 'date_only'>('both');

  return (
    <div className="w-full">
      <Label>Compound Index Sort key Ledger</Label>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setSearchBy('both')}
          className={`px-3 py-1.5 text-[11px] font-sans font-medium rounded-md border transition-all ${
            searchBy === 'both'
              ? 'bg-neutral-900 border-neutral-800 text-white dark:bg-white dark:text-neutral-900'
              : 'border-neutral-250 dark:border-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          WHERE user_id = 7 AND created_at = ...
        </button>
        <button
          onClick={() => setSearchBy('date_only')}
          className={`px-3 py-1.5 text-[11px] font-sans font-medium rounded-md border transition-all ${
            searchBy === 'date_only'
              ? 'bg-neutral-900 border-neutral-800 text-white dark:bg-white dark:text-neutral-900'
              : 'border-neutral-250 dark:border-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          WHERE created_at = ...
        </button>
      </div>

      <div className="space-y-4 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40">
        <div className="border border-neutral-205 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 p-3.5">
          <div className="font-mono text-[9px] font-bold text-neutral-400 uppercase mb-2">Compound Sorted Index (user_id FIRST, then created_at)</div>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-1.5 mb-1.5">
            <div>user_id</div>
            <div>created_at</div>
            <div>Search Status</div>
          </div>
          <div className="space-y-1 font-mono text-[10.5px]">
            <div className={`grid grid-cols-3 gap-1.5 py-0.5 rounded px-1 transition-all ${searchBy === 'both' ? 'bg-emerald-500/10 text-emerald-600 font-bold' : 'opacity-30'}`}>
              <div>User 7</div>
              <div>2026-07-10</div>
              <div>{searchBy === 'both' ? '✓ Binary Match' : 'Seq Scan'}</div>
            </div>
            <div className={`grid grid-cols-3 gap-1.5 py-0.5 rounded px-1 transition-all ${searchBy === 'both' ? 'bg-emerald-500/10 text-emerald-600 font-bold' : 'opacity-30'}`}>
              <div>User 7</div>
              <div>2026-07-12</div>
              <div>{searchBy === 'both' ? '✓ Binary Match' : 'Seq Scan'}</div>
            </div>
            <div className={`grid grid-cols-3 gap-1.5 py-0.5 rounded px-1 transition-all border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-1.5 ${searchBy === 'both' ? 'bg-emerald-500/10 text-emerald-600 font-bold' : 'opacity-30'}`}>
              <div>User 7</div>
              <div>2026-07-15</div>
              <div>{searchBy === 'both' ? '✓ Binary Match' : 'Seq Scan'}</div>
            </div>
            <div className={`grid grid-cols-3 gap-1.5 py-0.5 rounded px-1 transition-all ${searchBy === 'date_only' ? 'bg-yellow-500/10 text-yellow-600 font-bold' : 'opacity-30'}`}>
              <div>User 8</div>
              <div>2026-07-11</div>
              <div>{searchBy === 'date_only' ? '✕ Sequential Scan' : 'Skipped'}</div>
            </div>
          </div>
        </div>

        <div className="text-[11.5px] font-sans text-neutral-500 dark:text-neutral-400">
          {searchBy === 'both' ? (
            <span><strong>Compound Index Active</strong>: Because your search includes `user_id` (the first column in the compound index), the database planner executes a binary search to jump straight to User 7.</span>
          ) : (
            <span className="text-red-500"><strong>Index Ignored</strong>: You queried for `created_at` alone. Since the index is sorted by `user_id` first, the database cannot use binary search and must fall back to a full scan.</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── 9. RACE CONDITION ───────────────────────────────────────────────────────
const RaceCondition = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'Initial State', desc: 'Active registrations = 49. Limit is 50.' },
    { label: 'T1: Concurrent Read', desc: 'Transaction A and B read count simultaneously. Both read 49.' },
    { label: 'T2: Compare logic', desc: 'Both transactions verify: 49 < 50 (PASS).' },
    { label: 'T3: Double Write', desc: 'Both write. Registrations jump to 51, violating database limit constraints!' }
  ];

  return (
    <div className="w-full">
      <Label>Concurrency Collision timeline</Label>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setStep(prev => Math.min(prev + 1, 3))}
          disabled={step === 3}
          className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[11px] font-sans font-semibold disabled:opacity-50 hover:scale-[1.01] active:scale-95 transition-all"
        >
          Step Next
        </button>
        <button
          onClick={() => setStep(0)}
          className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-[11px] font-sans hover:bg-neutral-50 dark:hover:bg-white/5 transition-all"
        >
          Reset
        </button>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 relative min-h-[160px] flex flex-col justify-between">
        
        <div className="space-y-3 font-mono text-[10px]">
          {steps.map((s, idx) => {
            const isActive = step === idx;
            const isPassed = step > idx;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-300 ${
                  isActive
                    ? 'border-neutral-900 dark:border-neutral-100 bg-white dark:bg-neutral-950 font-bold scale-[1.01]'
                    : isPassed
                    ? 'opacity-40 border-neutral-200 dark:border-neutral-800'
                    : 'opacity-10 border-transparent'
                }`}
              >
                <span>{s.label}</span>
                <span className="text-[10px] text-right font-sans text-neutral-500 dark:text-neutral-400">{s.desc}</span>
              </div>
            );
          })}
        </div>

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3.5 p-3 rounded-lg border border-red-500 bg-red-500/10 text-[11px] font-sans text-red-500 font-bold text-center"
          >
            ✕ Race Condition collision: 51 total users allowed through!
          </motion.div>
        )}

      </div>
    </div>
  );
};

// ─── 10. READ WRITE RATIO ────────────────────────────────────────────────────
const ReadWriteRatio = () => {
  const [ratio, setRatio] = useState(50); // 0 = write-heavy, 100 = read-heavy

  return (
    <div className="w-full">
      <Label>Database Schema Optimizer Slider</Label>
      <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40">
        
        <div className="flex items-center justify-between font-sans text-[11.5px] font-bold text-neutral-600 dark:text-neutral-400 mb-3 select-none">
          <span>Write Heavy workload (Updates/inserts)</span>
          <span>Read Heavy workload (Feed loading)</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={ratio}
          onChange={(e) => setRatio(Number(e.target.value))}
          className="w-full accent-neutral-900 dark:accent-white cursor-ew-resize bg-neutral-200 dark:bg-neutral-800 h-1 rounded-lg"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Normalized schema card */}
          <div className={`p-4 border rounded-xl bg-white dark:bg-neutral-950 shadow-sm transition-all duration-300 ${
            ratio < 50 ? 'border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900/5 dark:ring-white/5' : 'border-neutral-200 dark:border-neutral-800 opacity-60'
          }`}>
            <div className="font-sans font-bold text-[12.5px] text-neutral-800 dark:text-neutral-200 mb-1">Normalized Table</div>
            <div className="font-mono text-[9px] text-neutral-450 mb-2">No Duplication</div>
            <div className="space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <div>• Updates to data are clean & instant.</div>
              <div>• <span className="font-bold">Write Speed</span>: 1ms (Ideal for inserts)</div>
              <div>• <span className="font-bold text-red-500">Read Speed</span>: {Math.max(10, Math.round(ratio * 1.5))}ms (Requires joins)</div>
            </div>
          </div>

          {/* Denormalized schema card */}
          <div className={`p-4 border rounded-xl bg-white dark:bg-neutral-950 shadow-sm transition-all duration-300 ${
            ratio >= 50 ? 'border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900/5 dark:ring-white/5' : 'border-neutral-200 dark:border-neutral-800 opacity-60'
          }`}>
            <div className="font-sans font-bold text-[12.5px] text-neutral-800 dark:text-neutral-200 mb-1">Denormalized Table</div>
            <div className="font-mono text-[9px] text-neutral-455 mb-2">Precomputed Fields</div>
            <div className="space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <div>• Instant select. Updates require rewriting duplicates.</div>
              <div>• <span className="font-bold">Read Speed</span>: 0.5ms (Single table fetch)</div>
              <div>• <span className="font-bold text-red-500">Write Speed</span>: {Math.max(5, Math.round((100 - ratio) * 1.2))}ms (Rebuilding indexes)</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── 11. PGVECTOR QUERY ──────────────────────────────────────────────────────
const PgvectorQuery = () => {
  const [similarity, setSimilarity] = useState(0.85);

  return (
    <div className="w-full">
      <Label>Semantic Similarity Vector Space</Label>
      <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40">
        
        <div className="w-full flex items-center justify-between gap-3 mb-3">
          <SqlQuery query={`SELECT content FROM memories\nORDER BY embedding <=> '[0.12, 0.45, ...]'\nLIMIT 5;`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Similarity graph coordinates visual */}
          <div className="w-[180px] h-[180px] shrink-0 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-xl mx-auto relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-neutral-100 dark:bg-neutral-900/80" />
              <div className="h-px w-full bg-neutral-100 dark:bg-neutral-900/80" />
            </div>

            {/* Vector query line */}
            <div className="absolute left-[50%] top-[50%] flex items-start origin-top-left -rotate-[35deg]">
              <div className="h-px w-16 bg-emerald-500 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-mono text-[7.5px] text-emerald-500 font-bold ml-1 mt-[-4px]">Query</span>
            </div>

            {/* Match vector line */}
            <div className="absolute left-[50%] top-[50%] flex items-start origin-top-left -rotate-[44deg]">
              <div className="h-px w-14 bg-neutral-800 dark:bg-neutral-200 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neutral-500" />
              </div>
              <span className="font-mono text-[7px] text-neutral-400 ml-1 mt-[-4px]">Match</span>
            </div>
            <div className="absolute bottom-2 left-2 font-sans text-[8px] text-neutral-400 select-none">Cosine Angle Distance</div>
          </div>

          {/* Similarity score adjuster slider */}
          <div className="space-y-3.5">
            <div className="font-sans font-bold text-[12.5px] text-neutral-855 dark:text-neutral-145">Configure cosine threshold:</div>
            <input
              type="range"
              min="50"
              max="99"
              value={Math.round(similarity * 100)}
              onChange={(e) => setSimilarity(Number(e.target.value) / 100)}
              className="w-full accent-neutral-900 dark:accent-white cursor-ew-resize bg-neutral-200 dark:bg-neutral-800 h-1 rounded-lg"
            />
            <div className="font-mono text-[10.5px] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2.5 rounded-lg">
              Similarity Cosine Distance: <span className="font-bold text-emerald-500">{(1 - similarity).toFixed(2)}</span>
              <br />
              Cosine Similarity score: <span className="font-bold text-neutral-800 dark:text-neutral-200">{(similarity * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const DIAGRAMS: Record<string, React.FC> = {
  'table-anatomy': TableAnatomy,
  'query-result': QueryResult,
  'system-architecture': SystemArchitecture,
  'join-tables': JoinTables,
  'n-plus-one': NPlusOne,
  'query-planner': QueryPlanner,
  'explain-output': ExplainOutput,
  'compound-index': CompoundIndex,
  'race-condition': RaceCondition,
  'read-write-ratio': ReadWriteRatio,
  'pgvector-query': PgvectorQuery,
};

export default function BlogDiagram({ id, caption }: { id: string; caption?: string }) {
  const Diagram = DIAGRAMS[id];
  if (!Diagram) return null;

  return (
    <figure className="my-8 rounded-2xl border border-neutral-250 dark:border-neutral-800 p-4 sm:p-5 bg-neutral-50/20 dark:bg-neutral-900/10">
      <Diagram />
      {caption && (
        <figcaption className="mt-4 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 text-[11.5px] font-sans text-neutral-400 dark:text-neutral-500 text-center leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
