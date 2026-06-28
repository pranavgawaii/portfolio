import React, { useState, useRef } from 'react';
import { X, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest opacity-60">
      {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-0 py-2 bg-transparent border-0 border-b border-border-light dark:border-border-dark focus:outline-none focus:border-text-light dark:focus:border-text-dark text-sm text-text-light dark:text-text-dark placeholder-neutral-400 dark:placeholder-neutral-600 transition-colors";

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const form = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-2xl border border-border-light dark:border-border-dark shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border-light dark:border-border-dark">
          <div>
            <h2 className="font-sans font-bold text-base text-text-light dark:text-text-dark">Get in touch</h2>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">I usually reply within a day.</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <CheckCircle size={36} className="text-emerald-500" />
              <p className="font-sans font-semibold text-text-light dark:text-text-dark">Message sent!</p>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">I'll get back to you soon.</p>
            </div>
          ) : (
            <form ref={form} onSubmit={handleSubmit} className="space-y-5">
              <Field label="Name">
                <input
                  type="text"
                  name="user_name"
                  required
                  placeholder="Your name"
                  className={inputCls}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  name="user_email"
                  required
                  placeholder="your@email.com"
                  className={inputCls}
                />
              </Field>

              <Field label="Message">
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="What's on your mind?"
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 text-xs">
                  <AlertCircle size={13} />
                  Something went wrong. Try again.
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> Sending…</>
                ) : (
                  <><Send size={14} /> Send message</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
