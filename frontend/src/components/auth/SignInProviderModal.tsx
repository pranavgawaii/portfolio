import React from 'react';
import { X, Github } from 'lucide-react';
import { motion } from 'motion/react';
import { openOAuthPopup, OAuthStrategy } from '../../lib/oauthPopup';

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.52 12.273c0-.851-.076-1.67-.218-2.455H12v4.645h6.458a5.52 5.52 0 0 1-2.395 3.622v3.011h3.878c2.27-2.09 3.58-5.166 3.58-8.823Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.956-1.075 7.941-2.909l-3.878-3.011c-1.075.72-2.45 1.146-4.063 1.146-3.126 0-5.77-2.11-6.715-4.946H1.28v3.107A11.997 11.997 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.285 14.28A7.194 7.194 0 0 1 4.909 12c0-.791.136-1.56.376-2.28V6.613H1.28A11.997 11.997 0 0 0 0 12c0 1.936.464 3.768 1.28 5.387l4.005-3.107Z" />
    <path fill="#EA4335" d="M12 4.774c1.762 0 3.344.606 4.59 1.795l3.442-3.442C17.951 1.19 15.236 0 12 0 7.31 0 3.24 2.688 1.28 6.613l4.005 3.107C6.23 6.884 8.874 4.774 12 4.774Z" />
  </svg>
);

export const SignInProviderModal: React.FC<{ onClose: () => void; label?: string }> = ({ onClose, label = 'Sign in to continue' }) => {
  const choose = (strategy: OAuthStrategy) => {
    openOAuthPopup(strategy);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        className="relative w-full max-w-[360px] bg-white dark:bg-[#111] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <p className="font-sans font-semibold text-sm text-text-light dark:text-text-dark">{label}</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-neutral-100 dark:hover:bg-white/6 transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-2.5">
          <button
            onClick={() => choose('oauth_google')}
            className="w-full flex items-center justify-center gap-2.5 h-11 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[13px] font-medium text-text-light dark:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/4 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            onClick={() => choose('oauth_github')}
            className="w-full flex items-center justify-center gap-2.5 h-11 rounded-lg bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[13px] font-medium hover:opacity-85 transition-opacity"
          >
            <Github size={16} />
            Continue with GitHub
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
