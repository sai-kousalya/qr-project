
import React from 'react';
import { Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  isHome?: boolean;
  customWidth?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, isHome = false, customWidth }) => {
  const widthClass = customWidth || (isHome ? 'max-w-4xl' : 'max-w-md');
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-700 ${isHome ? 'hero-gradient' : 'app-gradient'}`}>
      {!isHome && (
        <header className="mb-8 flex items-center gap-3 relative z-10 animate-in fade-in slide-in-from-top-4">
          <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-xl">
            <Shield className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
            QR Detection System
          </h1>
        </header>
      )}
      
      <main className={`w-full relative z-10 transition-all duration-500 ${widthClass}`}>
        {children}
      </main>

      <footer className={`mt-12 text-sm flex flex-col items-center gap-1 relative z-10 ${isHome ? 'text-white/40' : 'text-indigo-200/40'}`}>
        <p className="font-bold uppercase tracking-widest text-[10px]">&copy; QR Code Phishing Detection System</p>
        <p className="font-medium opacity-60">Advanced Security Protocol v4.2</p>
      </footer>
    </div>
  );
};

export default Layout;
