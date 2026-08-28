"use client";

import { CalendarIcon } from "@shopify/polaris-icons";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Popover } from "@/components/ui/popover";

export type DateRange = { end: string; start: string };

export function isValidDateRange(range: DateRange) {
  if (!range.start || !range.end) return false;
  const start = Date.parse(`${range.start}T12:00:00`);
  const end = Date.parse(`${range.end}T12:00:00`);
  return Number.isFinite(start) && Number.isFinite(end) && start <= end;
}

export function formatDateRange(range: DateRange, locale = "en-US") {
  if (!isValidDateRange(range)) return "Choose dates";
  const formatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
  return `${formatter.format(new Date(`${range.start}T12:00:00`))} – ${formatter.format(new Date(`${range.end}T12:00:00`))}`;
}

export function DateRangeFilter({
  label = "Date range",
  max,
  min,
  onApply,
  value
}: {
  label?: string;
  max?: string;
  min?: string;
  onApply: (range: DateRange) => void;
  value: DateRange;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const valid = isValidDateRange(draft);

  return (
    <Popover
      className="ui-date-range"
      label={
        <>
          <CalendarIcon aria-hidden="true" />
          <span>{formatDateRange(value)}</span>
        </>
      }
      onOpenChange={(nextOpen) => {
        if (nextOpen) setDraft(value);
        setOpen(nextOpen);
      }}
      open={open}
    >
      <div className="ui-date-range-content">
        <strong>{label}</strong>
        <div>
          <Field label="Start date">
            <Input
              aria-invalid={!valid}
              max={draft.end || max}
              min={min}
              onChange={(event) => setDraft((current) => ({ ...current, start: event.target.value }))}
              type="date"
              value={draft.start}
            />
          </Field>
          <Field
            label="End date"
            error={!valid && draft.start && draft.end ? "End date must be after start date." : undefined}
          >
            <Input
              aria-invalid={!valid}
              max={max}
              min={draft.start || min}
              onChange={(event) => setDraft((current) => ({ ...current, end: event.target.value }))}
              type="date"
              value={draft.end}
            />
          </Field>
        </div>
        <footer>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={!valid}
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
            variant="primary"
          >
            Apply
          </Button>
        </footer>
      </div>
    </Popover>
  );
}
