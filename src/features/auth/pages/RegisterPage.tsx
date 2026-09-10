import { Link } from 'react-router-dom';
import { Divider } from '@/shared/components/Divider';
import { RegisterForm } from '../components/RegisterForm';
import { SocialLoginGroup } from '../components/SocialLoginGroup';

export const RegisterPage = () => (
  <main className="auth-layout">
    <h1>Create your account</h1>
    <RegisterForm />
    <Divider label="OR" />
    <SocialLoginGroup />
    <p>
      Already have an account? <Link to="/login">Sign in</Link>
    </p>
  </main>
);