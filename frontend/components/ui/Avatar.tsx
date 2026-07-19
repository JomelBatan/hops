import { colorFromId, initials } from "@/libs/utils";
import { User, Sizes } from "@/types";
import Image from "next/image";
import React from "react";
export type StandardSizes = Exclude<Sizes, "xs">;
const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

interface AvatarProps {
  name: string;
  id: string;
  src: string | null;
  size: Exclude<Sizes, "xl">;
  className?: string;
  title?: string;
}
interface AvatarStackProps {
  users: User[];
  max: number;
  size: Exclude<Sizes, "xl">;
}

export default function Avatar({
  name,
  id,
  src,
  size = "md",
  className = "",
  title,
}: AvatarProps) {
  return (
    <div
      title={title || name}
      className={`
        flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ring-2 ring-surface
        ${sizeMap[size]}${className}`}
      style={{
        backgroundColor: src ? undefined : colorFromId(id || name || ""),
      }}
    >
      {src ? (
        <Image src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </div>
  );
}
export function AvatarStack({ users, max = 4, size = "sm" }: AvatarStackProps) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((u) => (
        <Avatar
          key={u.id}
          id={u.id}
          name={u.name}
          src={u.avatar_url}
          size={size}
        />
      ))}
      {extra > 0 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-xs font-medium text-muted ring-2 ring-surface">
          +{extra}
        </div>
      )}
    </div>
  );
}
