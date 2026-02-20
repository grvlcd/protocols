import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> { }

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background pl-3 pr-10 py-1.5 text-xs text-foreground shadow-sm outline-none ring-0 transition focus-visible:ring-2 focus-visible:ring-primary sm:text-sm [appearance:none] [background-image:none]",
          className,
        )}
        {...props}
      />
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[0.6rem] leading-none"
        aria-hidden
      />
    </div>
  ),
);

Select.displayName = "Select";

