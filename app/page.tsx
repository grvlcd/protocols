import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent animate-in-fade"
        aria-hidden
      />
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-10 pt-6 md:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4 border-b-2 border-primary/30 pb-6 animate-in" style={{ animationDelay: "0.05s" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Protocol Explorer
            </p>
            <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Collaborative Protocols & Discussion Hub
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base leading-relaxed">
              Browse scientific protocols, dive into discussion threads, and share insights with researchers and students.
            </p>
          </div>
        </header>

        <section className="flex-1">
          <div className="animate-in rounded-2xl border-2 border-primary/20 bg-card p-5 shadow-md shadow-primary/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 md:p-6" style={{ animationDelay: "0.15s" }}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Start Exploring
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Search protocols, filter by activity, and jump into live discussions.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                href="/protocols"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:w-auto"
              >
                Browse protocols
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Search by title, sort by recency, reviews, and rating, and open protocol pages with full threads and comments.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
