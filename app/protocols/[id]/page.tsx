import { notFound } from "next/navigation";
import {
  getProtocol,
  getThreadComments,
  groupCommentsByParent,
} from "@/lib/protocols";
import { ProtocolDiscussion } from "@/components/protocols/protocol-discussion";
import { ProtocolHeader } from "@/components/protocols/protocol-header";
import { ProtocolContent } from "@/components/protocols/protocol-content";
import { ProtocolReviews } from "@/components/protocols/protocol-reviews";

export default async function ProtocolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const protocol = await getProtocol(id);

  if (!protocol) {
    notFound();
  }

  const threadComments = await Promise.all(
    protocol.threads.map(async (thread) => ({
      threadId: thread.id,
      comments: groupCommentsByParent(await getThreadComments(thread.id)),
    })),
  );

  const initialThreadsWithComments = protocol.threads.map((thread) => ({
    thread,
    comments:
      threadComments.find((entry) => entry.threadId === thread.id)?.comments ??
      [],
  }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-10 pt-4 md:px-6 lg:px-8">
        <ProtocolHeader protocol={protocol} />
        <ProtocolContent content={protocol.content} />
        <ProtocolReviews reviews={protocol.reviews} />
        <ProtocolDiscussion
          protocol={protocol}
          initialThreadsWithComments={initialThreadsWithComments}
        />
      </div>
    </main>
  );
}
