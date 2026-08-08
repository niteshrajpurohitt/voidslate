import { useEffect, type RefObject } from "react";
import { type ShredMode } from "../components/DisplayScreen";

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

interface UseDestructionAnimationOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  animFrameRef: RefObject<number | null>;
  isProcessing: boolean;
  isScreenSettled: boolean;
  activeMode: ShredMode;
  text: string;
  renderTextToCanvasCtx: (ctx: CanvasRenderingContext2D, width: number) => void;
  onAnimationComplete: () => void;
}

export function useDestructionAnimation({
  canvasRef,
  animFrameRef,
  isProcessing,
  isScreenSettled,
  activeMode,
  text,
  renderTextToCanvasCtx,
  onAnimationComplete,
}: UseDestructionAnimationOptions) {
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

    // SHRED ANIMATION 
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
            x, 0, sliceWidth, canvas.height,
            0, 0, sliceWidth, canvas.height,
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
          strip.vy += 0.28;
          strip.y += strip.vy;

          if (strip.y > 20) {
            strip.opacity -= 0.045;
          }

          if (strip.opacity > 0 && strip.y < canvas.height + 40) {
            activeStrips++;
            ctx.save();
            ctx.globalAlpha = Math.max(0, strip.opacity);
            ctx.drawImage(strip.canvasSlice, strip.x, strip.y);
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

    // BURN ANIMATION (Fiery Flame & Ember Dissolve)
    else if (activeMode === "BURN") {
      const imgData = bufferCtx.getImageData(0, 0, canvas.width, canvas.height);
      const embers: EmberParticle[] = [];

      const fireColors = ["#ffffff", "#fef08a", "#fbbf24", "#f97316", "#ef4444", "#dc2626"];

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

    // DUST ANIMATION
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
    canvasRef,
    animFrameRef,
  ]);
}
