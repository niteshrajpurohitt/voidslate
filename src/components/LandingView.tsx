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
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-center py-4 text-center">
        <div className="flex items-center gap-2.5">
          <span className="font-sekuya text-base tracking-widest uppercase">
            <span className="text-emerald-800">VOID</span>{" "}
            <span className="text-[#e3d8c5]">SLATE</span>
          </span>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 w-full max-w-3xl my-auto py-12 flex flex-col items-center text-center">
        {/* Main Headline with Sekuya Font */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sekuya text-3xl sm:text-5xl md:text-6xl text-[#e3d8c5] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] tracking-wider leading-[1.2] max-w-3xl uppercase"
        >
          Cast your thoughts into the <span className="text-emerald-800">Void</span>.
        </motion.h1>

        {/* Subtitle with Inter Font Typewriter Blur Effect */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.012,
                delayChildren: 0.3,
              },
            },
          }}
          className="mt-6 text-base sm:text-lg text-[#b8ad9e] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-xl leading-relaxed font-sans"
        >
          {"Got a secret, a random rant, or something you just need to get off your chest without telling anyone? Type it out, let go and clear your mind."
            .split("")
            .map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, filter: "blur(6px)" },
                  visible: {
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.15 },
                  },
                }}
              >
                {char}
              </motion.span>
            ))}
        </motion.p>

        {/* Launch Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <div className="rounded-md border border-black/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.4)] p-0.5 inline-block">
            <button
              onClick={handleStart}
              className="group relative overflow-hidden inline-flex items-center justify-center px-10 py-3.5 rounded border border-zinc-900 font-sans font-bold text-sm sm:text-base tracking-[0.2em] uppercase cursor-pointer select-none transition-all duration-150 bg-emerald-800 hover:bg-emerald-700 text-white shadow-[0_4px_0_#09090b,0_8px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.7)] active:translate-y-0.5 active:shadow-[0_1px_0_#09090b]"
            >
              <div className="pointer-events-none absolute inset-x-1 top-1 h-px rounded-full bg-white/60" />
              {/* Corner Status LED matching selection keycaps */}
              <div className="pointer-events-none absolute top-[7px] right-[7px] w-[6px] h-[6px] rounded-full bg-emerald-300 shadow-[0_0_5px_2px_rgba(134,239,172,0.8)]" />
              <span>Start Typing</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer / Privacy Note */}
      <footer className="relative z-10 w-full max-w-4xl text-center py-6 text-xs text-stone-500 font-sans">
        <span>100% Private. Your words never leave your browser. A clean slate every single time.</span>
      </footer>
    </div>
  );
}
