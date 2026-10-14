export default function Loading() {
  return (
    <div aria-label="Loading" aria-live="polite" className="loading-grid">
      <div className="skeleton skeleton-heading" />
      <div className="grid-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="skeleton skeleton-card" key={index} />
        ))}
      </div>
    </div>
  );
}
