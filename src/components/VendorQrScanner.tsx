import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Camera,
  Search,
  Sparkles,
  Ticket,
  CalendarCheck,
  User,
  ShieldCheck,
  AlertCircle,
  CameraOff,
  Clock,
  RefreshCw,
  X,
} from 'lucide-react';
import jsQR from 'jsqr';
import { useApp } from '../context/AppContext';

interface VendorQrScannerProps {
  businessName?: string;
  title?: string;
  subtitle?: string;
  onRedeemedSuccess?: () => void;
  onClose?: () => void;
}

export const VendorQrScanner: React.FC<VendorQrScannerProps> = ({
  businessName = 'Spotera Partner Venue',
  title = 'Scan QR Code or Enter Voucher',
  subtitle,
  onRedeemedSuccess,
  onClose,
}) => {
  const { bookings, coupons, redeemCode } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    type?: 'booking' | 'coupon';
    title?: string;
    customerName?: string;
    code?: string;
    message: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const isProcessingRef = useRef(false);

  // Active pending items for quick 1-click test scanning
  const pendingBookings = bookings.filter((b) => b.status === 'confirmed');
  const activeCoupons = coupons.filter((c) => c.status === 'active');

  const handleVerify = (codeToTest: string) => {
    if (!codeToTest.trim()) return;
    const res = redeemCode(codeToTest, businessName);
    setScanResult(res);
    setInputCode('');
    if (res.success && onRedeemedSuccess) {
      onRedeemedSuccess();
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setScanResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported on this device/browser. Please use manual code verification below.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera permission error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access in your browser settings to scan QR codes.');
      } else {
        setCameraError('Unable to access device camera. Please check camera settings or use manual code entry.');
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Continuous frame analysis loop
  useEffect(() => {
    let active = true;

    const scanFrame = () => {
      if (!active || !isCameraActive) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data && !isProcessingRef.current) {
            isProcessingRef.current = true;
            handleVerify(code.data);

            // Cooldown 3s before next auto-scan
            setTimeout(() => {
              isProcessingRef.current = false;
            }, 3000);
          }
        }
      }

      animFrameId.current = requestAnimationFrame(scanFrame);
    };

    if (isCameraActive) {
      animFrameId.current = requestAnimationFrame(scanFrame);
    }

    return () => {
      active = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isCameraActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(inputCode);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden space-y-0">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#1D6FE0] to-[#2563EB] text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
        <div className="space-y-1 pr-8 sm:pr-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-blue-100 font-extrabold text-[11px] uppercase tracking-wider">
              Spotera QR Scanner
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black font-sans">{title}</h2>
          <p className="text-xs text-blue-100/90">
            {subtitle || `Validating for ${businessName}`}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
              isCameraActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-white hover:bg-blue-50 text-[#1D6FE0]'
            }`}
          >
            {isCameraActive ? (
              <>
                <CameraOff className="w-3.5 h-3.5" />
                <span>Turn Off Camera</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5 text-[#1D6FE0]" />
                <span>Launch Camera</span>
              </>
            )}
          </button>

          {onClose && (
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Close QR Scanner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Camera Error Alert */}
        {cameraError && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold">Camera Access Notice</div>
              <p className="leading-relaxed text-[11px]">{cameraError}</p>
            </div>
          </div>
        )}

        {/* Live Camera Viewfinder Box */}
        {isCameraActive && (
          <div className="relative bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden p-2 text-center text-white border-2 border-slate-800 shadow-2xl max-w-md mx-auto">
            <video
              ref={videoRef}
              className="w-full h-56 sm:h-64 object-cover rounded-xl"
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanning Target Reticle Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6 sm:p-8">
              <div className="w-44 h-44 sm:w-48 sm:h-48 border-2 border-[#1D6FE0] rounded-2xl relative shadow-[0_0_20px_rgba(29,111,224,0.5)]">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br" />
                <div className="w-full h-0.5 bg-[#1D6FE0] absolute top-1/2 -translate-y-1/2 shadow-[0_0_10px_#1D6FE0] animate-pulse" />
              </div>
            </div>

            <div className="p-2 bg-slate-900/90 text-[10px] sm:text-[11px] text-blue-200 font-bold flex items-center justify-center gap-1.5 rounded-b-xl mt-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>Camera Active • Align Spotera QR Code inside target</span>
            </div>
          </div>
        )}

        {/* Manual Code Form */}
        <form onSubmit={handleFormSubmit} className="space-y-2.5">
          <label className="font-extrabold text-xs text-slate-800 block">
            Manual Booking Ref Code or Voucher Number
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. SP-BK-2026-8819, SPOTERA-KIDZANIA-1"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 bg-[#1D6FE0] hover:bg-[#1557b0] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Code</span>
            </button>
          </div>
        </form>

        {/* Verification Result Banner */}
        {scanResult && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-2 transition-all ${
              scanResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-xs'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {scanResult.success ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 flex-1">
                <div className="font-black text-sm flex items-center gap-2">
                  <span>{scanResult.success ? 'VALID & VERIFIED' : 'VERIFICATION NOTICE'}</span>
                  {scanResult.type && (
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full font-bold bg-white border border-slate-200 text-slate-700">
                      {scanResult.type}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-slate-800 leading-relaxed text-xs">{scanResult.message}</p>

                {scanResult.customerName && (
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-3 text-[11px] text-slate-700 font-bold">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600" /> Pass Holder: {scanResult.customerName}
                    </span>
                    {scanResult.code && (
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                        Code: {scanResult.code}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Demo Test Buttons */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick 1-Tap Test: Click any sample pass to simulate instant scan:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pendingBookings.slice(0, 2).map((bk) => (
              <button
                key={bk.id}
                type="button"
                onClick={() => handleVerify(bk.bookingCode)}
                className="p-2.5 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-xl text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-blue-900 group-hover:text-blue-700 flex items-center gap-1">
                    <CalendarCheck className="w-3 h-3 text-blue-600" /> Booking Pass
                  </span>
                  <span className="font-mono font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                    {bk.bookingCode}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-900 truncate">{bk.dealTitle}</div>
                <div className="text-[10px] text-slate-600">
                  Pass: <span className="font-semibold text-slate-900">{bk.userName}</span>
                </div>
              </button>
            ))}

            {activeCoupons.slice(0, 2).map((cp) => (
              <button
                key={cp.id}
                type="button"
                onClick={() => handleVerify(cp.code)}
                className="p-2.5 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-emerald-900 group-hover:text-emerald-700 flex items-center gap-1">
                    <Ticket className="w-3 h-3 text-emerald-600" /> Coupon Pass
                  </span>
                  <span className="font-mono font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                    {cp.code}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-900 truncate">{cp.dealTitle}</div>
                <div className="text-[10px] text-slate-600">
                  Pass: <span className="font-semibold text-slate-900">{cp.userName}</span>
                </div>
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleVerify('SPOTERA-KIDZANIA-1')}
              className="p-2.5 bg-amber-50/80 hover:bg-amber-100 border border-amber-200 rounded-xl text-left space-y-1 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Promo Voucher
                </span>
                <span className="font-mono font-bold text-amber-800 bg-white px-1.5 py-0.5 rounded border border-amber-200">
                  SPOTERA-KIDZANIA-1
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-900 truncate">KidZania Dubai Junior Pass</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

