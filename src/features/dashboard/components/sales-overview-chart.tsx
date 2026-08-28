"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { dailySales } from "@/features/dashboard/data/dashboard";

const WIDTH = 740;
const HEIGHT = 220;
const TOP = 10;
const MAX_VALUE = 200_000;

type Point = { x: number; y: number };
type HoverState = { x: number; y: number; value: number; date: string };
type SalesOverviewChartProps = {
  days?: number;
  startDate?: string;
  endDate?: string;
  compare?: boolean;
};

function cubic(start: number, first: number, second: number, end: number, t: number) {
  const inverse = 1 - t;
  return inverse ** 3 * start + 3 * inverse ** 2 * t * first + 3 * inverse * t ** 2 * second + t ** 3 * end;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function shortDate(value: Date) {
  return value.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SalesOverviewChart({
  days = 7,
  startDate = "2026-08-04",
  endDate = "2026-08-10",
  compare = false
}: SalesOverviewChartProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const queuedX = useRef<number | null>(null);
  const dragging = useRef(false);
  const [hover, setHover] = useState<HoverState | null>(null);

  const values = useMemo(() => {
    const count = Math.max(2, Math.min(days, 60));
    return Array.from({ length: count }, (_, index) => {
      const sourcePosition = (index / (count - 1)) * (dailySales.length - 1);
      const before = Math.floor(sourcePosition);
      const after = Math.min(dailySales.length - 1, Math.ceil(sourcePosition));
      const mix = sourcePosition - before;
      return dailySales[before] + (dailySales[after] - dailySales[before]) * mix;
    });
  }, [days]);

  const axisDates = useMemo(() => {
    const start = new Date(`${startDate}T12:00:00`);
    const end = new Date(`${endDate}T12:00:00`);
    const count = Math.min(8, Math.max(2, days));
    return Array.from({ length: count }, (_, index) => {
      const progress = index / (count - 1);
      return shortDate(new Date(start.getTime() + (end.getTime() - start.getTime()) * progress));
    });
  }, [days, endDate, startDate]);

  const chart = useMemo(() => {
    const points: Point[] = values.map((value, index) => ({
      x: (index / (values.length - 1)) * WIDTH,
      y: HEIGHT - (value / MAX_VALUE) * (HEIGHT - TOP)
    }));
    const controls = points.slice(0, -1).map((point, index) => {
      const before = points[index - 1] ?? point;
      const after = points[index + 1];
      const next = points[index + 2] ?? after;
      return {
        first: { x: point.x + (after.x - before.x) / 6, y: point.y + (after.y - before.y) / 6 },
        second: { x: after.x - (next.x - point.x) / 6, y: after.y - (next.y - point.y) / 6 }
      };
    });
    const linePath = points.slice(1).reduce((path, point, index) => {
      const control = controls[index];
      return `${path} C ${control.first.x} ${control.first.y}, ${control.second.x} ${control.second.y}, ${point.x} ${point.y}`;
    }, `M ${points[0].x} ${points[0].y}`);
    return { points, controls, linePath, areaPath: `${linePath} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z` };
  }, [values]);

  const updateHover = useCallback(
    (clientX: number) => {
      const rect = plotRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(0, Math.min(WIDTH, ((clientX - rect.left) / rect.width) * WIDTH));
      const progress = (x / WIDTH) * (chart.points.length - 1);
      const segment = Math.min(chart.points.length - 2, Math.floor(progress));
      const t = progress - segment;
      const start = chart.points[segment];
      const end = chart.points[segment + 1];
      const control = chart.controls[segment];
      const y = cubic(start.y, control.first.y, control.second.y, end.y, t);
      const rangeStart = new Date(`${startDate}T12:00:00`);
      const rangeEnd = new Date(`${endDate}T12:00:00`);
      const date = shortDate(
        new Date(rangeStart.getTime() + (rangeEnd.getTime() - rangeStart.getTime()) * (x / WIDTH))
      );
      setHover({ x, y, value: ((HEIGHT - y) / (HEIGHT - TOP)) * MAX_VALUE, date });
    },
    [chart, endDate, startDate]
  );

  const scheduleHover = useCallback(
    (clientX: number) => {
      queuedX.current = clientX;
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        if (queuedX.current !== null) updateHover(queuedX.current);
        frameRef.current = null;
      });
    },
    [updateHover]
  );

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  return (
    <div className="sales-chart-layout">
      <div className="sales-y-axis" aria-hidden="true">
        <span>$200K</span>
        <span>$150K</span>
        <span>$100K</span>
        <span>$50K</span>
        <span>$0</span>
      </div>
      <div
        className="sales-plot"
        ref={plotRef}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          scheduleHover(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.pointerType === "mouse" || dragging.current) scheduleHover(event.clientX);
        }}
        onPointerUp={(event) => {
          dragging.current = false;
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        onPointerLeave={() => {
          if (!dragging.current) setHover(null);
        }}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Interactive daily sales chart from May 1 through June 5"
        >
          <defs>
            <linearGradient id="sales-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#46a8df" stopOpacity=".28" />
              <stop offset="1" stopColor="#46a8df" stopOpacity=".02" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              x2={WIDTH}
              y1={TOP + ratio * (HEIGHT - TOP)}
              y2={TOP + ratio * (HEIGHT - TOP)}
              stroke="#3b3a3a"
            />
          ))}
          {compare ? (
            <path
              d={chart.linePath}
              transform="translate(0 12)"
              fill="none"
              stroke="#8b9296"
              strokeDasharray="6 6"
              strokeOpacity=".65"
              strokeWidth="1.5"
            />
          ) : null}
          <path d={chart.areaPath} fill="url(#sales-fill)" />
          <path
            d={chart.linePath}
            fill="none"
            stroke="#43a6df"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          {hover ? (
            <>
              <line className="chart-crosshair" x1={hover.x} x2={hover.x} y1="0" y2={HEIGHT} />
            </>
          ) : null}
        </svg>
        {hover ? (
          <>
            <span
              className="chart-focus-point"
              style={{ left: `${(hover.x / WIDTH) * 100}%`, top: `${hover.y}px` }}
              aria-hidden="true"
            />
            <div
              className="sales-tooltip"
              data-side={hover.x > WIDTH * 0.78 ? "left" : hover.x < WIDTH * 0.18 ? "right" : "center"}
              style={{ left: `${(hover.x / WIDTH) * 100}%`, top: `${hover.y}px` }}
              role="status"
            >
              <small>{hover.date}</small>
              <strong>{formatMoney(hover.value)}</strong>
            </div>
          </>
        ) : null}
        <div className="sales-x-axis" aria-hidden="true">
          {axisDates.map((date, index) => (
            <span key={`${date}-${index}`}>{date}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
