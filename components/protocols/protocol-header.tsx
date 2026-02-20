import type { ProtocolDetail } from "@/lib/api";

interface Props {
  protocol: ProtocolDetail;
}

export function ProtocolHeader({ protocol }: Props) {
  return (
    <header className="animate-in mb-5 border-b border-border pb-4 [animation-delay:0.05s] [animation-fill-mode:both]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        Protocol
      </p>
      <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
        {protocol.title}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
        <span>
          By{" "}
          <span className="font-medium text-foreground">
            {protocol.author?.name ?? "Unknown"}
          </span>
        </span>
        <span>Threads: {protocol.threads.length}</span>
        <span>Reviews: {protocol.reviews.length}</span>
        {protocol.reviews_avg_rating != null &&
          !Number.isNaN(Number(protocol.reviews_avg_rating)) && (
            <span>
              Rating:{" "}
              <span className="font-semibold text-foreground">
                {Number(protocol.reviews_avg_rating).toFixed(1)}
              </span>
            </span>
          )}
      </div>
      {Array.isArray(protocol.tags) && protocol.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {protocol.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded-full bg-muted px-2 py-0.5 text-[0.68rem] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
