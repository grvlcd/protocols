"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSubmit: (body: string) => void;
  isAuthenticated: boolean;
  placeholder?: string;
}

export function NewCommentForm({
  onSubmit,
  isAuthenticated,
  placeholder = "Reply to this thread...",
}: Props) {
  async function action(formData: FormData) {
    const body = (formData.get("body") as string) ?? "";
    onSubmit(body);
  }

  return (
    <form
      action={action}
      className="mt-2 space-y-1.5 rounded-xl border border-border bg-card/80 p-2.5 text-xs shadow-sm sm:p-3 sm:text-[0.8rem]"
    >
      <Textarea
        name="body"
        required={isAuthenticated}
        placeholder={placeholder}
        rows={2}
        disabled={!isAuthenticated}
      />
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <p className="text-[0.65rem] text-muted-foreground sm:text-[0.7rem]">
          {isAuthenticated
            ? "Nested replies and voting supported."
            : "Log in to reply."}
        </p>
        <Button type="submit" size="sm" disabled={!isAuthenticated}>
          Reply
        </Button>
      </div>
    </form>
  );
}
