"use client";

import { ChevronDownIcon } from "@shopify/polaris-icons";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export function Popover({
  align = "start",
  children,
  className,
  disabled,
  label,
  onOpenChange,
  open: controlledOpen,
  showChevron = true
}: {
  align?: "start" | "end";
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  label: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  showChevron?: boolean;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  function setOpen(next: boolean) {
    onOpenChange?.(next);
    if (controlledOpen === undefined) setUncontrolledOpen(next);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>(".ui-popover-trigger")?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  return (
    <div className={cn("ui-popover-root", className)} ref={rootRef}>
      <button
        aria-controls={id}
        aria-expanded={open}
        className="ui-popover-trigger"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span>{label}</span>
        {showChevron ? <ChevronDownIcon aria-hidden="true" /> : null}
      </button>
      {open ? (
        <div className="ui-popover-content" data-align={align} id={id} role="dialog">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export type MenuItem = {
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: ReactNode;
  onSelect: () => void;
  tone?: "default" | "danger";
};

export function Menu({ align, items, label }: { align?: "start" | "end"; items: MenuItem[]; label: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function select(item: MenuItem) {
    if (item.disabled) return;
    item.onSelect();
    setOpen(false);
  }

  return (
    <Popover align={align} label={label} onOpenChange={setOpen} open={open}>
      <div
        aria-label={typeof label === "string" ? label : "Actions"}
        className="ui-menu"
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const direction = event.key === "ArrowDown" ? 1 : -1;
            const enabled = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
            const current = enabled.findIndex(({ index }) => index === activeIndex);
            const next = enabled[(current + direction + enabled.length) % enabled.length];
            if (next) setActiveIndex(next.index);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const item = items[activeIndex];
            if (item) select(item);
          }
        }}
        role="menu"
      >
        {items.map((item, index) => (
          <button
            aria-disabled={item.disabled || undefined}
            className="ui-menu-item"
            data-active={activeIndex === index}
            data-tone={item.tone}
            disabled={item.disabled}
            key={item.id}
            onFocus={() => setActiveIndex(index)}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => select(item)}
            role="menuitem"
            tabIndex={activeIndex === index ? 0 : -1}
            type="button"
          >
            {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </Popover>
  );
}
