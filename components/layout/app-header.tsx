"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/auth-button";
import { CreateProtocolDialog } from "@/components/protocols/create-protocol-dialog";

export function AppHeader() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleNewProtocol() {
    setCreateDialogOpen(true);
    closeMobileMenu();
  }

  return (
    <>
      <header className="animate-header-in sticky top-0 z-40 min-h-14 border-b-2 border-primary/20 bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:px-4 md:px-6">
          <Link
            href="/"
            className="relative shrink-0 text-sm font-semibold tracking-tight text-primary transition-all duration-200 hover:opacity-90 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full sm:text-base"
            onClick={closeMobileMenu}
          >
            <span className="hidden sm:inline">Protocol Explorer</span>
            <span className="sm:hidden">Explorer</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-3 md:flex md:gap-4">
            <Link
              href="/protocols"
              className="relative whitespace-nowrap text-sm font-medium text-foreground transition-all duration-200 hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
            >
              Protocols
            </Link>
            <Button
              size="sm"
              variant="default"
              onClick={() => setCreateDialogOpen(true)}
              className="shrink-0 bg-primary text-primary-foreground hover:opacity-90"
            >
              New Protocol
            </Button>
            <AuthButton />
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="shrink-0 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden
          />
          <div
            className="animate-slide-in-right fixed right-0 top-0 z-50 flex h-full w-full max-w-[280px] flex-col gap-1 border-l border-border bg-background/98 p-4 pt-[max(1rem,env(safe-area-inset-top))] shadow-xl backdrop-blur md:hidden"
            role="dialog"
            aria-label="Navigation menu"
          >
            <div className="mb-2 flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm font-semibold text-primary">
                Protocol Explorer
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Link
              href="/protocols"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              onClick={closeMobileMenu}
            >
              Protocols
            </Link>
            <Button
              variant="default"
              className="justify-start bg-primary text-primary-foreground hover:opacity-90"
              onClick={handleNewProtocol}
            >
              New Protocol
            </Button>
            <div className="mt-2 border-t border-border pt-3">
              <AuthButton mobile onMenuClose={closeMobileMenu} />
            </div>
          </div>
        </>
      )}

      <CreateProtocolDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
