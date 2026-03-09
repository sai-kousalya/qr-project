
import React from 'react';
import { ShieldCheck, QrCode, Lock, ChevronRight, Zap } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="text-white space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-sm font-semibold tracking-wide">
            <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            PROTECTING YOUR DIGITAL ASSETS
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            QR Code <span className="text-indigo-200">Phishing</span> Detection System
          </h1>
          <p className="text-lg text-indigo-100 max-w-xl mx-auto md:mx-0 font-medium">
            Scan and verify any QR code instantly. Our system uses advanced security protocols to protect you from malicious URLs and credential harvesting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={onStart}
              className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black text-lg shadow-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Get Started Now
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="bg-indigo-500/30 backdrop-blur-md border border-white/30 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-500/40 transition-all">
              Security Protocol
            </button>
          </div>
        </div>

        <div className="flex-1 relative hidden lg:block">
          <div className="animate-float relative z-10">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[3rem] shadow-2xl transform rotate-3">
              <div className="bg-white p-6 rounded-3xl shadow-inner mb-6 flex items-center justify-center">
                 <QrCode className="w-48 h-48 text-indigo-600" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-green-500 p-4 rounded-2xl shadow-xl z-20 border-4 border-white transform -rotate-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          {/* Decorative blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/30 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/30 rounded-full blur-[80px] -z-10"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
          <div className="bg-indigo-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Domain Verification</h3>
          <p className="text-indigo-100 text-sm opacity-80">We check every link against a massive database of trusted and malicious domains.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
          <div className="bg-pink-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Pattern Analysis</h3>
          <p className="text-indigo-100 text-sm opacity-80">Our engine identifies obfuscated URLs and suspicious link shorteners instantly.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
          <div className="bg-green-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Zero-Trust Audit</h3>
          <p className="text-indigo-100 text-sm opacity-80">Every QR code is treated as suspicious until proven safe by our real-time security checks.</p>
        </div>
      </div>
    </div>
  );
};

const Search = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export default Home;
