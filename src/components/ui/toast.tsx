"use client";

import { AlertCircleIcon, CheckCircleIcon, InfoIcon, XIcon } from "@shopify/polaris-icons";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { IconButton } from "@/components/ui/icon-button";

type ToastTone = "info" | "success" | "danger";

type ToastInput = {
  action?: { label: string; onClick: () => void };
  description?: ReactNode;
  duration?: number;
  title: ReactNode;
  tone?: ToastTone;
};

type ToastRecord = ToastInput & { id: number };

const ToastContext = createContext<((toast: ToastInput) => number) | null>(null);

function ToastItem({ dismiss, toast }: { dismiss: (id: number) => void; toast: ToastRecord }) {
  const { duration = 5000, id, tone = "info" } = toast;
  useEffect(() => {
    if (duration <= 0) return;
    const timer = window.setTimeout(() => dismiss(id), duration);
    return () => window.clearTimeout(timer);
  }, [dismiss, duration, id]);

  const Icon = tone === "success" ? CheckCircleIcon : tone === "danger" ? AlertCircleIcon : InfoIcon;
  return (
    <section className="ui-toast" data-tone={tone} role={tone === "danger" ? "alert" : "status"}>
      <Icon aria-hidden="true" />
      <span>
        <strong>{toast.title}</strong>
        {toast.description ? <span>{toast.description}</span> : null}
        {toast.action ? (
          <button
            onClick={() => {
              toast.action?.onClick();
              dismiss(id);
            }}
            type="button"
          >
            {toast.action.label}
          </button>
        ) : null}
      </span>
      <IconButton label="Dismiss notification" onClick={() => dismiss(id)} size="small" variant="ghost">
        <XIcon aria-hidden="true" />
      </IconButton>
    </section>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const dismiss = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const notify = useCallback((toast: ToastInput) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-3), { ...toast, id }]);
    return id;
  }, []);
  const contextValue = useMemo(() => notify, [notify]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div aria-label="Notifications" className="ui-toast-viewport">
        {toasts.map((toast) => (
          <ToastItem dismiss={dismiss} key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast must be used inside ToastProvider");
  return notify;
}
