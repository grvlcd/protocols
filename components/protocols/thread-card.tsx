"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Comment, ThreadSummary } from "@/lib/api";
import { resolveUserVote } from "@/lib/api";
import { VoteButton } from "./vote-button";
import { NewCommentForm } from "./new-comment-form";
import { CommentNode } from "./comment-node";

interface Props {
  thread: ThreadSummary;
  comments: Comment[];
  onCreateComment: (
    threadId: number,
    parentId: number | null,
    body: string,
  ) => void;
  onVoteThread: (threadId: number, value: 1 | -1) => void;
  onVoteComment: (commentId: number, value: 1 | -1) => void;
  onDeleteThread: (threadId: number) => void;
  onDeleteComment: (threadId: number, commentId: number) => void;
  isAuthenticated: boolean;
  currentUserId?: number;
  votingId: string | null;
  commentFormKey: number;
}

export function ThreadCard({
  thread,
  comments,
  onCreateComment,
  onVoteThread,
  onVoteComment,
  onDeleteThread,
  onDeleteComment,
  isAuthenticated,
  currentUserId,
  votingId,
  commentFormKey,
}: Props) {
  const isOwner = currentUserId !== undefined && thread.user_id === currentUserId;
  const resolvedUserVote = resolveUserVote(
    thread.user_vote,
    thread.upvoted_by_user_ids,
    thread.downvoted_by_user_ids,
    currentUserId,
  );

  return (
    <Card className="nested-card nested-depth-0 bg-card transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex w-full items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle>{thread.title}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {thread.body}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteThread(thread.id)}
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                title="Delete thread"
              >
                ×
              </Button>
            )}
            <VoteButton
              votes={Number(thread.votes_sum ?? 0)}
              userVote={resolvedUserVote}
              onVote={(value) => onVoteThread(thread.id, value)}
              disabled={!isAuthenticated}
              loading={votingId === `thread-${thread.id}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-[0.7rem] text-muted-foreground sm:text-xs">
          Started by{" "}
          <span className="font-medium text-foreground">
            {thread.author?.name ?? "Unknown"}
          </span>
        </p>
        <NewCommentForm
          key={commentFormKey}
          onSubmit={(body) => onCreateComment(thread.id, null, body)}
          isAuthenticated={isAuthenticated}
          placeholder="Reply to this thread..."
        />
        {comments.length > 0 && (
          <div className="mt-3 space-y-2">
            {comments.map((comment) => (
              <CommentNode
                key={comment.id}
                comment={comment}
                depth={0}
                threadId={thread.id}
                onReply={(body) =>
                  onCreateComment(thread.id, comment.id, body)
                }
                onVote={onVoteComment}
                onDelete={(commentId) => onDeleteComment(thread.id, commentId)}
                isAuthenticated={isAuthenticated}
                currentUserId={currentUserId}
                votingId={votingId}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
