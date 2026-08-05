import React from "react";

interface HeaderProps {
  charCount: number;
  maxChars?: number;
}

export const Header: React.FC<HeaderProps> = ({
  charCount,
  maxChars = 500,
}) => {
  // Format character count with leading zeros e.g. 042 / 500
  const formattedCount = String(charCount).padStart(3, "0");
  const formattedMax = String(maxChars).padStart(3, "0");

  return (
    <header className="flex flex-col gap-4 pb-4 mb-4 border-b border-zinc-900 font-mono-hardware select-none sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Hardware Branding */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold tracking-widest text-zinc-900 m-0">
            VOID SLATE
            </h1>
          
          </div>
          <p className="text-[10px] text-stone-700 tracking-wider font-semibold uppercase mt-0.5">
            Cathartic Release Instrument
          </p>
        </div>
      </div>

      <div className="flex items-center justify-start sm:justify-end">
        <div className="flex h-8 items-center rounded border border-zinc-900 bg-[linear-gradient(180deg,#f8f4ef_0%,#e1dbd3_100%)] px-2 py-1 text-[11px] text-zinc-900 font-bold shadow-[0_3px_0_var(--color-zinc-900),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-6px_10px_rgba(0,0,0,0.08)]">
          <span className="inline-flex justify-end font-mono-hardware font-semibold text-emerald-800 tabular-nums">
            [{formattedCount} / {formattedMax}]
          </span>
        </div>
      </div>
    </header>
  );
};
