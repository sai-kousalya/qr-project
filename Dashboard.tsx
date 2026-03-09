
import React from 'react';
import { User, LogOut, QrCode, ShieldCheck, Search } from 'lucide-react';
import { User as UserType } from '../types';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
  onScanClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onScanClick }) => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-8 rounded-3xl shadow-xl border-t-4 border-indigo-500">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Hello, {user.fullName.split(' ')[0]}
            </h2>
            <p className="text-slate-500 text-sm font-medium">Security Level: Standard</p>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 mb-8">
          <p className="text-slate-600 text-sm leading-relaxed">
            This system helps you detect whether a QR Code link is <strong>Safe</strong> or <strong>Phishing</strong> using real-time security scanning.
          </p>
        </div>

        <button 
          onClick={onScanClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <QrCode className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          Scan QR Code
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-100 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 text-green-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-700">Security Engine</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-slate-100 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 text-blue-600">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-700">Pattern Analysis</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
