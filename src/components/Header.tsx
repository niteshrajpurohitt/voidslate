import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col gap-4 pb-4 mb-4 border-b border-zinc-900 select-none sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Hardware Branding */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-sekuya tracking-wider text-zinc-900 m-0">
              VOID SLATE
            </h1>
          </div>
          <p className="text-[10px] text-stone-700 tracking-wider font-semibold uppercase mt-0.5">
            Cathartic Release Instrument
          </p>
        </div>
      </div>
      {/* Right Side: Clean Speaker Grille */}
      <div className="flex items-center justify-start sm:justify-end self-center">
        <div className="grid grid-cols-4 gap-1 p-1.5 rounded bg-zinc-900/10 border border-zinc-900/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-zinc-950 shadow-[inset_0_0.5px_1px_rgba(0,0,0,0.9)]"
            />
          ))}

             {/* <div className="flex items-center justify-start sm:justify-end">
        
        <div className="flex h-8 items-center rounded border border-zinc-900 bg-[linear-gradient(180deg,#f8f4ef_0%,#e1dbd3_100%)] px-2 py-1 text-[11px] text-zinc-900 font-bold shadow-[0_3px_0_var(--color-zinc-900),inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-6px_10px_rgba(0,0,0,0.08)]">
          <span className="inline-flex justify-end font-semibold text-emerald-800 tabular-nums">
            [{formattedCount} / {formattedMax}]
          </span>
        </div>
      </div> */}
      
        </div>
      </div>
    </header>
  );
};
