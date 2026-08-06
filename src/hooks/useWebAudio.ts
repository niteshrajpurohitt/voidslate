import { useRef, useCallback, useEffect, useState } from 'react';

export function useWebAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('voidslate_muted') === 'true';
  });

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('voidslate_muted', String(next));
      return next;
    });
  }, []);

  // Initialize or resume AudioContext on user interaction
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // 1. Mechanical Keypress Switch Sound (30ms crisp click)
  const playKeyClick = useCallback(() => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Click Noise
      const bufferSize = ctx.sampleRate * 0.025; // 25ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Low mechanical pop
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.02);

      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(now);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Audio fallback silent guard
    }
  }, [getAudioContext, isMuted]);

  // 2. Action Key Spring Tension (Uses exact same click sound as all other buttons)
  const playSpringTension = useCallback(() => {
    playKeyClick();
  }, [playKeyClick]);

  // 3. Shred Destruction Sound (Crisp clean paper tearing slice & mechanical click)
  const playShredSound = useCallback((durationMs: number = 700) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;

      // 1. Paper Tearing / Slicing Noise (High pass filtered smooth noise sweep)
      const bufferSize = ctx.sampleRate * durationSec;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Natural smooth paper tear sound envelope
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.frequency.linearRampToValueAtTime(3200, now + durationSec);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.45, now + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Audio fallback silent guard
    }
  }, [getAudioContext, isMuted]);

  // 4. Burn Destruction Sound (Thermal crackle & rising sizzle)
  const playBurnSound = useCallback((durationMs: number = 600) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;

      // Thermal sizzle / hiss + crackle pops (Highpass noise)
      const bufferSize = ctx.sampleRate * durationSec;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Random pops and fire crackle spikes over sizzle background
        const isSpike = Math.random() > 0.985;
        data[i] = isSpike ? (Math.random() * 2 - 1) * 3 : (Math.random() * 2 - 1) * 0.3;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(4500, now + durationSec);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Audio fallback silent guard
    }
  }, [getAudioContext, isMuted]);

  // 5. Dust Destruction Sound (Deep bass whoosh & wind sweep)
  const playDustSound = useCallback((durationMs: number = 650) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;

      // 1. Air Noise for Whoosh
      const bufferSize = ctx.sampleRate * durationSec;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Low sweeping bandpass filter for deep heavy whoosh
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(100, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(750, now + durationSec * 0.45);
      noiseFilter.frequency.exponentialRampToValueAtTime(60, now + durationSec);
      noiseFilter.Q.setValueAtTime(1.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.55, now + durationSec * 0.35);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      // Deep sub-bass bass drop oscillator
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(50, now);
      subOsc.frequency.exponentialRampToValueAtTime(130, now + durationSec * 0.4);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + durationSec);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.4, now + durationSec * 0.35);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      noise.start(now);
      subOsc.start(now);
      subOsc.stop(now + durationSec);
    } catch {
      // Audio fallback silent guard
    }
  }, [getAudioContext, isMuted]);

  return {
    isMuted,
    toggleMute,
    playKeyClick,
    playSpringTension,
    playShredSound,
    playBurnSound,
    playDustSound,
  };
}
