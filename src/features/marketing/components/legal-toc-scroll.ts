type LegalTocGeometry = {
  viewportTop: number;
  viewportHeight: number;
  scrollTop: number;
  scrollHeight: number;
  itemTop: number;
  itemHeight: number;
};

// Return the smallest sidebar-only adjustment that reveals the active link.
// Coordinates are viewport-relative so wrapped labels and sticky positioning work.
export function legalTocScrollTop({
  viewportTop,
  viewportHeight,
  scrollTop,
  scrollHeight,
  itemTop,
  itemHeight
}: LegalTocGeometry): number | null {
  if (viewportHeight <= 0 || itemHeight <= 0 || scrollHeight <= viewportHeight) return null;

  const inset = Math.min(12, viewportHeight / 4);
  const visibleTop = viewportTop + inset;
  const visibleBottom = viewportTop + viewportHeight - inset;
  const itemBottom = itemTop + itemHeight;
  let delta = 0;

  if (itemHeight > visibleBottom - visibleTop || itemTop < visibleTop) {
    delta = itemTop - visibleTop;
  } else if (itemBottom > visibleBottom) {
    delta = itemBottom - visibleBottom;
  }

  const target = Math.max(0, Math.min(scrollHeight - viewportHeight, scrollTop + delta));
  return Math.abs(target - scrollTop) < 1 ? null : target;
}
