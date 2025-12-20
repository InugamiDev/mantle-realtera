import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  size?: "sm" | "default" | "lg";
  nested?: boolean;
  variant?: "default" | "warning" | "info";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = false, size = "default", nested = false, variant = "default", ...props }, ref) => {
    const baseClass = nested ? "glass-nested" : "glass";
    const sizeClass = {
      sm: "glass-sm",
      default: "",
      lg: "glass-lg",
    }[size];
    const variantClass = nested
      ? {
          default: "",
          warning: "glass-nested-warning",
          info: "glass-nested-info",
        }[variant]
      : "";

    return (
      <div
        ref={ref}
        className={cn(baseClass, sizeClass, variantClass, hover && "glass-hover", className)}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
