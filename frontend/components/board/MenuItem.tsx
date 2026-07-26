import React from "react";

interface MenuItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

export default function MenuItem({
  icon: Icon,
  children,
  onClick,
  danger = false,
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-surface-2
        ${danger ? "text-priority-urgent" : "text-muted hover:text-ink"}`}
    >
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
  );
}
