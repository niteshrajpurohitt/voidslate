import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Header } from "./Header";
import { DisplayScreen } from "./DisplayScreen";
import { Controls } from "./Controls";
import { CounterBadge } from "./CounterBadge";

import { type ShredMode } from "./DisplayScreen";

interface DeviceViewProps {
  isProcessing: boolean;
  isScreenSettled: boolean;
  activeMode: ShredMode;
  onModeChange: (mode: ShredMode) => void;
  text: string;
  setText: (val: string) => void;
  formattedCount: string;
  onExecute: () => void;
  onAnimationComplete: () => void;
  onScreenLaunchSettled: () => void;
  onKeypressSound: () => void;
  onModeClickSound: () => void;
  onActionClickSound: () => void;
}

export function DeviceView({
  isProcessing,
  isScreenSettled,
  activeMode,
  onModeChange,
  text,
  setText,
  formattedCount,
  onExecute,
  onAnimationComplete,
  onScreenLaunchSettled,
  onKeypressSound,
  onModeClickSound,
  onActionClickSound,
}: DeviceViewProps) {
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

  return (
    <>
      {/* Top Center: Counter Badge */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 select-none hidden sm:block">
        <CounterBadge formattedCount={formattedCount} />
      </div>



      {/* Tabletop Chassis Frame */}
      <motion.div
        className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-2 py-3 sm:px-4 sm:py-8 select-none perspective-[1400px]"
        onMouseMove={handleChassisMouseMove}
        onMouseLeave={handleChassisMouseLeave}
      >
        <motion.div
          id="chassis-frame"
          className="relative w-full max-w-2xl min-w-0 flex-none box-border rounded-[1.25rem] border-2 border-zinc-950 bg-[linear-gradient(180deg,#ab9d87_0%,#c9bc9e_22%,#a09077_100%)] p-5 sm:p-6 md:p-8"
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
            className="pointer-events-none absolute inset-2 rounded-[0.90rem] opacity-[0.16]"
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

          {/* 1. Header with Blur effect on execute */}
          <motion.div
            animate={{ filter: isProcessing ? "blur(3px)" : "blur(0px)" }}
            transition={{ duration: 0.25 }}
          >
            <Header />
          </motion.div>

          {/* Clean Milled Display Frame */}
          <div className="relative rounded-lg border border-black/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.6)] p-0.5">
            {/* Floating Screen Card */}
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
                  onScreenLaunchSettled();
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
                onAnimationComplete={onAnimationComplete}
                onKeypressSound={onKeypressSound}
              />
            </motion.div>
          </div>

          {/* 3. Controls (Blurs when card pops out) */}
          <motion.div
            animate={{ filter: isProcessing ? "blur(3.5px)" : "blur(0px)" }}
            transition={{ duration: 0.25 }}
          >
            <Controls
              activeMode={activeMode}
              setActiveMode={onModeChange}
              onExecute={onExecute}
              isProcessing={isProcessing}
              hasText={text.trim().length > 0}
              onModeClickSound={onModeClickSound}
              onActionClickSound={onActionClickSound}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
