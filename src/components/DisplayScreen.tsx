import React, { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

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

interface MeltParticle {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  vx: number;
  stretchY: number;
  opacity: number;
  glow: number;
  canvasSlice: HTMLCanvasElement;
}

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
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

  // Trigger canvas particle destruction sequence when processing & card has launched
  useEffect(() => {
    if (!isProcessing || !isScreenSettled || !text.trim()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fit canvas resolution to displayed client rect
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Create an offscreen buffer canvas to draw the initial text snapshot
    const bufferCanvas = document.createElement("canvas");
    bufferCanvas.width = canvas.width;
    bufferCanvas.height = canvas.height;
    const bufferCtx = bufferCanvas.getContext("2d");
    if (!bufferCtx) return;

    renderTextToCanvasCtx(bufferCtx, canvas.width);

    let startTime: number | null = null;

    // --- MODE 1: SHRED ANIMATION ---
    if (activeMode === "SHRED") {
      const sliceWidth = 5;
      const strips: MeltParticle[] = [];

      for (let x = 0; x < canvas.width; x += sliceWidth) {
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = sliceWidth;
        sliceCanvas.height = canvas.height;
        const sliceCtx = sliceCanvas.getContext("2d");
        if (sliceCtx) {
          sliceCtx.drawImage(
            bufferCanvas,
            x,
            0,
            sliceWidth,
            canvas.height,
            0,
            0,
            sliceWidth,
            canvas.height,
          );
        }

        strips.push({
          x,
          y: 0,
          width: sliceWidth,
          height: canvas.height,
          vy: 0.8 + Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.4,
          stretchY: 1.0,
          opacity: 1.0,
          glow: 0,
          canvasSlice: sliceCanvas,
        });
      }

      const animateShred = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeStrips = 0;
        for (const strip of strips) {
          // Fall downward immediately with positive velocity
          strip.vy += 0.28; // faster downward gravity acceleration
          strip.y += strip.vy;

          if (strip.y > 20) {
            strip.opacity -= 0.045; // faster fade out
          }

          if (strip.opacity > 0 && strip.y < canvas.height + 40) {
            activeStrips++;
            ctx.save();
            ctx.globalAlpha = Math.max(0, strip.opacity);
            ctx.drawImage(
              strip.canvasSlice,
              strip.x,
              strip.y,
            );
            ctx.restore();
          }
        }

        if (activeStrips > 0 && elapsed < 1000) {
          animFrameRef.current = requestAnimationFrame(animateShred);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          onAnimationComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(animateShred);
    }

    // --- MODE 2: BURN ANIMATION (Fiery Flame & Ember Dissolve) ---
    else if (activeMode === "BURN") {
      const imgData = bufferCtx.getImageData(0, 0, canvas.width, canvas.height);
      const embers: EmberParticle[] = [];

      // Realistic fire palette generator
      const fireColors = ["#ffffff", "#fef08a", "#fbbf24", "#f97316", "#ef4444", "#dc2626"];

      // Sample non-transparent pixels to create burning embers
      const step = 3;
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          const alpha = imgData.data[index + 3];
          if (alpha > 40) {
            const colorIdx = Math.floor(Math.random() * fireColors.length);
            embers.push({
              x,
              y,
              vx: (Math.random() - 0.5) * 2.8,
              vy: -(2.5 + Math.random() * 4.0),
              size: 1.8 + Math.random() * 3.5,
              alpha: 1.0,
              maxLife: 25 + Math.random() * 30,
              life: 0,
              color: fireColors[colorIdx],
            });
          }
        }
      }

      const animateBurn = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw initial text with intense fiery orange/white heat glow for the first 300ms
        if (elapsed < 300) {
          ctx.save();
          ctx.shadowBlur = 18;
          ctx.shadowColor = "#f97316";
          ctx.drawImage(bufferCanvas, 0, 0);
          ctx.restore();
        }

        let activeEmbers = 0;
        for (const p of embers) {
          if (elapsed < 100 && Math.random() > 0.4) continue; // staggered ignite start

          p.life++;
          p.x += p.vx + Math.sin(p.life * 0.12) * 1.1; // realistic flickering heat sway
          p.y += p.vy;
          p.alpha = 1 - p.life / p.maxLife;

          if (p.life < p.maxLife && p.alpha > 0) {
            activeEmbers++;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(
              p.x,
              p.y,
              p.size * (1 - (p.life / p.maxLife) * 0.5),
              0,
              Math.PI * 2,
            );
            ctx.fill();
            ctx.restore();
          }
        }

        if (activeEmbers > 0 && elapsed < 1200) {
          animFrameRef.current = requestAnimationFrame(animateBurn);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          onAnimationComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(animateBurn);
    }

    // --- MODE 3: DUST ANIMATION ---
    else if (activeMode === "DUST") {
      const imgData = bufferCtx.getImageData(0, 0, canvas.width, canvas.height);
      const dust: DustParticle[] = [];

      const step = 3;
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          const alpha = imgData.data[index + 3];
          if (alpha > 40) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.8 + Math.random() * 3.5;
            dust.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 2,
              alpha: 1.0,
              decay: 0.015 + Math.random() * 0.02,
            });
          }
        }
      }

      const animateDust = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeDust = 0;
        for (const p of dust) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94; // air resistance
          p.vy *= 0.94;
          p.alpha -= p.decay;

          if (p.alpha > 0) {
            activeDust++;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = "rgb(250, 250, 249)";
            // Crisp pixel dust square
            ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
            ctx.restore();
          }
        }

        if (activeDust > 0 && elapsed < 2000) {
          animFrameRef.current = requestAnimationFrame(animateDust);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          onAnimationComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(animateDust);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    isProcessing,
    isScreenSettled,
    activeMode,
    text,
    renderTextToCanvasCtx,
    onAnimationComplete,
  ]);

  return (
    <div className="relative w-full max-w-full min-w-0 flex-noneh-48 min-h-48 sm:h-60 rounded-lg border border-zinc-800 bg-[linear-gradient(180deg,#101113_0%,#08090a_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-8px_14px_rgba(0,0,0,0.58)] overflow-hidden select-none sm:h-72">
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
        placeholder="Type your vent here..."
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
