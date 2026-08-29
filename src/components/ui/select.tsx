"use client";

import { CheckIcon, ChevronDownIcon } from "@shopify/polaris-icons";
import {
  Children,
  forwardRef,
  isValidElement,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

type SelectOption = {
  disabled: boolean;
  label: ReactNode;
  text: string;
  value: string;
};

type ListboxPosition = Pick<CSSProperties, "bottom" | "left" | "maxHeight" | "top" | "width">;

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  return Children.toArray(node).map(textFromNode).join("");
}

function optionsFromChildren(children: ReactNode, inheritedDisabled = false): SelectOption[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode; disabled?: boolean; label?: string; value?: string | number }>(child)) {
      return [];
    }
    if (child.type === "optgroup") {
      return optionsFromChildren(child.props.children, inheritedDisabled || Boolean(child.props.disabled));
    }
    if (child.type !== "option") return [];
    const text = child.props.label ?? textFromNode(child.props.children);
    return [
      {
        disabled: inheritedDisabled || Boolean(child.props.disabled),
        label: child.props.children ?? text,
        text,
        value: child.props.value === undefined ? text : String(child.props.value)
      }
    ];
  });
}

function assignRef(ref: Ref<HTMLSelectElement> | undefined, node: HTMLSelectElement | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

function accessibleLabel(select: HTMLSelectElement | null, fallback?: string) {
  if (!select) return fallback ?? "Select an option";
  const explicit = select.getAttribute("aria-label");
  if (explicit) return explicit;
  const label = select.labels?.[0];
  const directText = label
    ? Array.from(label.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent?.trim())
        .filter(Boolean)
        .join(" ")
    : "";
  if (directText) return directText;
  const labelledContent = label?.querySelector<HTMLElement>(".ui-field-label, .sr-only");
  return labelledContent?.textContent?.trim() || fallback || "Select an option";
}

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { children, className, disabled, multiple, onClick, onKeyDown, onPointerDown, size, ...props },
  forwardedRef
) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const optionIdPrefix = useId();
  const options = optionsFromChildren(children);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<ListboxPosition>({});
  const customEnabled = !multiple && (!size || size <= 1);

  const setSelectRef = useCallback(
    (node: HTMLSelectElement | null) => {
      selectRef.current = node;
      assignRef(forwardedRef, node);
    },
    [forwardedRef]
  );

  const updatePosition = useCallback(() => {
    const select = selectRef.current;
    if (!select) return;
    const rect = select.getBoundingClientRect();
    const viewportPadding = 8;
    const gap = 6;
    const availableWidth = window.innerWidth - viewportPadding * 2;
    const width = Math.min(Math.max(rect.width, 180), availableWidth);
    const left = Math.min(Math.max(rect.left, viewportPadding), window.innerWidth - width - viewportPadding);
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding - gap;
    const spaceAbove = rect.top - viewportPadding - gap;
    const placeAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(112, Math.min(280, placeAbove ? spaceAbove : spaceBelow));
    setPosition({
      bottom: placeAbove ? window.innerHeight - rect.top + gap : undefined,
      left,
      maxHeight,
      top: placeAbove ? undefined : rect.bottom + gap,
      width
    });
  }, []);

  const openListbox = useCallback(() => {
    if (disabled || !customEnabled) return;
    const selectedIndex = Math.max(0, selectRef.current?.selectedIndex ?? 0);
    setActiveIndex(options[selectedIndex]?.disabled ? options.findIndex((option) => !option.disabled) : selectedIndex);
    setOpen(true);
  }, [customEnabled, disabled, options]);

  const closeListbox = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => selectRef.current?.focus());
  }, []);

  const moveActive = useCallback(
    (direction: 1 | -1) => {
      if (!options.length) return;
      let next = activeIndex;
      for (let attempts = 0; attempts < options.length; attempts += 1) {
        next = (next + direction + options.length) % options.length;
        if (!options[next]?.disabled) {
          setActiveIndex(next);
          return;
        }
      }
    },
    [activeIndex, options]
  );

  const selectOption = useCallback(
    (index: number, restoreFocus = true) => {
      const select = selectRef.current;
      const option = options[index];
      if (!select || !option || option.disabled) return;
      select.value = option.value;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
      setActiveIndex(index);
      closeListbox(restoreFocus);
    },
    [closeListbox, options]
  );

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      const target = event.target as Node;
      if (!selectRef.current?.parentElement?.contains(target) && !menuRef.current?.contains(target)) closeListbox();
    }
    function reposition() {
      updatePosition();
    }
    document.addEventListener("pointerdown", dismiss);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [closeListbox, open, updatePosition]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  function handlePointerDown(event: ReactPointerEvent<HTMLSelectElement>) {
    onPointerDown?.(event);
    if (event.defaultPrevented || disabled || !customEnabled || event.button !== 0) return;
    event.preventDefault();
    selectRef.current?.focus();
    if (open) closeListbox();
    else openListbox();
  }

  function handleClick(event: ReactMouseEvent<HTMLSelectElement>) {
    onClick?.(event);
    if (event.defaultPrevented || disabled || !customEnabled) return;
    event.preventDefault();
    if (event.detail === 0 && !open) openListbox();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLSelectElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || !customEnabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) openListbox();
      else moveActive(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      const first = options.findIndex((option) => !option.disabled);
      if (first >= 0) setActiveIndex(first);
    } else if (event.key === "End" && open) {
      event.preventDefault();
      const last = options.map((option) => !option.disabled).lastIndexOf(true);
      if (last >= 0) setActiveIndex(last);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) selectOption(activeIndex);
      else openListbox();
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      closeListbox(true);
    } else if (event.key === "Tab") {
      closeListbox();
    }
  }

  const selectedIndex = selectRef.current?.selectedIndex ?? 0;
  const listboxLabel = accessibleLabel(selectRef.current, props.name);

  return (
    <span className="ui-select-root" data-open={open || undefined}>
      <select
        {...props}
        aria-activedescendant={open ? `${optionIdPrefix}-${activeIndex}` : undefined}
        aria-controls={open ? listboxId : undefined}
        aria-expanded={open}
        className={cn("ui-select", className)}
        disabled={disabled}
        multiple={multiple}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        ref={setSelectRef}
        size={size}
      >
        {children}
      </select>
      {customEnabled ? <ChevronDownIcon aria-hidden="true" className="ui-select-chevron" /> : null}
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              aria-label={listboxLabel}
              className="ui-select-listbox"
              id={listboxId}
              ref={menuRef}
              role="listbox"
              style={position}
            >
              {options.map((option, index) => (
                <button
                  aria-disabled={option.disabled || undefined}
                  aria-selected={selectedIndex === index}
                  className="ui-select-option"
                  data-active={activeIndex === index || undefined}
                  disabled={option.disabled}
                  id={`${optionIdPrefix}-${index}`}
                  key={`${option.value}-${index}`}
                  onClick={() => selectOption(index, false)}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  tabIndex={-1}
                  type="button"
                >
                  <span>{option.label}</span>
                  {selectedIndex === index ? <CheckIcon aria-hidden="true" /> : null}
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </span>
  );
});
