"use client";

type PageToken = number | "start-ellipsis" | "end-ellipsis";

export function pageTokens(page: number, totalPages: number): PageToken[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  if (page >= totalPages - 3) {
    return [1, "start-ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "start-ellipsis", page - 1, page, page + 1, "end-ellipsis", totalPages];
}

export function TablePagination({
  className,
  page,
  pageSize,
  totalItems,
  onPageChange
}: {
  className?: string;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  function changePage(nextPage: number) {
    onPageChange(Math.min(Math.max(1, nextPage), totalPages));
  }

  return (
    <footer className={className ?? "ui-table-pagination"} aria-label="Table pagination">
      <span>
        Showing {start}–{end} of {totalItems.toLocaleString()}
      </span>
      <div>
        <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
          Previous
        </button>
        {pageTokens(currentPage, totalPages).map((token) =>
          typeof token === "number" ? (
            <button
              aria-current={token === currentPage ? "page" : undefined}
              className={token === currentPage ? "active" : undefined}
              key={token}
              onClick={() => changePage(token)}
              type="button"
            >
              {token}
            </button>
          ) : (
            <span aria-hidden="true" className="table-pagination-ellipsis" key={token}>
              …
            </span>
          )
        )}
        <button type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
          Next
        </button>
      </div>
    </footer>
  );
}
