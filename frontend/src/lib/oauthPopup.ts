const POPUP_PATHS = ['/oauth-popup', '/oauth-popup-callback', '/oauth-popup-done'];

export type OAuthStrategy = 'oauth_google' | 'oauth_github';

export function isOAuthPopupPath(pathname: string): boolean {
  return POPUP_PATHS.includes(pathname);
}

/**
 * Opens Clerk sign-in (Google or GitHub) in a small popup window instead of
 * redirecting the whole tab away. Must be called synchronously from a click
 * handler — browsers block window.open() calls made after an await.
 *
 * Defaults to a full page reload on completion — Clerk's cross-tab session
 * sync isn't reliably instant, and a reload is the simplest guarantee that
 * every signed-in-dependent bit of UI (reactions, likes, admin controls)
 * picks up the new session immediately instead of requiring a manual refresh.
 */
export function openOAuthPopup(strategy: OAuthStrategy, onComplete: () => void = () => window.location.reload()) {
  const width = 480;
  const height = 640;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

  const popup = window.open(
    `/oauth-popup?strategy=${strategy}`,
    'clerk-oauth',
    `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
  );

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    if (event.data === 'clerk-oauth-complete') {
      window.removeEventListener('message', handleMessage);
      onComplete?.();
    }
  };
  window.addEventListener('message', handleMessage);

  // Fallback: if the user closes the popup manually, stop listening after a
  // while so we don't leak the listener forever.
  const poll = window.setInterval(() => {
    if (popup?.closed) {
      window.clearInterval(poll);
      window.removeEventListener('message', handleMessage);
    }
  }, 500);
}
