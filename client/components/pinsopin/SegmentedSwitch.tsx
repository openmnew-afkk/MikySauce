import { cn } from "@/lib/utils";

type Props = {
  value: "Main" | "Pin";
  onChange: (v: "Main" | "Pin") => void;
};

export default function SegmentedSwitch({ value, onChange }: Props) {
  const items = [
    { key: "Main", label: "Главная" },
    { key: "Pin", label: "Пины" },
  ] as const;

  return (
    <div className="relative mx-auto w-[200px] bg-secondary/40 backdrop-blur rounded-full p-1 border border-white/6 shadow-inner">
      <div className={cn("grid grid-cols-2 text-xs font-medium", {})}>
        {items.map((v) => (
          <button
            key={v.key}
            onClick={() => onChange(v.key)}
            className={cn(
              "relative z-10 px-3 py-1 rounded-full transition-colors",
              value === v.key ? "text-background" : "text-white/60",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div
        className={cn(
          "absolute inset-y-1 w-[calc(50%-6px)] rounded-full bg-primary/95 shadow-md transition-transform",
          value === "Main" ? "translate-x-1" : "translate-x-[calc(100%+6px)]",
        )}
      />
    </div>
  );
}
