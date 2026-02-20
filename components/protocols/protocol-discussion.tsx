"use client";

import { useState, useRef, useEffect } from "react";
import type { Comment, ProtocolDetail, ThreadSummary } from "@/lib/api";
import { postJson, deleteThread, deleteComment } from "@/lib/api";
import { useAuth } from "@/components/auth/auth-provider";
import { getProtocol, getThreadComments, groupCommentsByParent } from "@/lib/protocols";
import { NewThreadForm } from "./new-thread-form";
import { ThreadCard } from "./thread-card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  insertComment,
  replaceComment,
  removeComment,
  findComment,
  updateCommentVoteState,
  updateCommentVoteFromResponse,
  revertCommentVote,
} from "./utils/comment-utils";

interface ThreadWithComments {
  thread: ThreadSummary;
  comments: Comment[];
}

interface Props {
  protocol: ProtocolDetail;
  initialThreadsWithComments: ThreadWithComments[];
}

export function ProtocolDiscussion({
  protocol,
  initialThreadsWithComments,
}: Props) {
  const { isAuthenticated, user } = useAuth();
  const [threads, setThreads] = useState<ThreadWithComments[]>(
    initialThreadsWithComments,
  );
  const [threadLoading, setThreadLoading] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [commentFormKeys, setCommentFormKeys] = useState<Record<number, number>>({});
  const threadFormRef = useRef<HTMLFormElement>(null);
  const [deleteThreadDialog, setDeleteThreadDialog] = useState<{
    open: boolean;
    threadId: number | null;
  }>({ open: false, threadId: null });
  const [deleteCommentDialog, setDeleteCommentDialog] = useState<{
    open: boolean;
    threadId: number | null;
    commentId: number | null;
  }>({ open: false, threadId: null, commentId: null });
  const userHasVotedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !protocol?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const protocolWithVotes = await getProtocol(String(protocol.id));
        if (cancelled || !protocolWithVotes?.threads) return;
        if (userHasVotedRef.current) return;
        const threadComments = await Promise.all(
          protocolWithVotes.threads.map(async (thread) => ({
            threadId: thread.id,
            comments: groupCommentsByParent(await getThreadComments(thread.id)),
          })),
        );
        if (cancelled || userHasVotedRef.current) return;
        const next: ThreadWithComments[] = protocolWithVotes.threads.map(
          (thread) => ({
            thread,
            comments:
              threadComments.find((e) => e.threadId === thread.id)?.comments ??
              [],
          }),
        );
        setThreads(next);
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, protocol?.id]);

  async function handleCreateThread(formData: FormData) {
    const title = (formData.get("title") as string)?.trim();
    const body = (formData.get("body") as string)?.trim();

    if (!title || !body || !isAuthenticated) return;

    setThreadLoading(true);
    const optimisticThread: ThreadSummary = {
      id: -Date.now(),
      title,
      body,
      protocol_id: protocol.id,
      user_id: protocol.author?.id ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      comments_count: 0,
      votes_sum: 0,
      author: protocol.author,
    };

    setThreads((prev) => [{ thread: optimisticThread, comments: [] }, ...prev]);
    threadFormRef.current?.reset();

    try {
      const created = await postJson<ThreadSummary>("/threads", {
        title,
        body,
        protocol_id: protocol.id,
      });

      setThreads((prev) =>
        prev.map((entry) =>
          entry.thread.id === optimisticThread.id
            ? { ...entry, thread: { ...entry.thread, ...created } }
            : entry,
        ),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to create thread", error);
      setThreads((prev) =>
        prev.filter((entry) => entry.thread.id !== optimisticThread.id),
      );
    } finally {
      setThreadLoading(false);
    }
  }

  async function handleCreateComment(
    threadId: number,
    parentId: number | null,
    body: string,
  ) {
    if (!body.trim() || !isAuthenticated) return;

    const optimisticComment: Comment = {
      id: -Date.now(),
      body,
      user_id: 0,
      thread_id: threadId,
      parent_id: parentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes_sum: 0,
    };

    setThreads((prev) =>
      prev.map((entry) =>
        entry.thread.id === threadId
          ? {
            ...entry,
            comments: insertComment(entry.comments, optimisticComment),
          }
          : entry,
      ),
    );

    try {
      const created = await postJson<Comment>("/comments", {
        body,
        thread_id: threadId,
        parent_id: parentId,
      });

      setThreads((prev) =>
        prev.map((entry) =>
          entry.thread.id === threadId
            ? {
              ...entry,
              comments: replaceComment(entry.comments, optimisticComment.id, {
                ...optimisticComment,
                ...created,
              }),
            }
            : entry,
        ),
      );
      setCommentFormKeys((prev) => ({
        ...prev,
        [threadId]: (prev[threadId] ?? 0) + 1,
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to create comment", error);
      setThreads((prev) =>
        prev.map((entry) =>
          entry.thread.id === threadId
            ? {
              ...entry,
              comments: removeComment(entry.comments, optimisticComment.id),
            }
            : entry,
        ),
      );
    }
  }

  async function handleVoteThread(threadId: number, value: 1 | -1) {
    if (!isAuthenticated) return;
    const key = `thread-${threadId}`;
    setVotingId(key);

    const currentEntry = threads.find((entry) => entry.thread.id === threadId);
    const currentVote = currentEntry?.thread.user_vote ?? null;
    const isTogglingOff = currentVote === value;

    setThreads((prev) =>
      prev.map((entry) =>
        entry.thread.id === threadId
          ? {
            ...entry,
            thread: {
              ...entry.thread,
              votes_sum: isTogglingOff
                ? Number(entry.thread.votes_sum ?? 0) - value
                : currentVote
                  ? Number(entry.thread.votes_sum ?? 0) - currentVote + value
                  : Number(entry.thread.votes_sum ?? 0) + value,
              user_vote: isTogglingOff ? null : value,
            },
          }
          : entry,
      ),
    );

    try {
      const response = await postJson<{
        value?: number | null;
        votes_sum?: number;
      }>(`/threads/${threadId}/vote`, { value });
      const newUserVote =
        response.value !== undefined ? response.value : isTogglingOff ? null : value;
      const newVotesSum =
        response.votes_sum !== undefined
          ? response.votes_sum
          : isTogglingOff
            ? Number(currentEntry?.thread.votes_sum ?? 0) - value
            : currentVote
              ? Number(currentEntry?.thread.votes_sum ?? 0) - currentVote + value
              : Number(currentEntry?.thread.votes_sum ?? 0) + value;
      userHasVotedRef.current = true;
      setThreads((prev) =>
        prev.map((entry) =>
          entry.thread.id === threadId
            ? {
              ...entry,
              thread: {
                ...entry.thread,
                user_vote: newUserVote,
                votes_sum: newVotesSum,
              },
            }
            : entry,
        ),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to vote on thread", error);
      setThreads((prev) =>
        prev.map((entry) =>
          entry.thread.id === threadId
            ? {
              ...entry,
              thread: {
                ...entry.thread,
                votes_sum: currentEntry?.thread.votes_sum ?? 0,
                user_vote: currentVote,
              },
            }
            : entry,
        ),
      );
    } finally {
      setVotingId(null);
    }
  }

  async function handleVoteComment(commentId: number, value: 1 | -1) {
    if (!isAuthenticated) return;
    const key = `comment-${commentId}`;
    setVotingId(key);

    let currentVote: number | null = null;
    for (const entry of threads) {
      const comment = findComment(entry.comments, commentId);
      if (comment) {
        currentVote = comment.user_vote ?? null;
        break;
      }
    }

    const isTogglingOff = currentVote === value;

    setThreads((prev) =>
      prev.map((entry) => ({
        ...entry,
        comments: updateCommentVoteState(
          entry.comments,
          commentId,
          value,
          currentVote,
          isTogglingOff,
        ),
      })),
    );

    try {
      const response = await postJson<{
        value?: number | null;
        votes_sum?: number;
      }>(`/comments/${commentId}/vote`, { value });
      const newUserVote =
        response.value !== undefined ? response.value : isTogglingOff ? null : value;
      const responseVotesSum = response.votes_sum;
      userHasVotedRef.current = true;
      setThreads((prev) =>
        prev.map((entry) => {
          const comment = findComment(entry.comments, commentId);
          const votesSum =
            responseVotesSum !== undefined
              ? responseVotesSum
              : comment
                ? Number(comment.votes_sum ?? 0)
                : 0;
          return {
            ...entry,
            comments: comment
              ? updateCommentVoteFromResponse(
                  entry.comments,
                  commentId,
                  newUserVote,
                  votesSum,
                )
              : entry.comments,
          };
        }),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to vote on comment", error);
      setThreads((prev) =>
        prev.map((entry) => ({
          ...entry,
          comments: revertCommentVote(entry.comments, commentId, currentVote),
        })),
      );
    } finally {
      setVotingId(null);
    }
  }

  function handleDeleteThreadClick(threadId: number) {
    setDeleteThreadDialog({ open: true, threadId });
  }

  async function handleDeleteThreadConfirm() {
    const threadId = deleteThreadDialog.threadId;
    if (!threadId || !isAuthenticated) return;

    const threadToDelete = threads.find((entry) => entry.thread.id === threadId);
    setThreads((prev) => prev.filter((entry) => entry.thread.id !== threadId));

    try {
      await deleteThread(threadId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete thread", error);
      if (threadToDelete) {
        setThreads((prev) => [...prev, threadToDelete]);
      }
    }
  }

  function handleDeleteCommentClick(threadId: number, commentId: number) {
    setDeleteCommentDialog({ open: true, threadId, commentId });
  }

  async function handleDeleteCommentConfirm() {
    const { threadId, commentId } = deleteCommentDialog;
    if (!threadId || !commentId || !isAuthenticated) return;

    let commentToRestore: Comment | null = null;
    for (const entry of threads) {
      const comment = findComment(entry.comments, commentId);
      if (comment) {
        commentToRestore = comment;
        break;
      }
    }

    setThreads((prev) =>
      prev.map((entry) =>
        entry.thread.id === threadId
          ? {
            ...entry,
            comments: removeComment(entry.comments, commentId),
          }
          : entry,
      ),
    );

    try {
      await deleteComment(commentId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete comment", error);
      if (commentToRestore) {
        setThreads((prev) =>
          prev.map((entry) =>
            entry.thread.id === threadId
              ? {
                ...entry,
                comments: insertComment(entry.comments, commentToRestore!),
              }
              : entry,
          ),
        );
      }
    }
  }

  return (
    <section className="animate-in space-y-4 rounded-2xl border border-border bg-card/80 p-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md sm:p-4 [animation-delay:0.2s] [animation-fill-mode:both]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight sm:text-base">
          Discussion Threads
        </h2>
        <span className="text-xs text-muted-foreground">
          {threads.length} open thread{threads.length === 1 ? "" : "s"}
        </span>
      </div>

      <NewThreadForm
        onCreate={handleCreateThread}
        isAuthenticated={isAuthenticated}
        isLoading={threadLoading}
        formRef={threadFormRef}
      />

      {threads.length === 0 ? (
        <p className="py-3 text-sm text-muted-foreground">
          No threads yet. Start the first discussion about this protocol.
        </p>
      ) : (
        <div className="stagger-children space-y-3">
          {threads.map(({ thread, comments }) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              comments={comments}
              onCreateComment={handleCreateComment}
              onVoteThread={handleVoteThread}
              onVoteComment={handleVoteComment}
              onDeleteThread={handleDeleteThreadClick}
              onDeleteComment={handleDeleteCommentClick}
              isAuthenticated={isAuthenticated}
              currentUserId={user?.id}
              votingId={votingId}
              commentFormKey={commentFormKeys[thread.id] ?? 0}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteThreadDialog.open}
        onOpenChange={(open) =>
          setDeleteThreadDialog({ open, threadId: open ? deleteThreadDialog.threadId : null })
        }
        title="Delete Thread"
        description="Are you sure you want to delete this thread? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteThreadConfirm}
        variant="destructive"
      />

      <ConfirmDialog
        open={deleteCommentDialog.open}
        onOpenChange={(open) =>
          setDeleteCommentDialog({
            open,
            threadId: open ? deleteCommentDialog.threadId : null,
            commentId: open ? deleteCommentDialog.commentId : null,
          })
        }
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteCommentConfirm}
        variant="destructive"
      />
    </section>
  );
}
