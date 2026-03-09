
import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Loader2, Image as ImageIcon, AlertCircle, Upload, ScanLine, ShieldCheck, ChevronRight, Search, Link as LinkIcon } from 'lucide-react';

interface ScannerProps {
  onScan: (url: string) => void;
  onCancel: () => void;
}

type ScanMode = 'camera' | 'gallery' | 'url';

const Scanner: React.FC<ScannerProps> = ({ onScan, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [scanMode, setScanMode] = useState<ScanMode>('camera');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  const [lastScanTime, setLastScanTime] = useState(0);

  // Auto-scan effect
  useEffect(() => {
    let animationFrame: number;
    const SCAN_INTERVAL = 500; // Scan every 500ms to avoid too frequent processing

    const autoScanFrame = () => {
      if (scanMode === 'camera' && autoScanEnabled && !isAnalyzing && !loading && !error) {
        const now = Date.now();
        if (now - lastScanTime >= SCAN_INTERVAL) {
          handleCameraScan();
          setLastScanTime(now);
        }
      }
      animationFrame = requestAnimationFrame(autoScanFrame);
    };

    if (scanMode === 'camera' && autoScanEnabled) {
      animationFrame = requestAnimationFrame(autoScanFrame);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [scanMode, autoScanEnabled, isAnalyzing, loading, error, lastScanTime]);

  // Start/Stop Camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (scanMode !== 'camera') return;
      
      try {
        setLoading(true);
        setError(null);
        console.log("Requesting camera permissions...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', 
            width: { ideal: 1280 }, 
            height: { ideal: 960 } 
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Important: Some browsers require explicit play call even with autoPlay
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
              console.log("Camera stream started successfully");
              setLoading(false);
            } catch (playError) {
              console.error("Error playing video stream:", playError);
              setError("Failed to start video playback. Please interact with the page and try again.");
              setLoading(false);
            }
          };
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError('Camera access denied or unavailable. Please check your device settings and browser permissions.');
        setLoading(false);
      }
    };

    if (scanMode === 'camera') {
      startCamera();
    } else {
      setLoading(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [scanMode]);

  // Capture and Scan from Camera Feed
  const handleCameraScan = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // @ts-ignore - jsQR is loaded via script tag in index.html
      const code = window.jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setIsAnalyzing(true); // Only show analyzing when we found a code
        // Add a small delay to show the analyzing state briefly
        setTimeout(() => {
          setIsAnalyzing(false);
          onScan(code.data);
        }, 300);
      }
      // No else clause - don't show error for auto-scan, just continue silently
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGalleryError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryScan = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setGalleryError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // @ts-ignore
      const code = window.jsQR(imageData.data, imageData.width, imageData.height);

      setTimeout(() => {
        setIsAnalyzing(false);
        if (code) {
          onScan(code.data);
        } else {
          setGalleryError('Security Failure: No valid QR pattern found in this image.');
        }
      }, 1000);
    };
    img.src = selectedImage;
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onScan(manualUrl.trim());
    }
  };

  return (
    <div className="glass-card rounded-[3rem] shadow-2xl space-y-0 relative overflow-hidden flex flex-col max-h-[95vh] border border-white/60">
      {/* Header */}
      <div className="p-8 pb-6 flex items-center justify-between border-b border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">Security Engine</h2>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Extended Viewport Scan</span>
        </div>
        <button onClick={onCancel} className="p-3 hover:bg-slate-100 rounded-[1.25rem] transition-all text-slate-400 hover:text-slate-600 active:scale-90">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Mode Navigation */}
      <div className="px-8 py-4 bg-slate-50/50">
        <div className="flex bg-white p-2 rounded-[1.5rem] gap-2 shadow-sm border border-slate-100">
          {(['camera', 'gallery', 'url'] as const).map((mode) => (
            <button 
              key={mode}
              onClick={() => { 
                setScanMode(mode); 
                setSelectedImage(null); 
                setGalleryError(null); 
                setError(null);
                if (mode === 'camera') {
                  setAutoScanEnabled(true); // Enable auto-scan when switching to camera
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-[1.1rem] text-[11px] font-black transition-all uppercase tracking-widest ${scanMode === mode ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {mode === 'camera' && <Camera className="w-5 h-5" />}
              {mode === 'gallery' && <ImageIcon className="w-5 h-5" />}
              {mode === 'url' && <LinkIcon className="w-5 h-5" />}
              {mode === 'url' ? 'DIRECT URL' : mode}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto flex flex-col items-center">
        {scanMode === 'camera' && (
          <div className="space-y-6 w-full flex flex-col items-center">
            {/* LARGE FIXED SCAN BOX: 380x540px */}
            <div className="relative w-[380px] h-[540px] max-w-full rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl border-[6px] border-white flex items-center justify-center">
              {loading && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-20">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mb-4" />
                  <p className="text-[12px] font-black tracking-widest uppercase opacity-40">Connecting Lens</p>
                </div>
              )}
              {error ? (
                <div className="p-10 text-center text-white bg-slate-900 absolute inset-0 flex flex-col items-center justify-center z-20">
                  <AlertCircle className="w-14 h-14 text-yellow-400 mb-6" />
                  <p className="font-black text-xl mb-2">System Status</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    playsInline 
                    autoPlay
                    muted
                    className="w-full h-full object-contain bg-black"
                  />
                  
                  {/* Visual Scanning Overlay */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] animate-scan z-10"></div>
                  <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none z-10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white/30 border-dashed rounded-[3rem] pointer-events-none z-10"></div>
                  
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                       <Loader2 className="w-16 h-16 animate-spin text-indigo-400 mb-4" />
                       <p className="text-[12px] font-black text-white uppercase tracking-[0.4em]">QR Code Detected...</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Auto-scan toggle */}
            <div className="flex items-center justify-center gap-4 w-full max-w-[380px]">
              <span className="text-[12px] font-black text-slate-600 uppercase tracking-widest">AUTO SCAN</span>
              <button
                onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${autoScanEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${autoScanEnabled ? 'left-9' : 'left-1'}`}></div>
              </button>
              <span className={`text-[12px] font-black uppercase tracking-widest ${autoScanEnabled ? 'text-indigo-600' : 'text-slate-400'}`}>
                {autoScanEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
            
            {!autoScanEnabled && (
              <button 
                onClick={handleCameraScan}
                disabled={loading || !!error || isAnalyzing}
                className="w-full max-w-[380px] bg-indigo-600 hover:bg-indigo-700 text-white py-6 px-8 rounded-[2rem] font-black shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 text-lg uppercase tracking-wider"
              >
                <ScanLine className="w-6 h-6" />
                ANALYZE CURRENT VIEW
              </button>
            )}
            
            <p className="text-[11px] text-center text-slate-400 font-black uppercase tracking-[0.2em] italic">
              {autoScanEnabled ? 'Auto-scanning active - point camera at QR code' : 'Ensure the QR code is centered and readable'}
            </p>
          </div>
        )}

        {scanMode === 'gallery' && (
          <div className="space-y-6 w-full flex flex-col items-center">
            {/* LARGE FIXED SCAN BOX: 380x540px */}
            <div className="relative w-[380px] h-[540px] max-w-full rounded-[2.5rem] bg-slate-100 overflow-hidden border-[6px] border-white flex items-center justify-center shadow-inner group">
              {selectedImage ? (
                <div className="relative w-full h-full bg-slate-50 flex items-center justify-center">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded QR" 
                    className="w-full h-full object-contain p-8" 
                  />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl text-white p-3 rounded-2xl hover:bg-black transition-all shadow-xl z-20"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-30">
                      <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mb-4" />
                      <p className="text-[12px] font-black text-slate-800 uppercase tracking-[0.4em]">Decoding Image...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-10 text-center cursor-pointer flex flex-col items-center gap-8 transition-all hover:scale-105 active:scale-95 w-full h-full justify-center"
                >
                  <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center text-indigo-600 shadow-2xl ring-1 ring-slate-100">
                    <Upload className="w-14 h-14" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 uppercase text-[14px] tracking-widest mb-2">Import QR Fragment</p>
                    <p className="text-[11px] text-slate-400 font-bold italic tracking-wide opacity-60">Tap to browse files</p>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>

            {selectedImage && (
              <button 
                onClick={handleGalleryScan}
                disabled={isAnalyzing}
                className="w-full max-w-[380px] bg-indigo-600 hover:bg-indigo-700 text-white py-6 px-8 rounded-[2rem] font-black shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 text-lg uppercase tracking-wider"
              >
                <ScanLine className="w-6 h-6" />
                ANALYZE UPLOAD
              </button>
            )}

            {galleryError && (
              <div className="w-full max-w-[380px] bg-red-50 text-red-600 p-6 rounded-[2rem] text-[12px] font-black border border-red-100 flex items-center gap-4 animate-shake">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                {galleryError}
              </div>
            )}
          </div>
        )}

        {scanMode === 'url' && (
          <form onSubmit={handleManualSubmit} className="space-y-10 pt-4 w-full">
            <div className="space-y-5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] px-4">Manual Domain Inspection</label>
              <div className="relative group">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 text-indigo-500 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-sm">
                   <LinkIcon className="w-5 h-5" />
                </div>
                <input 
                  type="text"
                  autoFocus
                  placeholder="Paste URL (e.g. login.secure-portal.co)"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="w-full pl-24 pr-8 py-8 rounded-[2.5rem] border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 bg-slate-50/50 font-black placeholder:opacity-30 shadow-inner text-xl"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={!manualUrl.trim()}
              className="w-full bg-slate-900 hover:bg-black text-white py-8 px-10 rounded-[2.5rem] font-black shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 disabled:grayscale group text-xl uppercase tracking-[0.2em]"
            >
              <Search className="w-6 h-6" />
              RUN SECURITY SCAN
            </button>
          </form>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0.2; }
          50% { opacity: 1; }
          100% { top: 95%; opacity: 0.2; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite alternate;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out 2;
        }
      `}</style>
    </div>
  );
};

export default Scanner;
