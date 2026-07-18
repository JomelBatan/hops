import { LucideIcon } from "lucide-react";
const DrawIcon = ({
  icon: Icon,
  className = "",
  baseClassName = "text-faint/60",
}: {
  icon: LucideIcon;
  className?: string;
  baseClassName?: string;
}) => {
  return (
    <span className="relative inline-grid place-items-center ">
      {/* brand-green gradient used by the tracer stroke */}

      {/* static base outline */}
      <Icon className={`${className} ${baseClassName}`} />

      {/* animated tracer on top */}
      <Icon className={`icon-draw absolute inset-0 is-drawing`} />
    </span>
  );
};

export default DrawIcon;
