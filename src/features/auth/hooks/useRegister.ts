import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import type { RegisterData } from '../types/auth.types';

export const useRegister = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (payload: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(payload);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};