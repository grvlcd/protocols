"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/auth-provider";
import { postJson, type ProtocolSummary } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProtocolDialog({ open, onOpenChange }: Props) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setContent("");
      setTags("");
      setError("");
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please log in to create a protocol");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const protocol = await postJson<ProtocolSummary>("/protocols", {
        title: title.trim(),
        content: content.trim(),
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      onOpenChange(false);
      router.push(`/protocols/${protocol.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create protocol",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const dialog = (
    <div
      className="animate-backdrop fixed inset-0 z-[100] flex min-h-screen min-h-dvh items-center justify-center overflow-y-auto bg-black/50 p-4"
      style={{ position: "fixed" }}
    >
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div className="animate-in-scale relative z-10 my-auto w-full max-w-2xl shrink-0 rounded-2xl border border-border bg-card p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Create New Protocol</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share a new protocol with the community.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Protocol title"
              required
              className="mt-1"
              disabled={!isAuthenticated || loading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground">
              Content <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the protocol, methodology, steps, and any relevant details..."
              required
              rows={8}
              className="mt-1"
              disabled={!isAuthenticated || loading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground">
              Tags (comma-separated)
            </label>
            <Input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="biology, chemistry, clinical"
              className="mt-1"
              disabled={!isAuthenticated || loading}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Separate multiple tags with commas
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground">
              Please log in to create a protocol.
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isAuthenticated || loading}>
              {loading ? "Creating..." : "Create Protocol"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(dialog, document.body)
    : null;
}
