import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border-2 border-celeste/50 bg-white/90 px-3 py-2 text-sm text-grafito placeholder:text-grafito/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquesa focus-visible:border-turquesa focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
