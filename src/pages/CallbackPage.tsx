import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { exchangeCodeForToken } from '../services/authService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CallbackPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        
        if (!code) {
          console.error('No authorization code provided');
          navigate('/login?error=no_code');
          return;
        }

        // Exchange the code for a token
        const token = await exchangeCodeForToken(code);
        
        // Log the user in with the token
        await login(token);
        
        // Redirect to servers page on success
        navigate('/servers');
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-lighter mx-auto"></div>
          <h2 className="text-xl font-bold mt-4 mb-2">Authenticating...</h2>
          <p className="text-text-secondary">Please wait while we complete your Discord authentication.</p>
        </div>
      </Card>
    </div>
  );
};

export default CallbackPage;
