import React, { useEffect } from "react";
import { usePins } from "@/context/PinsContext";
import SegmentedSwitch from "@/components/pinsopin/SegmentedSwitch";
import PostCard from "@/components/pinsopin/PostCard";
import CreatePinModal from "@/components/pinsopin/CreatePinModal";

export default function Index() {
  const { feed, pins, mode, setMode, openCreate } = usePins();

  useEffect(() => {
    // Telegram Mini App safe adjustments if available
    try {
      // @ts-ignore
      const tg = window?.Telegram?.WebApp;
      tg?.expand?.();
    } catch {}
  }, []);

  const show = mode === "Main" ? feed : pins;

  return (
    <div className="min-h-screen" style={{ paddingBottom: 'var(--nav-height)' }}>
      <div className="sticky top-0 z-20 bg-background/70 backdrop-blur border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3">
          <SegmentedSwitch value={mode} onChange={setMode} />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-5">
        {show.length === 0 && (
          <div className="text-center text-white/70 py-20">
            В этом режиме пока пусто. Создайте ваш первый пин!
            <div>
              <button
                onClick={() => openCreate()}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-5 h-10"
              >
                Создать пин
              </button>
            </div>
          </div>
        )}
        {show.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </main>

      <CreatePinModal />
    </div>
  );
}
