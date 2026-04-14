import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({
  children,
  hover = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-bg-surface-1 border border-border-subtle rounded-[var(--radius-card)] ${
        hover ? "transition-colors hover:border-border-default hover:bg-bg-surface-2 cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
