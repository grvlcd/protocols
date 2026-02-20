"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onCreate: (formData: FormData) => Promise<void> | void;
  isAuthenticated: boolean;
  isLoading: boolean;
  formRef: React.RefObject<HTMLFormElement | null>;
}

export function NewThreadForm({
  onCreate,
  isAuthenticated,
  isLoading,
  formRef,
}: Props) {
  async function action(formData: FormData) {
    await onCreate(formData);
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="space-y-2 rounded-xl border border-border bg-card/80 p-3 text-xs shadow-sm sm:p-3.5 sm:text-sm"
    >
      <p className="text-xs font-medium text-muted-foreground sm:text-sm">
        Start a new thread
      </p>
      <Input
        name="title"
        required={isAuthenticated}
        placeholder="Thread title"
        disabled={!isAuthenticated}
      />
      <Textarea
        name="body"
        required={isAuthenticated}
        placeholder="Ask a question or share an insight..."
        rows={3}
        className="mt-1"
        disabled={!isAuthenticated}
      />
      <div className="flex items-center justify-between gap-2 pt-1">
        <p className="text-[0.7rem] text-muted-foreground sm:text-xs">
          {isAuthenticated
            ? "Share your thoughts with the community."
            : "Log in to post a thread."}
        </p>
        <Button type="submit" size="sm" disabled={!isAuthenticated || isLoading}>
          {isLoading ? "Posting..." : "Post thread"}
        </Button>
      </div>
    </form>
  );
}
