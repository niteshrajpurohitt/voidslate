import { NumberTicker } from "./NumberTicker";

interface CounterBadgeProps {
  formattedCount: string;
}

export function CounterBadge({ formattedCount }: CounterBadgeProps) {
  return (
    <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-zinc-950 bg-[#070b09]/90 backdrop-blur-md text-xs text-stone-300 font-sans tracking-wider shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.12)]">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.85)] animate-pulse" />
      <span>
        <span className="text-[#f4ebd0] font-bold">
          <NumberTicker value={formattedCount} />
        </span>{" "}
        thoughts let go
      </span>
    </div>
  );
}

