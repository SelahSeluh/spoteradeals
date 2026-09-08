import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  icon?: React.ReactNode | string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastItem extends ToastOptions {
  id: string;
  createdAt: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: {
    (options: ToastOptions | string, type?: ToastType): string;
    success: (messageOrTitle: string, messageOrOptions?: string | Omit<ToastOptions, 'message' | 'type'>) => string;
    error: (messageOrTitle: string, messageOrOptions?: string | Omit<ToastOptions, 'message' | 'type'>) => string;
    warning: (messageOrTitle: string, messageOrOptions?: string | Omit<ToastOptions, 'message' | 'type'>) => string;
    info: (messageOrTitle: string, messageOrOptions?: string | Omit<ToastOptions, 'message' | 'type'>) => string;
  };
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, any>>({});

  const dismissToast = useCallback((id: string) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAllToasts = useCallback(() => {
    Object.values(timersRef.current).forEach((timer: any) => {
      if (timer) clearTimeout(timer);
    });
    timersRef.current = {};
    setToasts([]);
  }, []);

  const addToastHandler = useCallback(
    (input: ToastOptions | string, defaultType: ToastType = 'info'): string => {
      const opts: ToastOptions =
        typeof input === 'string' ? { message: input, type: defaultType } : { type: defaultType, ...input };

      const type = opts.type || defaultType;
      const message = opts.message || '';
      if (!message) return '';

      const id = opts.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const duration = opts.duration ?? (type === 'error' || type === 'warning' ? 5000 : 3500);

      setToasts((prev) => {
        // Prevent exact duplicate notifications from stacking repeatedly
        const duplicateIndex = prev.findIndex((t) => t.message === message && t.type === type);
        let updatedList = [...prev];

        if (duplicateIndex !== -1) {
          // Reset timer for existing duplicate
          const existingId = updatedList[duplicateIndex].id;
          if (timersRef.current[existingId]) {
            clearTimeout(timersRef.current[existingId]);
          }
          // Move to the end with updated timestamp
          const existing = updatedList[duplicateIndex];
          updatedList.splice(duplicateIndex, 1);
          updatedList.push({ ...existing, createdAt: Date.now() });

          timersRef.current[existingId] = setTimeout(() => {
            dismissToast(existingId);
          }, duration);

          return updatedList;
        }

        // Limit active toasts to max 3 at a time to prevent screen overlap
        if (updatedList.length >= 3) {
          const oldest = updatedList.shift();
          if (oldest && timersRef.current[oldest.id]) {
            clearTimeout(timersRef.current[oldest.id]);
            delete timersRef.current[oldest.id];
          }
        }

        const newItem: ToastItem = {
          ...opts,
          id,
          type,
          message,
          createdAt: Date.now(),
        };

        timersRef.current[id] = setTimeout(() => {
          dismissToast(id);
        }, duration);

        return [...updatedList, newItem];
      });

      return id;
    },
    [dismissToast]
  );

  const parseToastArgs = useCallback(
    (
      messageOrTitle: string,
      messageOrOptions?: string | Omit<ToastOptions, 'message' | 'type'>,
      defaultType: ToastType = 'info'
    ): ToastOptions => {
      if (typeof messageOrOptions === 'string') {
        return {
          title: messageOrTitle,
          message: messageOrOptions,
          type: defaultType,
        };
      }
      return {
        ...messageOrOptions,
        message: messageOrTitle,
        type: defaultType,
      };
    },
    []
  );

  // Construct callable showToast function with shortcuts (.success, .error, etc.)
  const showToastFn = React.useMemo(() => {
    const fn = ((options: ToastOptions | string, type?: ToastType) => {
      return addToastHandler(options, type);
    }) as ToastContextType['showToast'];

    fn.success = (
      messageOrTitle: string,
      messageOrOptions?: string | Omit<ToastOptions, 'message' | 'type'>
    ) => addToastHandler(parseToastArgs(messageOrTitle, messageOrOptions, 'success'), 'success');

    fn.error = (
      messageOrTitle: string,
      messageOrOptions?: string | Omit<ToastOptions, 'message' | 'type'>
    ) => addToastHandler(parseToastArgs(messageOrTitle, messageOrOptions, 'error'), 'error');

    fn.warning = (
      messageOrTitle: string,
      messageOrOptions?: string | Omit<ToastOptions, 'message' | 'type'>
    ) => addToastHandler(parseToastArgs(messageOrTitle, messageOrOptions, 'warning'), 'warning');

    fn.info = (
      messageOrTitle: string,
      messageOrOptions?: string | Omit<ToastOptions, 'message' | 'type'>
    ) => addToastHandler(parseToastArgs(messageOrTitle, messageOrOptions, 'info'), 'info');

    return fn;
  }, [addToastHandler, parseToastArgs]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast: showToastFn,
        dismissToast,
        dismissAllToasts,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
