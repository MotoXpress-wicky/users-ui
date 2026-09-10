import { useCallback, useEffect, useRef } from 'react';
import '@/shared/lib/turnstile';   // pulls in the window.turnstile type

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;

export const useCaptcha = (action: string) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const pendingRef = useRef<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      action,                      // 'register', 'forgot-password', etc.
      execution: 'execute',        // wait, do not solve at page load

      callback: (token) => {
        pendingRef.current?.resolve(token);
        pendingRef.current = null;
      },
      'expired-callback': () => {
        pendingRef.current?.reject(new Error('Security check expired. Please try again.'));
        pendingRef.current = null;
      },
      'error-callback': () => {
        pendingRef.current?.reject(new Error('Security check failed. Please try again.'));
        pendingRef.current = null;
      },
    });

    return () => {
      if (widgetIdRef.current) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
      pendingRef.current = null;
    };
  }, [action]);

  const getToken = useCallback(
    () =>
      new Promise<string>((resolve, reject) => {
        if (!widgetIdRef.current) {
          reject(new Error('Security check is not ready. Please refresh the page.'));
          return;
        }
        pendingRef.current = { resolve, reject };
        window.turnstile.execute(widgetIdRef.current);
      }),
    [],
  );

  const reset = useCallback(() => {
    if (widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
  }, []);

  return { containerRef, getToken, reset };
};