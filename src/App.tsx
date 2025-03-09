import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import ServersPage from './pages/ServersPage';
import LogChannelsPage from './pages/LogChannelsPage';
import LanguagePage from './pages/LanguagePage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-lighter mx-auto"></div>
          <p className="mt-4 text-text-primary">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a2b45',
              color: '#ffffff',
              border: '1px solid rgba(62, 136, 247, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#28a745',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#dc3545',
                secondary: '#ffffff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/servers" replace />} />
            <Route 
              path="servers" 
              element={
                <ProtectedRoute>
                  <ServersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="servers/:guildId/logs" 
              element={
                <ProtectedRoute>
                  <LogChannelsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="servers/:guildId/language" 
              element={
                <ProtectedRoute>
                  <LanguagePage />
                </ProtectedRoute>
              } 
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
