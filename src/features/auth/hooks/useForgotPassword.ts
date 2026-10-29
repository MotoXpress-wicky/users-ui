import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import type { ForgotPasswordData } from '../types/auth.types';

/**
 * Courtesy timer only — the real cooldown is enforced server-side and stays
 * silent. Keep this at or above app.password-reset.resend-cooldown-seconds,
 * or the button re-enables while the server is still dropping requests.
 */
const COOLDOWN_SECONDS = 60;
const COOLDOWN_KEY = 'pw_reset_cooldown_until';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const startCooldown = useCallback(() => {
    const until = Date.now() + COOLDOWN_SECONDS * 1000;
    sessionStorage.setItem(COOLDOWN_KEY, String(until));
    setSecondsLeft(COOLDOWN_SECONDS);
  }, []);

  // Restore a cooldown that was running before a page refresh.
  useEffect(() => {
    const storedUntil = Number(sessionStorage.getItem(COOLDOWN_KEY) ?? 0);
    const remaining = Math.ceil((storedUntil - Date.now()) / 1000);

    if (remaining > 0) {
      // Reading sessionStorage is an outside system, so this has to happen after the first render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSecondsLeft(remaining);
    } else {
      sessionStorage.removeItem(COOLDOWN_KEY);
    }
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          sessionStorage.removeItem(COOLDOWN_KEY);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  const requestReset = async (payload: ForgotPasswordData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.forgotPassword(payload);
      // The API returns the same 200 whether or not the account exists,
      // and whether or not the server actually sent anything. The UI
      // must not pretend to know more than that.
      setIsSubmitted(true);
      startCooldown();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { requestReset, isLoading, error, isSubmitted, secondsLeft };
};