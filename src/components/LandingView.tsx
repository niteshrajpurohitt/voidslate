import { motion } from "motion/react";
import { CounterBadge } from "./CounterBadge";

interface LandingViewProps {
  onStart: () => void;
  formattedCount?: string;
}

export function LandingView({ onStart, formattedCount = "0" }: LandingViewProps) {

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-6 py-8 sm:py-12 select-none overflow-y-auto text-stone-100 font-sans">

     
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between py-4">
        {/* Left: Stacked VOID SLATE*/}
        <div className="flex flex-col items-start leading-none font-sekuya text-base sm:text-lg md:text-xl tracking-widest uppercase select-none">
          <span className="text-emerald-700 leading-none">VOID</span>
          <span className="text-[#f4ebd0] leading-none mt-0.5">SLATE</span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <CounterBadge formattedCount={formattedCount} />
        </div>

        {/* Right: GitHub Icon Link */}
        <a
          href="https://github.com/niteshrajpurohitt/voidslate"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-400 p-1.5 rounded-none flex items-center justify-center cursor-pointer"
          aria-label="GitHub Repository"
        >
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 w-full max-w-3xl my-auto py-12 flex flex-col items-center text-center">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sekuya text-3xl sm:text-5xl md:text-6xl text-[#f4ebd0] drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)] tracking-wider leading-[1.2] max-w-3xl uppercase"
        >
          Cast your thoughts into the <span className="text-emerald-600">Void</span>.
        </motion.h1>

        {/* Subtitle*/}
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
          {"Got a secret, a random rant or something you just need to get off your chest without telling anyone? Type it out and clear your mind."
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
              onClick={onStart}
              className="group relative overflow-hidden inline-flex items-center justify-center px-10 py-3.5 rounded border border-zinc-900 font-sans font-bold text-sm sm:text-base tracking-[0.2em] uppercase cursor-pointer select-none transition-all duration-150 bg-emerald-800 hover:bg-emerald-700 text-white shadow-[0_4px_0_#09090b,0_8px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.7)] active:translate-y-0.5 active:shadow-[0_1px_0_#09090b]"
            >
              <div className="pointer-events-none absolute inset-x-1 top-1 h-px rounded-full bg-white/60" />
              <span>Start Typing</span>
            </button>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-5 flex items-center gap-2 px-4 py-1.5 rounded-lg border border-emerald-900/40 bg-emerald-950/30 backdrop-blur-sm text-xs text-[#f4ebd0]/70 select-none"
        >
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" />
          </svg>
          <span>Private by design. Nothing you type is ever stored.</span>
        </motion.div>
      </main>


    </div>
  );
}
