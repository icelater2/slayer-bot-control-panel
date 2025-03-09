import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { exchangeCodeForToken } from '../services/authService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CallbackPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          console.error('Discord authentication error:', error);
          setError('Authentication was denied or failed.');
          return;
        }

        if (!code) {
          console.error('No authorization code provided');
          setError('No authorization code was provided.');
          return;
        }

        // Exchange the code for a token
        const token = await exchangeCodeForToken(code);
        
        // Log the user in with the token
        await login(token);
        
        // Redirect to servers page on success
        navigate('/servers');
      } catch (error: any) {
        console.error('Authentication error:', error);
        setError(error.message || 'Failed to complete authentication. Please try again.');
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center">
            <div className="text-error text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
            <p className="text-text-secondary mb-6">{error}</p>
            <Button onClick={() => navigate('/login')}>
              Return to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
