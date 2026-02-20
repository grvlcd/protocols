export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type SortOption =
  | "recent"
  | "most_reviewed"
  | "highest_rated"
  | "most_upvoted";

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProtocolSummary {
  id: number;
  title: string;
  content: string;
  tags: string[] | null;
  rating: number | null;
  threads_count: number;
  reviews_count: number;
  reviews_avg_rating?: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProtocolDetail extends ProtocolSummary {
  author: {
    id: number;
    name: string;
  };
  threads: ThreadSummary[];
  reviews: Review[];
}

export interface ThreadSummary {
  id: number;
  title: string;
  body: string;
  protocol_id: number;
  user_id: number;
  comments_count?: number;
  votes_sum?: number;
  user_vote?: number | null;
  upvoted_by_user_ids?: number[];
  downvoted_by_user_ids?: number[];
  author?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  body: string;
  user_id: number;
  thread_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Comment[];
  votes_sum?: number;
  user_vote?: number | null;
  /** User IDs who upvoted (value=1). Used to show "already voted" after refresh. */
  upvoted_by_user_ids?: number[];
  /** User IDs who downvoted (value=-1). */
  downvoted_by_user_ids?: number[];
  author?: {
    id: number;
    name: string;
  };
}

export interface Review {
  id: number;
  rating: number;
  body: string | null;
  user_id: number;
  protocol_id: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: number;
    name: string;
  };
}

/**
 * Resolve current user's vote from user_vote or from upvoted/downvoted user ID lists.
 * Ensures "already voted" shows correctly after refresh when API returns vote collections.
 */
export function resolveUserVote(
  userVote: number | null | undefined,
  upvotedByUserIds: number[] | undefined,
  downvotedByUserIds: number[] | undefined,
  currentUserId: number | undefined,
): number | null {
  if (userVote !== undefined && userVote !== null) return userVote;
  if (currentUserId === undefined) return null;
  if (upvotedByUserIds?.includes(currentUserId)) return 1;
  if (downvotedByUserIds?.includes(currentUserId)) return -1;
  return null;
}

import { getToken } from "@/lib/auth";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = getToken();
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

export async function fetchJson<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...getAuthHeaders(),
    ...((init?.headers as Record<string, string> | undefined) ?? {}),
  };

  const res = await fetch(`${API_BASE_URL}${input}`, {
    headers,
    ...init,
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error("API error", res.status, await res.text());
    throw new Error(`API error: ${res.status}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export async function postJson<T>(
  input: string,
  body: unknown,
  init?: RequestInit,
): Promise<T> {
  return fetchJson<T>(input, {
    method: "POST",
    body: JSON.stringify(body),
    ...init,
  });
}

export async function deleteJson<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  return fetchJson<T>(input, {
    method: "DELETE",
    ...init,
  });
}

export async function deleteThread(threadId: number): Promise<void> {
  return deleteJson<void>(`/threads/${threadId}`);
}

export async function deleteComment(commentId: number): Promise<void> {
  return deleteJson<void>(`/comments/${commentId}`);
}
