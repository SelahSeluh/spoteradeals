import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface BookingQrProps {
  value: string;
}

export const BookingQr: React.FC<BookingQrProps> = ({ value }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: 200,
      margin: 1,
      color: {
        dark: '#0D1B3E',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        setDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
  }, [value]);

  return (
    <div className="flex flex-col items-center p-5 rounded-[18px] bg-white border border-[#E7EBF2] shadow-xs">
      <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`Booking QR code ${value}`}
            className="w-[190px] h-[190px] block"
          />
        ) : (
          <div className="w-[190px] h-[190px] flex items-center justify-center text-xs text-[#5F6B82] bg-slate-50">
            Generating QR...
          </div>
        )}
      </div>
      <p className="text-xs text-[#5F6B82] mt-3.5 text-center">
        Show this code at the partner entrance
      </p>
      <p className="text-sm font-bold font-mono text-[#0D1B3E] tracking-widest mt-1.5 select-all">
        {value}
      </p>
    </div>
  );
};
