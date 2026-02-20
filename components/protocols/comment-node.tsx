"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Comment } from "@/lib/api";
import { VoteButton } from "./vote-button";

interface Props {
  comment: Comment;
  depth: number;
  threadId: number;
  onReply: (body: string) => void;
  onVote: (commentId: number, value: 1 | -1) => void;
  onDelete: (commentId: number) => void;
  isAuthenticated: boolean;
  currentUserId?: number;
  votingId: string | null;
}

export function CommentNode({
  comment,
  depth,
  threadId,
  onReply,
  onVote,
  onDelete,
  isAuthenticated,
  currentUserId,
  votingId,
}: Props) {
  const indent = Math.min(depth, 3);
  const isOwner = currentUserId !== undefined && comment.user_id === currentUserId;

  async function handleReply(formData: FormData) {
    const body = (formData.get("body") as string) ?? "";
    onReply(body);
  }

  const depthLevel = Math.min(depth, 4);

  return (
    <div className="relative animate-in-fade">
      <div
        className={`nested-card nested-depth-${depthLevel} flex gap-2 rounded-xl border border-border p-2 text-xs sm:p-2.5 sm:text-[0.8rem]`}
        style={{ marginLeft: indent * 20 }}
      >
        <div className="flex-1">
          <div className="mb-0.5 flex items-center justify-between gap-2">
            <span className="font-medium text-foreground">
              {comment.author?.name ?? "User"}
            </span>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment.id)}
                className="h-5 px-1.5 text-[0.65rem] text-destructive hover:text-destructive"
                title="Delete comment"
              >
                ×
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">{comment.body}</p>
          {isAuthenticated && (
            <form
              action={handleReply}
              className="mt-1 flex items-center gap-1.5"
            >
              <Input
                name="body"
                placeholder="Reply..."
                className="h-7 text-[0.7rem]"
              />
              <Button type="submit" size="sm" variant="ghost" className="h-7 px-2">
                Reply
              </Button>
            </form>
          )}
        </div>
        <VoteButton
          votes={Number(comment.votes_sum ?? 0)}
          userVote={comment.user_vote ?? null}
          onVote={(value) => onVote(comment.id, value)}
          disabled={!isAuthenticated}
          loading={votingId === `comment-${comment.id}`}
          size="sm"
        />
      </div>
      {comment.children &&
        comment.children.map((child) => (
          <div key={child.id} className="mt-2">
            <CommentNode
              comment={child}
              depth={depth + 1}
              threadId={threadId}
              onReply={onReply}
              onVote={onVote}
              onDelete={onDelete}
              isAuthenticated={isAuthenticated}
              currentUserId={currentUserId}
              votingId={votingId}
            />
          </div>
        ))}
    </div>
  );
}
