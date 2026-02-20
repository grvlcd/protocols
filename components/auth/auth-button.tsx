"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";
import { LoginDialog } from "./login-dialog";

interface AuthButtonProps {
  mobile?: boolean;
  onMenuClose?: () => void;
}

export function AuthButton({ mobile, onMenuClose }: AuthButtonProps) {
  const { user, isAuthenticated, hasToken, isLoading, logout, refetchUser } =
    useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"login" | "register">("login");

  function withClose(fn: () => void) {
    return () => {
      fn();
      onMenuClose?.();
    };
  }

  const wrap = mobile ? "flex flex-col gap-2" : "flex items-center gap-2";
  const nameClass = mobile
    ? "truncate text-sm text-muted-foreground text-center"
    : "max-w-[120px] truncate text-sm text-muted-foreground sm:max-w-[180px]";

  if (isLoading && hasToken && !isAuthenticated) {
    return (
      <div className={wrap}>
        <Button size="sm" variant="ghost" disabled className="w-full justify-center sm:w-auto">
          Restoring session…
        </Button>
        <Button size="sm" variant="outline" onClick={withClose(() => logout())} className="w-full sm:w-auto whitespace-nowrap">
          Log out
        </Button>
      </div>
    );
  }

  if (!isAuthenticated && hasToken) {
    return (
      <div className={wrap}>
        <Button size="sm" variant="ghost" onClick={withClose(() => refetchUser())} className="w-full sm:w-auto">
          Reconnect
        </Button>
        <Button size="sm" variant="outline" onClick={withClose(() => logout())} className="w-full sm:w-auto whitespace-nowrap">
          Log out
        </Button>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={wrap}>
        <span className={nameClass} title={user.name}>
          {user.name}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={withClose(() => logout())}
          className="w-full whitespace-nowrap sm:w-auto"
        >
          Log out
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={wrap}>
        <Button
          variant="ghost"
          size="sm"
          onClick={withClose(() => {
            setDialogMode("login");
            setDialogOpen(true);
          })}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          Log in
        </Button>
        <Button
          size="sm"
          onClick={withClose(() => {
            setDialogMode("register");
            setDialogOpen(true);
          })}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          Register
        </Button>
      </div>
      <LoginDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialMode={dialogMode}
      />
    </>
  );
}
