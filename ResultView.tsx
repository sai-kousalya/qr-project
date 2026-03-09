
import React, { useState } from 'react';
import { ScanResult, DetectionStatus } from '../types';
import { STATUS_UI_CONFIG } from '../constants';
import { RefreshCw, ExternalLink, AlertTriangle, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react';

interface ResultViewProps {
  result: ScanResult;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const config = STATUS_UI_CONFIG[result.status];
  const isSafe = result.status === DetectionStatus.SAFE;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`glass-card p-6 md:p-8 rounded-[3rem] shadow-2xl border-4 ${config.border} space-y-8 transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-8`}>
      {/* Alert Header */}
      <div className={`flex items-center justify-center gap-2 py-3 px-6 rounded-full text-[10px] font-black tracking-[0.3em] uppercase ${isSafe ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>
        {isSafe ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
        {config.alertMessage}
      </div>

      {/* Main Status Icon */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className={`p-8 rounded-[2.5rem] ${config.bg} shadow-inner transform transition-transform hover:scale-105 duration-300 ring-8 ring-white`}>
          {config.icon}
        </div>
        <div>
          <h2 className={`text-3xl md:text-4xl font-black ${config.color} uppercase tracking-tighter leading-none`}>
            {config.label}
          </h2>
          <p className="text-slate-400 text-[10px] font-black mt-3 tracking-[0.3em] uppercase">Security Audit Complete</p>
        </div>
      </div>

      {/* URL Display Box - Improved for visibility */}
      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 overflow-hidden shadow-inner relative group">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> Destination URL
          </p>
          <button 
            onClick={handleCopy}
            className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5 bg-white py-1.5 px-3 rounded-xl border border-slate-100 shadow-sm"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
        <div className="text-sm font-mono break-all overflow-wrap-anywhere text-slate-700 bg-white p-4 rounded-[1.25rem] border border-slate-100 shadow-sm max-h-40 overflow-y-auto custom-scrollbar">
          {result.url}
        </div>
      </div>

      {/* Analysis Report */}
      <div className="space-y-4 bg-white/60 p-6 rounded-[2rem] border border-white shadow-sm">
        <div className="flex items-start gap-4">
          <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${config.bg} ${config.color}`}>
             <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-1">Threat Report Details</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {result.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 space-y-4">
        {result.status !== DetectionStatus.PHISHING && (
          <a 
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full ${isSafe ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800 hover:bg-black'} text-white py-5 px-6 rounded-[1.5rem] font-black text-center block transition-all shadow-xl hover:shadow-2xl active:scale-95 text-lg`}
          >
            {isSafe ? 'VISIT VERIFIED SOURCE' : 'PROCEED AT OWN RISK'}
          </a>
        )}
        
        {result.status === DetectionStatus.PHISHING && (
          <div className="bg-red-600 p-6 rounded-[1.5rem] text-white flex items-center gap-4 mb-4 shadow-xl">
            <AlertCircle className="w-8 h-8 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1">Security Warning</p>
              <p className="text-sm font-bold opacity-90 leading-tight">
                This URL has been blacklisted as a malicious threat. Access is strictly restricted.
              </p>
            </div>
          </div>
        )}

        <button 
          onClick={onReset}
          className="w-full bg-white border-2 border-slate-100 text-slate-500 py-5 px-6 rounded-[1.5rem] font-black transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-3 active:scale-95 group"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          NEW SECURITY SCAN
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .overflow-wrap-anywhere {
          overflow-wrap: anywhere;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
};

export default ResultView;
