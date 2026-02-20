import type { Comment } from "@/lib/api";

export function findComment(comments: Comment[], id: number): Comment | null {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    if (comment.children) {
      const found = findComment(comment.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function insertComment(existing: Comment[], comment: Comment): Comment[] {
  if (!comment.parent_id) {
    return [...existing, { ...comment, children: comment.children ?? [] }];
  }

  return existing.map((item) => {
    if (item.id === comment.parent_id) {
      const children = item.children ?? [];
      return {
        ...item,
        children: [...children, { ...comment, children: comment.children ?? [] }],
      };
    }

    if (item.children) {
      return { ...item, children: insertComment(item.children, comment) };
    }

    return item;
  });
}

export function replaceComment(
  existing: Comment[],
  tempId: number,
  replacement: Comment,
): Comment[] {
  return existing.map((item) => {
    if (item.id === tempId) {
      return { ...replacement, children: item.children };
    }

    if (item.children) {
      return {
        ...item,
        children: replaceComment(item.children, tempId, replacement),
      };
    }

    return item;
  });
}

export function removeComment(existing: Comment[], id: number): Comment[] {
  return existing
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: item.children ? removeComment(item.children, id) : item.children,
    }));
}

export function updateCommentUserVote(
  existing: Comment[],
  id: number,
  newVote: number | null,
): Comment[] {
  return existing.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        user_vote: newVote,
      };
    }

    if (item.children) {
      return {
        ...item,
        children: updateCommentUserVote(item.children, id, newVote),
      };
    }

    return item;
  });
}

export function updateCommentVoteFromResponse(
  existing: Comment[],
  id: number,
  userVote: number | null,
  votesSum: number,
): Comment[] {
  return existing.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        user_vote: userVote,
        votes_sum: votesSum,
      };
    }

    if (item.children) {
      return {
        ...item,
        children: updateCommentVoteFromResponse(
          item.children,
          id,
          userVote,
          votesSum,
        ),
      };
    }

    return item;
  });
}

export function updateCommentVoteState(
  existing: Comment[],
  id: number,
  value: 1 | -1,
  currentVote: number | null,
  isTogglingOff: boolean,
): Comment[] {
  return existing.map((item) => {
    if (item.id === id) {
      const newVoteSum = isTogglingOff
        ? Number(item.votes_sum ?? 0) - value
        : currentVote
          ? Number(item.votes_sum ?? 0) - currentVote + value
          : Number(item.votes_sum ?? 0) + value;
      return {
        ...item,
        votes_sum: newVoteSum,
        user_vote: isTogglingOff ? null : value,
      };
    }

    if (item.children) {
      return {
        ...item,
        children: updateCommentVoteState(
          item.children,
          id,
          value,
          currentVote,
          isTogglingOff,
        ),
      };
    }

    return item;
  });
}

export function revertCommentVote(
  existing: Comment[],
  id: number,
  originalVote: number | null,
): Comment[] {
  return existing.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        user_vote: originalVote,
      };
    }

    if (item.children) {
      return {
        ...item,
        children: revertCommentVote(item.children, id, originalVote),
      };
    }

    return item;
  });
}

export function updateCommentVotes(
  existing: Comment[],
  id: number,
  delta: number,
): Comment[] {
  return existing.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        votes_sum: Number(item.votes_sum ?? 0) + delta,
      };
    }

    if (item.children) {
      return {
        ...item,
        children: updateCommentVotes(item.children, id, delta),
      };
    }

    return item;
  });
}
