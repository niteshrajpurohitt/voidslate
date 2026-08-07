import { motion } from "framer-motion";
import type { ShredMode } from "./DisplayScreen";

interface ControlsProps {
  activeMode: ShredMode;
  setActiveMode: (mode: ShredMode) => void;
  onExecute: () => void;
  isProcessing: boolean;
  hasText: boolean;
  onModeClickSound: () => void;
  onActionClickSound: () => void;
}

export function Controls({
  activeMode,
  setActiveMode,
  onExecute,
  isProcessing,
  hasText,
  onModeClickSound,
  onActionClickSound,
}: ControlsProps) {
  const modes: {
    id: ShredMode;
    label: string;
    code: string;
  }[] = [
    {
      id: "DUST",
      label: "DUST",
      code: "01",
    },
    {
      id: "BURN",
      label: "BURN",
      code: "02",
    },
    {
      id: "SHRED",
      label: "SHRED",
      code: "03",
    },
  ];

  const handleModeChange = (mode: ShredMode) => {
    if (isProcessing) return;
    onModeClickSound();
    setActiveMode(mode);
  };

  const handleActionClick = () => {
    if (isProcessing || !hasText) return;
    onActionClickSound();
    
    // 100ms tactile keypress delay so keycap visibly depresses on touch screens before execution
    setTimeout(() => {
      onExecute();
    }, 100);
  };

  return (
    <div className="flex min-w-0 flex-col gap-7 pt-3  select-none sm:gap-8">
      <div className="flex min-w-0 flex-col gap-5">
        {/* Mode Selection Keycaps Group */}
        <div className="flex min-w-0 flex-col gap-3">
          <span
            style={{
              textShadow:
                "0 1px 0 rgba(255, 255, 255, 0.7), 0 -1px 0.5px rgba(0, 0, 0, 0.3)",
            }}
            className="text-[10px] tracking-wider text-stone-700 font-bold uppercase"
          >
            SELECT DESTRUCTION MODE
          </span>
          <div className="flex min-w-0 flex-row items-center justify-start gap-3 sm:gap-4">
            {modes.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <div
                  key={mode.id}
                  className="rounded-md border border-black/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.6)] pb-2 px-0.5"
                >
                  <motion.button
                    type="button"
                    whileTap={{ y: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    disabled={isProcessing}
                    onClick={() => handleModeChange(mode.id)}
                    className={`relative overflow-hidden rounded border border-zinc-900 font-bold cursor-pointer select-none transition-all duration-150 shadow-[0_7px_0_var(--color-zinc-900),0_16px_26px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-12px_16px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-[0_2px_0_var(--color-zinc-900),0_6px_12px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.65)] px-3 py-3 flex aspect-square w-20 min-w-20 sm:w-24 sm:min-w-24 flex-col items-center justify-center gap-1 text-xs flex-none ${
                      isActive
                        ? "bg-emerald-800 text-white"
                        : "bg-[linear-gradient(180deg,#f8f4ef_0%,#e0dbd4_100%)] text-zinc-900"
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-x-1 top-1 h-px rounded-full bg-white/75" />

                    {/* Status LED */}
                    <div
                      className={`pointer-events-none absolute top-[7px] right-[7px] w-[6px] h-[6px] rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-emerald-300 shadow-[0_0_5px_2px_rgba(134,239,172,0.65)]"
                          : "bg-zinc-400/30"
                      }`}
                    />

                    <span className="font-bold">[{mode.code}]</span>
                    <span className="text-[10px] font-extrabold tracking-wider">
                      {mode.label}
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Primary Action Button (Field Green TE Keycap) */}
      <div className="flex min-w-0 flex-col gap-3 w-full items-stretch">
        <span
          style={{
            textShadow:
              "0 1px 0 rgba(255, 255, 255, 0.7), 0 -1px 0.5px rgba(0, 0, 0, 0.3)",
          }}
          className="text-[10px] tracking-wider text-stone-700 font-bold uppercase"
        >
          DISPOSE THOUGHT
        </span>
        <div className="rounded-md border border-black/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.6)] pb-2 px-0.5">
        <motion.button
          type="button"
          whileTap={{ y: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          disabled={isProcessing || !hasText}
          onClick={handleActionClick}
          aria-busy={isProcessing}
          className={`relative w-full overflow-hidden rounded-md border border-zinc-900  font-bold cursor-pointer select-none transition-all duration-150 bg-emerald-800 text-white px-4 py-3 flex min-h-14 items-center justify-center text-sm tracking-[0.28em] shadow-[0_7px_0_var(--color-zinc-900),0_16px_26px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-12px_16px_rgba(0,0,0,0.14)] active:translate-y-1 active:shadow-[0_2px_0_var(--color-zinc-900),0_6px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.68)] sm:min-h-16 ${
            !hasText || isProcessing ? "cursor-not-allowed" : ""
          }`}
        >
          
          <div className="pointer-events-none absolute inset-x-1 top-1 h-px rounded-full bg-white/75" />
          <span>EXECUTE</span>
        </motion.button>
        </div>
      </div>
    </div>
  );
};
