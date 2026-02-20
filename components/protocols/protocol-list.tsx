import type { ProtocolSummary } from "@/lib/api";
import { ProtocolListItem } from "./protocol-list-item";

interface Props {
  protocols: ProtocolSummary[];
}

export function ProtocolList({ protocols }: Props) {
  if (protocols.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No protocols found. Try adjusting your search or filters.
      </p>
    );
  }

  return (
    <ul className="stagger-children divide-y">
      {protocols.map((protocol) => (
        <ProtocolListItem key={protocol.id} protocol={protocol} />
      ))}
    </ul>
  );
}
