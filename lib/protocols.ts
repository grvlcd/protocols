import {
  fetchJson,
  type PaginatedResponse,
  type ProtocolSummary,
  type ProtocolDetail,
  type Comment,
} from "@/lib/api";

export async function getProtocols(
  search: string,
  sort: string,
  page: number,
) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  const url = `/protocols${query ? `?${query}` : ""}`;

  return fetchJson<PaginatedResponse<ProtocolSummary>>(url);
}

export async function getProtocol(id: string) {
  try {
    return await fetchJson<ProtocolDetail>(`/protocols/${id}`);
  } catch {
    return null;
  }
}

export async function getThreadComments(threadId: number) {
  return fetchJson<Comment[]>(`/threads/${threadId}/comments`);
}

export function groupCommentsByParent(comments: Comment[]): Comment[] {
  const map = new Map<number, Comment & { children: Comment[] }>();
  const roots: (Comment & { children: Comment[] })[] = [];

  comments.forEach((c) => {
    map.set(c.id, { ...c, children: [] });
  });

  map.forEach((comment) => {
    if (comment.parent_id && map.has(comment.parent_id)) {
      map.get(comment.parent_id)!.children.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}
