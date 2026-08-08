import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type ShredMode } from "./components/DisplayScreen";
import { LandingView } from "./components/LandingView";
import { DeviceView } from "./components/DeviceView";
import { AudioToggle } from "./components/AudioToggle";
import { useWebAudio } from "./hooks/useWebAudio";
import { useGlobalCounter } from "./hooks/useGlobalCounter";
import ShapeGrid from "./components/ShapeGrid";

export function App() {
  const { formattedCount, incrementCount } = useGlobalCounter();
  const [viewMode, setViewMode] = useState<"LANDING" | "DEVICE">(() => {
    return window.location.pathname === "/device" ? "DEVICE" : "LANDING";
  });
  const [text, setText] = useState<string>("");
  const [activeMode, setActiveMode] = useState<ShredMode>("DUST");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isScreenSettled, setIsScreenSettled] = useState<boolean>(false);

  // Sync viewMode with browser history using modern HTML5 pushState (Clean URL)
  useEffect(() => {
   
    if (window.location.hash) {
      const cleanPath = window.location.pathname === "/device" ? "/device" : "/";
      window.history.replaceState(
        { view: window.location.pathname === "/device" ? "DEVICE" : "LANDING" },
        "",
        cleanPath
      );
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view === "DEVICE" || window.location.pathname === "/device") {
        setViewMode("DEVICE");
      } else {
        setViewMode("LANDING");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleStartDevice = useCallback(() => {
    window.history.pushState({ view: "DEVICE" }, "", "/device");
    setViewMode("DEVICE");
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

  // Execute destruction sequence
  const handleExecute = useCallback(() => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    setIsScreenSettled(false);
    playSpringTension();
    incrementCount();
  }, [text, isProcessing, playSpringTension, incrementCount]);

  // Trigger mode-specific audio engine & text destruction after display screen locks in foreground
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

  // Complete animation & dispose state
  const handleAnimationComplete = useCallback(() => {
    setText("");
    setIsProcessing(false);
    setIsScreenSettled(false);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#090d0b]">
      {/* ReactBits ShapeGrid Background */}
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

      
      {viewMode === "DEVICE" && (
        <div className="fixed top-4 right-4 z-100 select-none">
          <AudioToggle isMuted={isMuted} onToggle={toggleMute} />
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
                formattedCount={formattedCount}
              />
            </motion.div>
          ) : (
            <motion.div
              key="device"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative min-h-screen w-full"
            >
              <DeviceView
                isProcessing={isProcessing}
                isScreenSettled={isScreenSettled}
                activeMode={activeMode}
                onModeChange={setActiveMode}
                text={text}
                setText={setText}
                formattedCount={formattedCount}
                onExecute={handleExecute}
                onAnimationComplete={handleAnimationComplete}
                onScreenLaunchSettled={handleScreenLaunchSettled}
                onKeypressSound={playKeyClick}
                onModeClickSound={playKeyClick}
                onActionClickSound={playSpringTension}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

