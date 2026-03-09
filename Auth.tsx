
import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthProps {
  mode: 'login' | 'signup';
  onLogin?: (user: UserType) => void;
  onSignupSuccess?: () => void;
  onSwitchToLogin: () => void;
  onSwitchToSignup: () => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onLogin, onSignupSuccess, onSwitchToLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('Please fill in all fields.');
        return;
      }
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      // Simulate registration
      const users = JSON.parse(localStorage.getItem('qrshield_users') || '[]');
      if (users.some((u: any) => u.email === formData.email)) {
        setError('User with this email already exists.');
        return;
      }
      
      const newUser = { fullName: formData.fullName, email: formData.email, password: formData.password };
      users.push(newUser);
      localStorage.setItem('qrshield_users', JSON.stringify(users));
      onSignupSuccess?.();
    } else {
      // Login mode
      const users = JSON.parse(localStorage.getItem('qrshield_users') || '[]');
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        onLogin?.({ fullName: user.fullName, email: user.email });
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all text-slate-700 bg-slate-50/50";

  return (
    <div className="glass-card p-8 rounded-3xl shadow-xl space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          {mode === 'login' ? 'Access your dashboard' : 'Join the security network'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Full Name"
              className={inputClass}
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            placeholder="Email Address"
            className={inputClass}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="password"
            placeholder="Password"
            className={inputClass}
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>

        {mode === 'signup' && (
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              placeholder="Confirm Password"
              className={inputClass}
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button 
          type="submit"
          className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95"
        >
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="text-center pt-2">
        <button 
          onClick={mode === 'login' ? onSwitchToSignup : onSwitchToLogin}
          className="text-indigo-600 font-bold text-sm hover:underline"
        >
          {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
