interface Props {
  content: string;
}

export function ProtocolContent({ content }: Props) {
  return (
    <section className="animate-in mb-6 rounded-2xl border border-border bg-card/80 p-3 text-sm leading-relaxed text-foreground shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md sm:p-4 [animation-delay:0.1s] [animation-fill-mode:both]">
      {content}
    </section>
  );
}
