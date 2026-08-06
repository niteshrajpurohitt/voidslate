import { useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { Header } from "./components/Header";
import { DisplayScreen, type ShredMode } from "./components/DisplayScreen";
import { Controls } from "./components/Controls";
import { LandingView } from "./components/LandingView";

import { useWebAudio } from "./hooks/useWebAudio";

import ShapeGrid from "./components/ShapeGrid";

export function App() {
  const [viewMode, setViewMode] = useState<"LANDING" | "CONSOLE">("LANDING");
  const [text, setText] = useState<string>("");
  const [activeMode, setActiveMode] = useState<ShredMode>("DUST");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isScreenSettled, setIsScreenSettled] = useState<boolean>(false);

  // Subtle 3D Parallax Tilt for Console Chassis on Hover
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [3, -3]),
    { stiffness: 180, damping: 24 }
  );
  const rotateYSpring = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-3, 3]),
    { stiffness: 180, damping: 24 }
  );

  const handleChassisMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const chassis = document.getElementById("chassis-frame");
    if (chassis && chassis.contains(e.target as Node)) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleChassisMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Sync viewMode with browser history using modern HTML5 pushState (Clean URL)
  useEffect(() => {
    // Clear any legacy hash from the address bar
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname === "/device" ? "/device" : "/");
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view === "CONSOLE" || window.location.pathname === "/device") {
        setViewMode("CONSOLE");
      } else {
        setViewMode("LANDING");
      }
    };

    if (window.location.pathname === "/device") {
      setViewMode("CONSOLE");
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleStartDevice = useCallback(() => {
    window.history.pushState({ view: "CONSOLE" }, "", "/device");
    setViewMode("CONSOLE");
  }, []);

  const {
    isMuted,
    toggleMute,
    playKeyClick,
    playSpringTension,
    playShredSound,
    playBurnSound,
    playDustSound,
  } = useWebAudio();

  // Execute destruction sequence - launches card first
  const handleExecute = useCallback(() => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    setIsScreenSettled(false);
    playSpringTension();
  }, [text, isProcessing, playSpringTension]);

  // Trigger mode-specific audio engine & text destruction AFTER card locks in foreground
  const handleScreenLaunchSettled = useCallback(() => {
    if (!isProcessing) return;
    setIsScreenSettled(true);

    if (activeMode === "SHRED") {
      playShredSound(700);
    } else if (activeMode === "BURN") {
      playBurnSound(800);
    } else if (activeMode === "DUST") {
      playDustSound(600);
    }
  }, [
    isProcessing,
    activeMode,
    playShredSound,
    playBurnSound,
    playDustSound,
  ]);

  // Complete animation & purge state
  const handleAnimationComplete = useCallback(() => {
    setText("");
    setIsProcessing(false);
    setIsScreenSettled(false);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#090d0b]">
      {/* ReactBits ShapeGrid Background (Default ReactBits Aesthetic) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ShapeGrid
          direction="up"
          speed={0.3}
          squareSize={40}
          borderColor="#999"
          hoverFillColor="rgba(16, 185, 129, 0.25)"
          shape="square"
          hoverTrailAmount={3}
        />
      </div>

      {/* Floating Audio Control Pill (Rendered ONLY on CONSOLE View) */}
      {viewMode === "CONSOLE" && (
        <div className="fixed top-4 right-4 z-50 select-none">
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-800/90 bg-stone-950/85 hover:bg-stone-900 text-stone-300 hover:text-stone-100 font-sans text-xs shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-150 cursor-pointer backdrop-blur-md active:scale-95"
          >
            <div className={`w-1.5 h-1.5 rounded-lg transition-colors duration-200 ${isMuted ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"}`} />
            <span className="font-bold tracking-wider uppercase text-[10px]">
              {isMuted ? "SOUND OFF" : "SOUND ON"}
            </span>
          </button>
        </div>
      )}

      <div className="relative z-10 w-full min-h-screen">
        <AnimatePresence mode="wait">
      {viewMode === "LANDING" ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full min-h-screen"
        >
          <LandingView
            onStart={handleStartDevice}
          />
        </motion.div>
      ) : (
        <motion.div
          key="console"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onMouseMove={handleChassisMouseMove}
          onMouseLeave={handleChassisMouseLeave}
          className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-2 py-3 sm:px-4 sm:py-8 select-none [perspective:1400px]"
        >

          {/* Tabletop Chassis Frame (Exact Original Styling & Layout with Subtle 3D Tilt) */}
          <motion.div
            id="chassis-frame"
            className="relative w-full max-w-[42rem] min-w-0 flex-none box-border rounded-[1.25rem] border-2 border-zinc-950 bg-[linear-gradient(180deg,#c2b6a3_0%,#e3d8c5_22%,#baa993_100%)] p-5 sm:p-6 md:p-8"
            animate={{
              scale: isProcessing ? 0.9 : 1,
            }}
            style={{
              rotateX: rotateXSpring,
              rotateY: rotateYSpring,
            }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Blurrable Chassis Hardware Layer (Screws, Header, Controls) */}
            <motion.div
              animate={{
                filter: isProcessing ? "blur(3.5px)" : "blur(0px)",
                opacity: isProcessing ? 0.85 : 1,
              }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0 rounded-[1.25rem]"
            />

            <div className="pointer-events-none absolute inset-[0.45rem] rounded-[0.95rem] border border-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.24),inset_0_-1px_0_rgba(0,0,0,0.14)]" />

            <div
              className="pointer-events-none absolute inset-[0.50rem] rounded-[0.90rem] opacity-[0.16]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,1) 1px, transparent 0.6px)",
                backgroundSize: "8px 8px",
              }}
            />

            {/* Screw / Fastener Accents on Chassis Corners */}
            <motion.div
              animate={{ filter: isProcessing ? "blur(3px)" : "blur(0px)" }}
              transition={{ duration: 0.25 }}
              className="contents"
            >
              <div className="pointer-events-none absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-stone-400 border border-zinc-700 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)]">
                <div className="w-1.5 h-[1.5px] bg-zinc-800 rotate-45" />
              </div>

              <div className="pointer-events-none absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-stone-400 border border-zinc-700 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)]">
                <div className="w-1.5 h-[1.5px] bg-zinc-800 -rotate-12" />
              </div>

              <div className="pointer-events-none absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-stone-400 border border-zinc-700 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)]">
                <div className="w-1.5 h-[1.5px] bg-zinc-800 rotate-12" />
              </div>

              <div className="pointer-events-none absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-stone-400 border border-zinc-700 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)]">
                <div className="w-1.5 h-[1.5px] bg-zinc-800 -rotate-45" />
              </div>
            </motion.div>

            {/* 1. Header Component with Blur effect on execute */}
            <motion.div
              animate={{ filter: isProcessing ? "blur(3px)" : "blur(0px)" }}
              transition={{ duration: 0.25 }}
            >
              <Header />
            </motion.div>

            {/* Clean Milled Display Frame (Slot holding the Card Display) */}
            <div className="relative rounded-lg border border-black/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.6)] p-0.5">
              {/* Floating Screen Card (STAYS 100% SHARP - ZERO BLUR) */}
              <motion.div
                className="w-full relative z-40"
                animate={{
                  scale: isProcessing ? 1.1 : 1,
                  y: isProcessing ? -20 : 0,
                  boxShadow: isProcessing
                    ? "0 45px 110px -10px rgba(0, 0, 0, 0.85), 0 0 45px rgba(0,0,0,0.5)"
                    : "0 1px 2px rgba(0,0,0,0.1)",
                }}
                transition={{
                  duration: 0.28,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onAnimationComplete={() => {
                  if (isProcessing && !isScreenSettled) {
                    handleScreenLaunchSettled();
                  }
                }}
              >
                <DisplayScreen
                  text={text}
                  setText={setText}
                  isProcessing={isProcessing}
                  isScreenSettled={isScreenSettled}
                  activeMode={activeMode}
                  maxChars={500}
                  onAnimationComplete={handleAnimationComplete}
                  onKeypressSound={playKeyClick}
                />
              </motion.div>
            </div>

            {/* 3. Controls Component (Blurs when card pops out into focus) */}
            <motion.div
              animate={{ filter: isProcessing ? "blur(3.5px)" : "blur(0px)" }}
              transition={{ duration: 0.25 }}
            >
              <Controls
                activeMode={activeMode}
                setActiveMode={setActiveMode}
                onExecute={handleExecute}
                isProcessing={isProcessing}
                hasText={text.trim().length > 0}
                onModeClickSound={playKeyClick}
                onActionClickSound={playSpringTension}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
