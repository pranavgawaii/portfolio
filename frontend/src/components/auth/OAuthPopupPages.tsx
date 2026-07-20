import React, { useEffect } from 'react';
import { useSignIn, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import type { OAuthStrategy } from '../../lib/oauthPopup';

const spinnerStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  border: '2px solid #333',
  borderTopColor: '#fff',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

const PopupShell: React.FC<{ label: string }> = ({ label }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 14, height: '100vh', width: '100vw', background: '#0a0a0a', color: '#a3a3a3',
    fontFamily: 'system-ui, sans-serif', fontSize: 13,
  }}>
    <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    <div style={spinnerStyle} />
    {label}
  </div>
);

// Step 1: this loads inside the popup window and immediately kicks off the
// OAuth redirect — the popup itself navigates to the provider, not the main tab.
export const OAuthPopupStart: React.FC = () => {
  const { signIn, isLoaded } = useSignIn();
  const strategy = (new URLSearchParams(window.location.search).get('strategy') as OAuthStrategy) || 'oauth_google';
  const providerLabel = strategy === 'oauth_github' ? 'GitHub' : 'Google';

  useEffect(() => {
    if (!isLoaded || !signIn) return;
    signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: `${window.location.origin}/oauth-popup-callback`,
      redirectUrlComplete: `${window.location.origin}/oauth-popup-done`,
    });
  }, [isLoaded, signIn, strategy]);

  return <PopupShell label={`Redirecting to ${providerLabel}…`} />;
};

// Step 2: Google redirects back here (still inside the popup). Clerk
// completes the sign-in, then forwards to /oauth-popup-done.
export const OAuthPopupCallback: React.FC = () => (
  <>
    <PopupShell label="Finishing sign-in…" />
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="/oauth-popup-done"
      signUpFallbackRedirectUrl="/oauth-popup-done"
    />
  </>
);

// Step 3: tells the main tab we're done and closes the popup. The main
// window's Clerk instance picks up the new session on its own.
export const OAuthPopupDone: React.FC = () => {
  useEffect(() => {
    window.opener?.postMessage('clerk-oauth-complete', window.location.origin);
    window.close();
  }, []);

  return <PopupShell label="Signed in — you can close this window." />;
};

export const OAuthPopupRouter: React.FC<{ pathname: string }> = ({ pathname }) => {
  if (pathname === '/oauth-popup') return <OAuthPopupStart />;
  if (pathname === '/oauth-popup-callback') return <OAuthPopupCallback />;
  return <OAuthPopupDone />;
};
