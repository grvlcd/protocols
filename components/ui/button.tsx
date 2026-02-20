import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const baseClasses =
  "inline-flex items-center justify-center rounded-md text-sm font-medium leading-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:scale-[1.02] min-h-[2rem] py-[0.35rem]";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-primary text-primary-foreground shadow hover:brightness-105",
  outline:
    "border border-input bg-background text-foreground shadow-sm hover:bg-muted",
  ghost: "text-foreground hover:bg-muted/70",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-8 px-3 text-xs",
  md: "min-h-9 px-4",
  lg: "min-h-10 px-5 text-sm",
  icon: "h-9 w-9 min-h-9 min-w-9 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";

