import { Sizes } from "@/types";
import { X } from "lucide-react";
import React, { ReactNode, useEffect } from "react";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: Exclude<Sizes, "xs">;
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) =>
      e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  const widths = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  };

  return (
    <div>
      {open && (
        <div className="fixed inset-0  z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <div
            className="fixed inset-0 bg-ink/35 backdrop-blur-sm"
            onClick={onClose}
          />
          <div
            className={`card relative z-10 mt-8 w-full rounded-3xl p-6 shadow-[var(--shadow-lift)
              ${widths[size]}`}
          >
            {title && (
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  {title && (
                    <h2 className="font-display text-black text-lg font-semibold tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-muted">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
            {children}
            {footer && (
              <div className="mt-6 flex justify-end gap-2">{footer}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
