import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="flex flex-row items-center justify-between pb-4 mb-4 border-b border-zinc-900 select-none px-1">
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
      <div className="flex items-center justify-end self-center">
        <div className="grid grid-cols-4 gap-1 p-1.5 rounded bg-zinc-900/10 border border-zinc-900/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-zinc-950 shadow-[inset_0_0.5px_1px_rgba(0,0,0,0.9)]"
            />
          ))}
        </div>
      </div>
    </header>
  );
};
