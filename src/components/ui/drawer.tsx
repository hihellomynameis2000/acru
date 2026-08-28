"use client";

import { XIcon } from "@shopify/polaris-icons";
import type { ReactNode } from "react";
import { useId, useRef } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";

import { useFocusTrap } from "./use-focus-trap";

export function Drawer({
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
      className="ui-drawer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      role="presentation"
    >
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn("ui-drawer", className)}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="ui-drawer-header">
          <span>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </span>
          <IconButton label="Close drawer" onClick={close} variant="ghost">
            <XIcon aria-hidden="true" />
          </IconButton>
        </header>
        <div className="ui-drawer-body">{children}</div>
        {footer ? <footer className="ui-drawer-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
