import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-turquesa text-white hover:bg-[#008A8A] focus-visible:ring-turquesa shadow-sm hover:shadow-md",
        secondary:
          "bg-bordo text-white hover:bg-[#5A1825] focus-visible:ring-bordo shadow-sm hover:shadow-md",
        outline:
          "border-2 border-celeste/60 bg-white/60 text-grafito hover:bg-celeste/20 hover:border-celeste focus-visible:ring-celeste",
        ghost: "text-grafito hover:bg-white/80 focus-visible:ring-turquesa",
        highlight:
          "bg-amarillo text-grafito hover:bg-[#E8C866] focus-visible:ring-amarillo shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asMotion?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asMotion, ...props }, ref) => {
    const Comp: any = asMotion ? motion.button : "button";
    return (
      <Comp
        whileHover={asMotion ? { scale: 1.03 } : undefined}
        whileTap={asMotion ? { scale: 0.95 } : undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
