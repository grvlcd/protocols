"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./auth-provider";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "login" | "register";
}

export function LoginDialog({ open, onOpenChange, initialMode = "login" }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onOpenChange(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

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
        <h2 className="text-lg font-semibold">
          {mode === "login" ? "Log in" : "Create account"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Log in to vote and comment."
            : "Create an account to participate."}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required={mode === "register"}
                className="mt-1"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="mt-1"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "..." : mode === "login" ? "Log in" : "Register"}
            </Button>
          </div>
        </form>
        <button
          type="button"
          className="mt-4 text-sm text-muted-foreground underline hover:text-foreground"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(dialog, document.body)
    : null;
}
