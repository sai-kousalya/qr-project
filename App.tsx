
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import ResultView from './components/ResultView';
import { AppView, User, ScanResult } from './types';
import { analyzeUrl } from './services/phishingDetector';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [user, setUser] = useState<User | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('qrshield_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('qrshield_session', JSON.stringify(u));
    setView('dashboard');
  };

  const handleSignup = () => {
    setView('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('qrshield_session');
    setUser(null);
    setView('home');
  };

  const handleScan = (url: string) => {
    const analysis = analyzeUrl(url);
    setScanResult(analysis);
    setView('result');
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <Home onStart={() => setView('login')} />;
      case 'login':
        return (
          <Auth 
            mode="login" 
            onLogin={handleLogin} 
            onSwitchToSignup={() => setView('signup')} 
            onSwitchToLogin={() => setView('login')} 
          />
        );
      case 'signup':
        return (
          <Auth 
            mode="signup" 
            onSignupSuccess={handleSignup} 
            onSwitchToLogin={() => setView('login')} 
            onSwitchToSignup={() => setView('signup')} 
          />
        );
      case 'dashboard':
        return user ? (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            onScanClick={() => setView('scanner')} 
          />
        ) : null;
      case 'scanner':
        return <Scanner onScan={handleScan} onCancel={() => setView('dashboard')} />;
      case 'result':
        return scanResult ? (
          <ResultView result={scanResult} onReset={() => setView('dashboard')} />
        ) : null;
      default:
        return null;
    }
  };

  // Fixed narrow width for all views, focusing on vertical layout
  const getContainerWidth = () => {
    if (view === 'home') return 'max-w-4xl';
    return 'max-w-md';
  };

  return (
    <Layout isHome={view === 'home'} customWidth={getContainerWidth()}>
      {renderContent()}
    </Layout>
  );
};

export default App;
