import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { exchangeCodeForToken } from '../services/authService';

const CallbackPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('Discord authentication error:', error);
        navigate('/login?error=auth_failed');
        return;
      }

      if (!code) {
        navigate('/login?error=no_code');
        return;
      }

      try {
        const token = await exchangeCodeForToken(code);
        login(token);
        navigate('/servers');
      } catch (err) {
        console.error('Error during authentication:', err);
        navigate('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-lighter mx-auto"></div>
        <p className="mt-4 text-text-primary">Authenticating with Discord...</p>
      </div>
    </div>
  );
};

export default CallbackPage;