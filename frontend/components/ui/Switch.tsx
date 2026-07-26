interface SwitchProps {
  checked: boolean;
  onChange: (b: boolean) => void;
}

export default function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200
      ${checked ? "bg-brand-500" : "bg-elevated"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-(--shadow-card) transition-transform duration-200
        ${checked ? "translate-x-5.5" : "translate-x-0.5"}`}
      />
    </button>
  );
}
