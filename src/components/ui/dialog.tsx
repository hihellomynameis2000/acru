"use client";

import { XIcon } from "@shopify/polaris-icons";
import type { ReactNode } from "react";
import { useId, useRef } from "react";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";

import { useFocusTrap } from "./use-focus-trap";

export function Dialog({
  children,
  className,
  description,
  footer,
  onOpenChange,
  open,
  title
}: {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  footer?: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: ReactNode;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const close = () => onOpenChange(false);
  useFocusTrap(panelRef, open, close);

  if (!open) return null;

  return (
    <div
      className="ui-layer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      role="presentation"
    >
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn("ui-dialog", className)}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="ui-dialog-header">
          <span>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </span>
          <IconButton label="Close dialog" onClick={close} variant="ghost">
            <XIcon aria-hidden="true" />
          </IconButton>
        </header>
        <div className="ui-dialog-body">{children}</div>
        {footer ? <footer className="ui-dialog-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}

export function ConfirmationDialog({
  confirmLabel = "Confirm",
  description,
  loading,
  onConfirm,
  onOpenChange,
  open,
  title,
  tone = "default"
}: {
  confirmLabel?: string;
  description: ReactNode;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <Dialog
      description={description}
      footer={
        <>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button loading={loading} onClick={onConfirm} variant={tone === "danger" ? "danger" : "primary"}>
            {confirmLabel}
          </Button>
        </>
      }
      onOpenChange={onOpenChange}
      open={open}
      title={title}
    >
      <span className={cn("ui-confirmation-mark", tone === "danger" && "ui-confirmation-mark-danger")} />
    </Dialog>
  );
}
