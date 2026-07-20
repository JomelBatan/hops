import { Loader2 } from "lucide-react";
import React from "react";
const variants = {
  primary:
    "bg-primary text-white shadow-[0_10px_25px_rgba(91,95,239,0.35)] hover:bg-blue hover:shadow-[0_14px_34px_rgba(66,116,217,0.45)]",

  secondary:
    "bg-surface border border-line text-midnight-blue shadow-sm hover:bg-light-whitesh hover:border-blue",

  ghost: "text-muted hover:bg-pastel-blue hover:text-midnight-blue",

  danger:
    "bg-brownish text-midnight-blue shadow-[0_8px_20px_rgba(255,190,145,0.35)] hover:brightness-95",

  outline:
    "border border-line bg-surface text-midnight-blue hover:border-primary hover:bg-pastel-blue",

  soft: "bg-pastel-blue text-midnight-blue hover:bg-light-blue",
};
const sizes = {
  sm: "h-8 px-3.5 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-[15px] gap-2",
  icon: "h-10 w-10",
  iconSm: "h-8 w-8",
};
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "outline"
  | "soft";

type ButtonSize = "sm" | "md" | "lg" | "icon" | "iconSm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        flex flex-row select-none items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all duration-200 ease-spring focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]
        ${variants[variant]}
        ${sizes[size]}
        ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
