// ============================================
// PlayNxt - Toast Context & Provider
// ============================================
// Global toast notification management system
// Usage: const { showToast } = useToast();

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { Toast, ToastType } from '@/components/Toast';

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  /** Show a toast notification */
  showToast: (options: Omit<ToastData, 'id'>) => void;
  /** Show a success toast */
  showSuccess: (message: string, description?: string) => void;
  /** Show an error toast */
  showError: (message: string, description?: string) => void;
  /** Show a warning toast */
  showWarning: (message: string, description?: string) => void;
  /** Show an info toast */
  showInfo: (message: string, description?: string) => void;
  /** Dismiss a specific toast */
  dismissToast: (id: string) => void;
  /** Dismiss all toasts */
  dismissAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastIdCounter = 0;
const generateToastId = () => `toast-${++toastIdCounter}-${Date.now()}`;

/**
 * Toast Provider - Wrap your app with this to enable toast notifications
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((options: Omit<ToastData, 'id'>) => {
    const id = generateToastId();
    setToasts((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  // Convenience methods for common toast types
  const showSuccess = useCallback(
    (message: string, description?: string) => {
      showToast({ type: 'success', message, description });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, description?: string) => {
      showToast({ type: 'error', message, description, duration: 6000 });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, description?: string) => {
      showToast({ type: 'warning', message, description, duration: 5000 });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, description?: string) => {
      showToast({ type: 'info', message, description });
    },
    [showToast]
  );

  const contextValue = useMemo(
    () => ({
      showToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      dismissToast,
      dismissAllToasts,
    }),
    [showToast, showSuccess, showError, showWarning, showInfo, dismissToast, dismissAllToasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast container - renders above all content */}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            description={toast.description}
            duration={toast.duration}
            onDismiss={dismissToast}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast functions
 * Must be used within ToastProvider
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});

