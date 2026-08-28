import type { Key, ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

export type DataTableColumn<Row> = {
  align?: "start" | "center" | "end";
  cell: (row: Row) => ReactNode;
  header: ReactNode;
  id: string;
  width?: string;
};

export function DataTable<Row>({
  caption,
  className,
  columns,
  emptyAction,
  emptyDescription = "Try changing your search or filters.",
  emptyTitle = "No results",
  getRowKey,
  onRowSelect,
  rows
}: {
  caption: string;
  className?: string;
  columns: DataTableColumn<Row>[];
  emptyAction?: ReactNode;
  emptyDescription?: ReactNode;
  emptyTitle?: ReactNode;
  getRowKey: (row: Row) => Key;
  onRowSelect?: (row: Row) => void;
  rows: Row[];
}) {
  if (!rows.length) {
    return <EmptyState action={emptyAction} description={emptyDescription} title={emptyTitle} />;
  }

  return (
    <div className={cn("ui-table-scroll", className)}>
      <table className="ui-data-table">
        <caption className="ui-sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th data-align={column.align} key={column.id} scope="col" style={{ width: column.width }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className={onRowSelect ? "ui-data-table-actionable" : undefined}
              key={getRowKey(row)}
              onClick={onRowSelect ? () => onRowSelect(row) : undefined}
              onKeyDown={
                onRowSelect
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRowSelect(row);
                      }
                    }
                  : undefined
              }
              tabIndex={onRowSelect ? 0 : undefined}
            >
              {columns.map((column) => (
                <td data-align={column.align} key={column.id}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
