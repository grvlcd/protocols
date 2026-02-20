"use client";

import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
}: Props) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const dialog = (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen min-h-dvh items-center justify-center overflow-y-auto bg-black/50 p-4"
      style={{ position: "fixed" }}
    >
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div className="relative z-10 my-auto w-full max-w-sm shrink-0 rounded-2xl border border-border bg-card p-6 shadow-xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "default" : "default"}
            onClick={handleConfirm}
            size="sm"
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(dialog, document.body);
}
