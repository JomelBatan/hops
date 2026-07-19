import React, { ElementType } from "react";

interface EmptyHintProps {
  icon: ElementType;
  children: React.ReactNode;
}

export default function EmptyHint({ icon: Icon, children }: EmptyHintProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
      <Icon className="h-6 w-6 text-faint" />
      <p className="max-w-60 text-xs text-muted">{children}</p>
    </div>
  );
}
