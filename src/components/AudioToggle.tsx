interface AudioToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export function AudioToggle({ isMuted, onToggle }: AudioToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={isMuted ? "Unmute Audio" : "Mute Audio"}
      className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-stone-800/90 bg-stone-950/85 hover:bg-stone-900 text-stone-300 hover:text-stone-100 font-sans text-xs shadow-md transition-all duration-150 cursor-pointer backdrop-blur-md active:scale-95"
    >
      <div
        className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
          isMuted
            ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]"
            : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
        }`}
      />
      <span className="font-bold tracking-wider uppercase text-[10px]">
        {isMuted ? "SOUND OFF" : "SOUND ON"}
      </span>
    </button>
  );
}
