import { Button } from '@/shared/components/Button';

// Empty means same origin. Nginx has a rule for /oauth2/ and sends it to user-service.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const SocialLoginGroup = () => {
  const handleGoogleLogin = () => {
    // Full page redirect — Spring Security owns the OAuth2 flow from here
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="social-login">
      <Button variant="secondary" type="button" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
    </div>
  );
};