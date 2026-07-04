import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2, CheckCircle, AlertCircle, User, Mail, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const form = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    if (form.current) {
      emailjs.sendForm('service_tir69do', 'template_h00tjmr', form.current, 'CKf4MCbwmwQ3mA7UG')
        .then(() => {
          setStatus('success');
          setIsLoading(false);
          setTimeout(() => { onClose(); setStatus('idle'); }, 2500);
        }, () => {
          setStatus('error');
          setIsLoading(false);
        });
    }
  };

  const inputCls = "w-full pl-10 pr-4 py-3 bg-transparent border border-border-light dark:border-border-dark rounded-xl text-sm text-text-light dark:text-text-dark placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-text-light dark:focus:border-text-dark transition-colors";
  const iconCls = "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted-light dark:text-text-muted-dark opacity-70 group-focus-within:text-text-light dark:group-focus-within:text-text-dark group-focus-within:opacity-100 transition-all";
  const labelCls = "text-xs font-mono text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest opacity-60 ml-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-[420px] bg-white dark:bg-[#0a0a0a] sm:rounded-3xl rounded-t-3xl border border-border-light dark:border-border-dark shadow-2xl overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-7 pt-7 pb-5 flex items-start justify-between border-b border-border-light dark:border-border-dark">
              <div>
                <h2 className="font-sans font-bold text-lg text-text-light dark:text-text-dark tracking-tight">Get in touch</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-0.5">I usually reply within a day.</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="relative px-7 py-6">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-8 gap-4 text-center h-[320px]"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 mb-2">
                      <CheckCircle size={28} className="text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-sans font-bold text-lg text-text-light dark:text-text-dark">Message sent!</p>
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1 max-w-[250px] mx-auto">Thanks for reaching out. I'll get back to you soon.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={form}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="space-y-2">
                      <label className={labelCls}>Name</label>
                      <div className="relative group">
                        <div className={iconCls}>
                          <User size={15} />
                        </div>
                        <input
                          type="text"
                          name="user_name"
                          required
                          placeholder="Your name"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={labelCls}>Email</label>
                      <div className="relative group">
                        <div className={iconCls}>
                          <Mail size={15} />
                        </div>
                        <input
                          type="email"
                          name="user_email"
                          required
                          placeholder="your@email.com"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={labelCls}>Message</label>
                      <div className="relative group">
                        <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-text-muted-light dark:text-text-muted-dark opacity-70 group-focus-within:text-text-light dark:group-focus-within:text-text-dark group-focus-within:opacity-100 transition-all">
                          <MessageSquare size={15} />
                        </div>
                        <textarea
                          name="message"
                          required
                          rows={4}
                          placeholder="What's on your mind?"
                          className={`${inputCls} resize-none`}
                        />
                      </div>
                    </div>

                    {status === 'error' && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-500/20">
                        <AlertCircle size={15} />
                        <p>Something went wrong. Please try again.</p>
                      </motion.div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <><Loader2 size={15} className="animate-spin" /> Sending...</>
                        ) : (
                          <><Send size={15} /> Send message</>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
