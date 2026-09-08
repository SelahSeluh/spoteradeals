import React from 'react';
export { ToastProvider, useToast } from '../context/ToastContext';
export type { ToastItem, ToastOptions, ToastType, ToastAction } from '../context/ToastContext';
export { ToastContainer } from './ToastContainer';

// Reusable toast component for stand-alone or custom renders
export const Toast: React.FC = () => {
  return null;
};
