import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { DisplayScreen, type ShredMode } from "./components/DisplayScreen";
import { Controls } from "./components/Controls";

import { useWebAudio } from "./hooks/useWebAudio";

export function App() {
  const [text, setText] = useState<string>("");
  const [activeMode, setActiveMode] = useState<ShredMode>("SHRED");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const {
    playKeyClick,
    playSpringTension,
    playShredSound,
    playBurnSound,
    playDustSound,
  } = useWebAudio();

  // Execute destruction sequence
  const handleExecute = useCallback(() => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    playSpringTension();

    // Trigger mode-specific audio engine
    if (activeMode === "SHRED") {
      playShredSound(2200);
    } else if (activeMode === "BURN") {
      playBurnSound(2400);
    } else if (activeMode === "DUST") {
      playDustSound(2000);
    }
  }, [
    text,
    isProcessing,
    activeMode,
    playSpringTension,
    playShredSound,
    playBurnSound,
    playDustSound,
  ]);

  // Complete animation & purge state
  const handleAnimationComplete = useCallback(() => {
    setText("");
    setIsProcessing(false);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center px-2 py-3 sm:px-4 sm:py-8  select-none">
      {/* Main Tabletop Chassis Frame */}
      <div className="relative w-full max-w-[42rem] min-w-0 flex-none overflow-hidden box-border rounded-[1.25rem] border-2 border-zinc-950 bg-[linear-gradient(180deg,#c2b6a3_0%,#e3d8c5_22%,#baa993_100%)] p-4 shadow-[0_30px_70px_rgba(0,0,0,0.72),0_8px_0_rgba(20,20,20,0.95),inset_0_1px_0_rgba(255,255,255,0.56),inset_0_-18px_24px_rgba(78,68,54,0.18)] sm:p-6 md:p-8">
        <div className="pointer-events-none absolute inset-[0.45rem] rounded-[0.95rem] border border-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.24),inset_0_-1px_0_rgba(0,0,0,0.14)]" />
      
        <div
          className="pointer-events-none absolute inset-[0.50rem] rounded-[0.90rem] opacity-[0.16]"
          style={
            {
              backgroundImage:
                "radial-gradient(rgba(255,255,255,1) 1px, transparent 0.6px)",
              backgroundSize: "8px 8px",
            }
          }
        />
         {/* Screw / Fastener Accents on Chassis Corners */}
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
        {/* 1. Header Component */}
        <Header />

       {/* Clean Milled Display Frame */}
<div className="rounded-lg border border-black/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.6)] p-0.5">
  <DisplayScreen
    text={text}
    setText={setText}
    isProcessing={isProcessing}
    activeMode={activeMode}
    maxChars={500}
    onAnimationComplete={handleAnimationComplete}
    onKeypressSound={playKeyClick}
  />
</div>

        {/* 3. Controls Component */}
        <Controls
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          onExecute={handleExecute}
          isProcessing={isProcessing}
          hasText={text.trim().length > 0}
          onModeClickSound={playKeyClick}
          onActionClickSound={playSpringTension}
        />
        
      </div>
    </div>
  );
}

export default App;

