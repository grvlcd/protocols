import Link from "next/link";

interface Props {
  currentPage: number;
  lastPage: number;
  search: string;
  sort: string;
  total?: number;
  perPage?: number;
}

function buildPageWindow(currentPage: number, lastPage: number): (number | "ellipsis")[] {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [];
  const showLeft = currentPage > 3;
  const showRight = currentPage < lastPage - 2;

  pages.push(1);
  if (showLeft) pages.push("ellipsis");
  const start = showLeft ? Math.max(2, currentPage - 1) : 2;
  const end = showRight ? Math.min(lastPage - 1, currentPage + 1) : lastPage - 1;
  for (let p = start; p <= end; p++) {
    if (p !== 1 && p !== lastPage) pages.push(p);
  }
  if (showRight) pages.push("ellipsis");
  if (lastPage > 1) pages.push(lastPage);

  return pages;
}

export function Pagination({
  currentPage,
  lastPage,
  search,
  sort,
  total,
  perPage = 15,
}: Props) {
  if (total !== undefined && total === 0) return null;
  if (lastPage < 1) return null;

  const createHref = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return `/protocols${query ? `?${query}` : ""}`;
  };

  const from = total != null ? (currentPage - 1) * perPage + 1 : null;
  const to = total != null ? Math.min(currentPage * perPage, total) : null;
  const pageWindow = buildPageWindow(currentPage, lastPage);

  const btnClass =
    "inline-flex min-h-8 min-w-8 items-center justify-center rounded-lg border bg-background px-2 py-1 text-xs font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 sm:px-3 sm:text-sm";
  const activeClass = "border-primary bg-primary/10 text-primary pointer-events-none";

  return (
    <nav
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card/80 px-3 py-3 text-xs text-muted-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-2.5 sm:text-sm"
      aria-label="Protocols pagination"
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {from != null && to != null && total != null ? (
          <span>
            Showing{" "}
            <span className="font-medium text-foreground">{from}</span>–
            <span className="font-medium text-foreground">{to}</span> of{" "}
            <span className="font-medium text-foreground">{total}</span>
          </span>
        ) : (
          <span>
            Page{" "}
            <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{lastPage}</span>
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {currentPage === 1 ? (
          <span className={`${btnClass} opacity-60`} aria-disabled="true">
            Previous
          </span>
        ) : (
          <Link href={createHref(currentPage - 1)} className={btnClass} rel="prev">
            Previous
          </Link>
        )}

        <div className="flex items-center gap-1 sm:gap-1.5" role="list">
          {pageWindow.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground" aria-hidden>
                …
              </span>
            ) : (
              <span key={p} role="listitem">
                {p === currentPage ? (
                  <span
                    className={`${btnClass} ${activeClass}`}
                    aria-current="page"
                  >
                    {p}
                  </span>
                ) : (
                  <Link href={createHref(p)} className={btnClass}>
                    {p}
                  </Link>
                )}
              </span>
            ),
          )}
        </div>

        {currentPage === lastPage ? (
          <span className={`${btnClass} opacity-60`} aria-disabled="true">
            Next
          </span>
        ) : (
          <Link href={createHref(currentPage + 1)} className={btnClass} rel="next">
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}
