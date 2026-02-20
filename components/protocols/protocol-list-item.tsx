import Link from "next/link";
import type { ProtocolSummary } from "@/lib/api";

interface Props {
  protocol: ProtocolSummary;
}

export function ProtocolListItem({ protocol }: Props) {
  return (
    <li className="py-3 first:pt-0 last:pb-0 sm:py-4">
      <Link
        href={`/protocols/${protocol.id}`}
        className="group flex flex-col gap-2 rounded-xl px-2 py-1 transition-all duration-200 hover:bg-muted/50 hover:shadow-sm hover:-translate-y-0.5 sm:px-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight sm:text-base">
            {protocol.title}
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-[0.78rem]">
            <span>
              Threads:{" "}
              <span className="font-medium text-foreground">
                {protocol.threads_count}
              </span>
            </span>
            <span>
              Reviews:{" "}
              <span className="font-medium text-foreground">
                {protocol.reviews_count}
              </span>
            </span>
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
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
          {protocol.content}
        </p>

        {Array.isArray(protocol.tags) && protocol.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
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
      </Link>
    </li>
  );
}
