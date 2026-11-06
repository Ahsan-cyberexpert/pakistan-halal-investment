"use client";
import { useState, useEffect, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toastListeners: Array<(toast: Omit<ToastItem, "id">) => void> = [];

export const toast = {
  success: (message: string) => toastListeners.forEach(fn => fn({ message, type: "success" })),
  error: (message: string) => toastListeners.forEach(fn => fn({ message, type: "error" })),
  info: (message: string) => toastListeners.forEach(fn => fn({ message, type: "info" })),
  warning: (message: string) => toastListeners.forEach(fn => fn({ message, type: "warning" })),
};

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ️",
  warning: "!",
};

const COLORS: Record<ToastType, string> = {
  success: "border-l-emerald-500",
  error: "border-l-red-500",
  info: "border-l-blue-500",
  warning: "border-l-amber-500",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter(fn => fn !== addToast);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-8 right-4 z-[9999] flex flex-col-reverse gap-2 max-w-xs w-full">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 p-4 rounded-2xl border-l-4 ${COLORS[t.type]} shadow-2xl border border-slate-100 animate-in slide-in-from-right-5 duration-300`}
          style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}
        >
          <span className="text-base flex-shrink-0">{ICONS[t.type]}</span>
          <p className="text-sm font-bold leading-tight flex-1">{t.message}</p>
          <button
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            className="text-slate-400 hover:text-slate-600 text-sm flex-shrink-0 ml-1"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
