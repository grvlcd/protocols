import { getProtocols } from "@/lib/protocols";
import { ProtocolsSearchFilters } from "@/components/protocols/protocols-search-filters";
import { ProtocolList } from "@/components/protocols/protocol-list";
import { Pagination } from "@/components/protocols/pagination";

interface SearchParams {
  search?: string;
  sort?: string;
  page?: string;
}

export default async function ProtocolsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const sort = params.sort ?? "recent";
  const page = params.page ? Number(params.page) || 1 : 1;

  const protocols = await getProtocols(search, sort, page);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-4 md:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Protocols
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and search protocols. Use filters to find the most active
              and highest-rated content.
            </p>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-4 md:gap-6">
          <ProtocolsSearchFilters initialSearch={search} initialSort={sort} />

          <div className="rounded-2xl border border-border bg-card/80 p-3 shadow-sm backdrop-blur-sm sm:p-4">
            <ProtocolList protocols={protocols.data} />
          </div>

          <Pagination
            currentPage={protocols.current_page}
            lastPage={protocols.last_page}
            search={search}
            sort={sort}
            total={protocols.total}
            perPage={protocols.per_page}
          />
        </section>
      </div>
    </main>
  );
}

