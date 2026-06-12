"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timers = toasts.map((t) => {
      if (t.duration === Infinity) return null;
      return setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== t.id));
      }, t.duration || 5000);
    });

    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [toasts]);

  function pushToast({ title, description, action }) {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((s) => [...s, { id, title, description, action, duration: 5000 }]);
    return id;
  }

  function removeToast(id) {
    setToasts((s) => s.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ pushToast, removeToast }}>
      {children}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div key={t.id} className="glass-panel rounded-md p-3 shadow-lg w-80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{t.title}</p>
                {t.description ? <p className="text-sm text-muted mt-1">{t.description}</p> : null}
              </div>
              {t.action ? (
                <div className="ml-2 flex items-center gap-2">
                  <button
                    className="text-sm text-accent underline"
                    onClick={() => {
                      try {
                        t.action.onClick();
                      } finally {
                        removeToast(t.id);
                      }
                    }}>
                    {t.action.label}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
