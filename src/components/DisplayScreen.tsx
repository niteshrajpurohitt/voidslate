import React, { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useDestructionAnimation } from "../hooks/useDestructionAnimation";

export type ShredMode = "SHRED" | "BURN" | "DUST";

interface DisplayScreenProps {
  text: string;
  setText: (val: string) => void;
  isProcessing: boolean;
  isScreenSettled?: boolean;
  activeMode: ShredMode;
  maxChars?: number;
  onAnimationComplete: () => void;
  onKeypressSound?: () => void;
}

export const DisplayScreen: React.FC<DisplayScreenProps> = ({
  text,
  setText,
  isProcessing,
  isScreenSettled = true,
  activeMode,
  maxChars = 500,
  onAnimationComplete,
  onKeypressSound,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Auto-focus textarea on mount so users can type immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Handle typing & keypress audio
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isProcessing) return;
    const val = e.target.value;
    if (val.length <= maxChars) {
      setText(val);
      onKeypressSound?.();
    }
  };

  // Render original formatted text to offscreen canvas with etched glow
  const renderTextToCanvasCtx = useCallback(
    (targetCtx: CanvasRenderingContext2D, width: number) => {
      targetCtx.clearRect(0, 0, width, targetCtx.canvas.height);
      targetCtx.fillStyle = "#fffbeb";
      targetCtx.font = "600 18px sans-serif";
      targetCtx.textBaseline = "top";
      targetCtx.shadowColor = "rgba(251, 191, 36, 0.4)";
      targetCtx.shadowBlur = 8;

      const padding = 24;
      const maxWidth = width - padding * 2;
      const lineHeight = 28;

      const paragraphs = text.split("\n");
      let currentY = padding;

      for (const paragraph of paragraphs) {
        const words = paragraph.split(" ");
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const metrics = targetCtx.measureText(testLine);

          if (metrics.width > maxWidth && currentLine !== "") {
            targetCtx.fillText(currentLine, padding, currentY);
            currentLine = word;
            currentY += lineHeight;
          } else {
            currentLine = testLine;
          }
        }
        targetCtx.fillText(currentLine, padding, currentY);
        currentY += lineHeight;
      }
    },
    [text],
  );

  // Delegate all destruction animation logic to the hook
  useDestructionAnimation({
    canvasRef,
    animFrameRef,
    isProcessing,
    isScreenSettled,
    activeMode,
    text,
    renderTextToCanvasCtx,
    onAnimationComplete,
  });

  return (
    <div className="relative w-full max-w-full min-w-0 flex-none h-48 min-h-48 sm:h-60 rounded-lg border border-zinc-800 bg-[linear-gradient(180deg,#101113_0%,#08090a_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-8px_14px_rgba(0,0,0,0.58)] overflow-hidden select-none sm:h-72">
      {/* Subtle Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 1) 100%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Glass Glare Reflection */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.09),transparent_42%)]" />

      {/* Text Area Input (Hidden during processing) */}
      <motion.textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        disabled={isProcessing}
        placeholder="Type freely. Nothing you type is ever stored or seen by anyone."
        initial={false}
        animate={{
          opacity: isProcessing && isScreenSettled ? 0 : 1,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        style={{
          textShadow:
            "0 1px 2px rgba(0,0,0,0.35), 0 0 8px rgba(251, 191, 36, 0.2)",
        }}
        className={`w-full min-w-0 h-full p-2 text-amber-50 text-base sm:p-6 sm:text-lg md:text-xl font-semibold tracking-wide leading-relaxed resize-none outline-none border-none caret-stone-50 placeholder-zinc-400/50 relative z-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden  ${
          isProcessing ? "pointer-events-none" : ""
        }`}
        rows={6}
        maxLength={maxChars}
        spellCheck={false}
      />

      {/* HTML5 Canvas overlay for destruction animation */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full min-w-0 h-full pointer-events-none z-20 ${
          isProcessing ? "block" : "hidden"
        }`}
      />
    </div>
  );
};

