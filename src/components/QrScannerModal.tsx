import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VendorQrScanner } from './VendorQrScanner';

export const QrScannerModal: React.FC = () => {
  const { isQrScannerOpen, setIsQrScannerOpen } = useApp();

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQrScannerOpen) {
        setIsQrScannerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQrScannerOpen, setIsQrScannerOpen]);

  if (!isQrScannerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsQrScannerOpen(false);
        }
      }}
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-scale-up">
        <VendorQrScanner
          title="Spotera QR Scanner"
          subtitle="Scan any Spotera digital voucher, booking pass, or promo code"
          onClose={() => setIsQrScannerOpen(false)}
        />
      </div>
    </div>
  );
};
