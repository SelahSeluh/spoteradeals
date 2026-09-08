import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, ToastItem } from '../context/ToastContext';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();
  const { isRtl } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed z-50 pointer-events-none flex flex-col gap-2.5 items-center w-full max-w-full px-4
        bottom-20 left-0 right-0 sm:bottom-6 sm:px-0 sm:w-auto sm:max-w-md
        ${isRtl ? 'sm:left-6 sm:right-auto sm:items-start' : 'sm:right-6 sm:left-auto sm:items-end'}
      `}
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} isRtl={isRtl} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: () => void;
  isRtl: boolean;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss, isRtl }) => {
  const renderIcon = () => {
    if (toast.icon) {
      if (typeof toast.icon === 'string') {
        return <span className="text-base select-none shrink-0">{toast.icon}</span>;
      }
      return toast.icon;
    }

    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-[#1D6FE0] shrink-0" />;
    }
  };

  const getBorderAndBg = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-200/90 bg-white text-slate-900 shadow-lg shadow-emerald-500/5';
      case 'error':
        return 'border-rose-200/90 bg-white text-slate-900 shadow-lg shadow-rose-500/5';
      case 'warning':
        return 'border-amber-200/90 bg-white text-slate-900 shadow-lg shadow-amber-500/5';
      case 'info':
      default:
        return 'border-blue-200/90 bg-white text-slate-900 shadow-lg shadow-blue-500/5';
    }
  };

  const getIconBg = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-100';
      case 'error':
        return 'bg-rose-50 border-rose-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.9, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className={`pointer-events-auto w-full sm:w-[380px] p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-3 ${getBorderAndBg()} transition-all`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Left Icon Badge */}
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getIconBg()}`}>
          {renderIcon()}
        </div>

        {/* Text Content */}
        <div className="min-w-0 flex-1 space-y-0.5">
          {toast.title && (
            <h4 className="text-xs font-bold text-slate-900 truncate font-sans">{toast.title}</h4>
          )}
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug line-clamp-2 font-sans">
            {toast.message}
          </p>
        </div>
      </div>

      {/* Right Controls: Action Button (if any) & Dismiss Close Button */}
      <div className="flex items-center gap-1.5 shrink-0">
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onDismiss();
            }}
            className="px-2.5 py-1 text-xs font-bold text-white bg-[#1D6FE0] hover:bg-[#0B3D75] rounded-xl transition-colors shrink-0 shadow-xs active:scale-95"
          >
            {toast.action.label}
          </button>
        )}

        <button
          onClick={onDismiss}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label="Dismiss notification"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
