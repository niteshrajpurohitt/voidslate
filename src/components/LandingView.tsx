import { motion } from "framer-motion";

interface LandingViewProps {
  onStart: () => void;
  onSoundEffect?: () => void;
}

export function LandingView({ onStart, onSoundEffect }: LandingViewProps) {
  const handleStart = () => {
    if (onSoundEffect) onSoundEffect();
    onStart();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-6 py-8 sm:py-12 select-none overflow-y-auto text-stone-100 font-sans">

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-center py-4 border-b border-stone-800/80 text-center">
        <div className="flex items-center gap-2.5">
          <span className="font-sekuya text-base tracking-widest text-[#e3d8c5] uppercase">
            VOID SLATE
          </span>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 w-full max-w-3xl my-auto py-12 flex flex-col items-center text-center">
        {/* Main Headline with Sekuya Font */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sekuya text-3xl sm:text-5xl md:text-6xl text-[#e3d8c5] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] tracking-wider leading-[1.2] max-w-3xl uppercase"
        >
          Cast your thoughts into the <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">Void</span>.
        </motion.h1>

        {/* Subtitle with Inter Font */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-[#e3d8c5]/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-xl leading-relaxed font-sans"
        >
          Got a secret, a random rant, or something you just need to get off your chest without telling anyone? Type it out, let go and clear your mind.
        </motion.p>

        {/* Launch Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center gap-3 px-10 py-4.5 rounded-md bg-emerald-800 hover:bg-emerald-700 text-white font-sans font-bold text-sm sm:text-base tracking-[0.2em] uppercase shadow-[0_7px_0_#09090b,0_16px_26px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.7)] border border-zinc-900 active:translate-y-1 active:shadow-[0_2px_0_#09090b] transition-all duration-150 cursor-pointer"
          >
            <span>Launch Device</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </motion.div>
      </main>

      {/* Footer / Privacy Note */}
      <footer className="relative z-10 w-full max-w-4xl text-center py-6 border-t border-stone-800/80 text-xs text-stone-500 font-sans">
        <span>🔒 100% Private. No servers. No logs. Clean slate every time.</span>
      </footer>
    </div>
  );
}
