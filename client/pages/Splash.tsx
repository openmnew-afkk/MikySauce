import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const nav = useNavigate();

  useEffect(() => {
    const audio = new Audio("/placeholder.mp3");
    audio.volume = 0.08;
    audio.play().catch(() => {});
    const t = setTimeout(() => nav("/"), 2200);
    return () => {
      clearTimeout(t);
      audio.pause();
    };
  }, [nav]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#071126] to-[hsl(var(--background))]">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] animate-pulse">MikySauce</h1>
      </div>
    </div>
  );
}
