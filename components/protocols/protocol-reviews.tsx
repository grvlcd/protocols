import type { ProtocolDetail } from "@/lib/api";

interface Props {
  reviews: ProtocolDetail["reviews"];
}

export function ProtocolReviews({ reviews }: Props) {
  return (
    <section className="animate-in mb-6 rounded-2xl border border-border bg-card/80 p-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md sm:p-4 [animation-delay:0.15s] [animation-fill-mode:both]">
      <h2 className="text-sm font-semibold tracking-tight sm:text-base">
        Reviews
      </h2>
      {reviews.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          No reviews yet. Be the first to share feedback on this protocol.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-border bg-muted/50 p-2.5 text-xs shadow-sm sm:p-3 sm:text-sm"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-medium">
                  {review.author?.name ?? "Anonymous"}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-semibold text-primary">
                  {Number(review.rating).toFixed(1)}
                </span>
              </div>
              {review.body && (
                <p className="text-muted-foreground">{review.body}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
