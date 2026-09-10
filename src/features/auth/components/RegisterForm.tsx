import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/Button';
import { InputField } from '@/shared/components/InputField';
import { useRegister } from '../hooks/useRegister';
import { useCaptcha } from '../hooks/useCaptcha';
import {
  registerSchema,
  type RegisterFormValues,
} from '../schemas/auth.schemas';

export const RegisterForm = () => {
  const { register: submitRegistration, isLoading, error } = useRegister();
  const { containerRef, getToken, reset } = useCaptcha('register');

  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ name, email, password }: RegisterFormValues) => {
    setCaptchaError(null);
    try {
      const captchaToken = await getToken();
      await submitRegistration({ name, email, password, captchaToken });
    } catch (err) {
      setCaptchaError(
        err instanceof Error ? err.message : 'Security check failed.',
      );
    } finally {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && <p role="alert" className="form-error">{error}</p>}
      {captchaError && <p role="alert" className="form-error">{captchaError}</p>}

      <InputField
        label="Full name"
        error={errors.name?.message}
        {...register('name')}
      />
      <InputField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <InputField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <InputField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {/* Turnstile draws here. Empty until a challenge is needed. */}
      <div ref={containerRef} />

      <Button type="submit" isLoading={isLoading || isSubmitting}>
        Create account
      </Button>
    </form>
  );
};