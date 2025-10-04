import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export type Post = {
  id: string;
  author: string;
  avatar: string;
  location?: string;
  image?: string;
  video?: string; // data URL or external url, max 15s recommended
  transform?: { rotate?: number; scale?: number };
  likes: number;
  comments: number;
  caption: string;
  pinned?: boolean;
};

export type CreatePinDraft = {
  image?: string;
  video?: string;
  text: string;
  transform?: { rotate?: number; scale?: number };
};

interface PinsContextValue {
  feed: Post[];
  pins: Post[];
  mode: "Main" | "Pin";
  setMode: (m: "Main" | "Pin") => void;
  createPin: (draft: CreatePinDraft) => void;
  like: (id: string) => void;
  toggleStar: (id: string) => void;
  getStarData: (id: string) => { count: number; starred: boolean };
  isCreateOpen: boolean;
  openCreate: (prefill?: Partial<CreatePinDraft>) => void;
  closeCreate: () => void;
  draft: CreatePinDraft;
  setDraft: (d: CreatePinDraft) => void;
  // Telegram integration helpers
  telegramAvailable?: boolean;
  telegramUser?: any;
  syncWithTelegram?: () => void;
}

const PinsContext = createContext<PinsContextValue | null>(null);

const LS_KEY = "pinsopin_pins";

const INITIAL_FEED: Post[] = [
  {
    id: uid(),
    author: "Мох Раууф",
    avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=128&h=128&fit=crop",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1496302662116-85c20534e3f7?q=80&w=900&auto=format&fit=crop",
    likes: 10256,
    comments: 557,
    caption:
      "Где бы я ни был и что бы ни делал — я просто хочу распространять немного света в этот мир. #urban #night",
  },
  {
    id: uid(),
    author: "Арина",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&h=128&fit=crop",
    location: "Санкт‑Петербург",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
    likes: 8421,
    comments: 321,
    caption: "Лучшие рассветы — там, где море и ветер.",
  },
  {
    id: uid(),
    author: "Илья",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&h=128&fit=crop",
    location: "Алматы",
    image: "https://images.unsplash.com/photo-1518599807935-37015b9cefcb?q=80&w=900&auto=format&fit=crop",
    likes: 5230,
    comments: 178,
    caption: "Поймал этот свет прямо перед ливнем. Невероятная атмосфера!",
  },
  {
    id: uid(),
    author: "Мария",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=128&h=128&fit=crop",
    location: "Москва",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=900&auto=format&fit=crop",
    likes: 3421,
    comments: 89,
    caption: "Тёплый вечер на московских улицах.",
  },
  {
    id: uid(),
    author: "Сергей",
    avatar: "https://images.unsplash.com/photo-1545996124-6b7a3b1d2b3d?q=80&w=128&h=128&fit=crop",
    location: "Казань",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop",
    likes: 1980,
    comments: 43,
    caption: "Море и спокойствие.",
  },
];

export function PinsProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"Main" | "Pin">("Main");
  const [pins, setPins] = useState<Post[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState<CreatePinDraft>({ text: "" });

  const STARS_KEY = "pinsopin_stars";
  const [starsMap, setStarsMap] = useState<Record<string, { count: number; starred: boolean }>>({});

  // Telegram integration state
  const [telegramAvailable, setTelegramAvailable] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPins(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(pins));
    } catch {}
  }, [pins]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STARS_KEY);
      if (raw) setStarsMap(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STARS_KEY, JSON.stringify(starsMap));
    } catch {}
  }, [starsMap]);

  // Detect Telegram WebApp and cache some info
  useEffect(() => {
    try {
      const tg = (window as any)?.Telegram?.WebApp;
      if (tg) {
        setTelegramAvailable(true);
        setTelegramUser(tg.initDataUnsafe?.user || tg?.user || null);
        // Optionally expand UI in Telegram
        try { tg.expand?.(); } catch {}
      }
    } catch {}
  }, []);

  const like = useCallback((id: string) => {
    const upd = (arr: Post[]) => arr.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p));
    setPins((p) => upd(p));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setStarsMap((prev) => {
      const cur = prev[id] || { count: 0, starred: false };
      const next = { ...prev, [id]: { count: cur.starred ? Math.max(0, cur.count - 1) : cur.count + 1, starred: !cur.starred } };
      return next;
    });
  }, []);

  const getStarData = useCallback((id: string) => {
    return starsMap[id] || { count: 0, starred: false };
  }, [starsMap]);

  const createPin = useCallback((d: CreatePinDraft) => {
    if (!d.image && !d.text.trim()) return;
    const post: Post = {
      id: uid(),
      author: "Вы",
      avatar:
        "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=128&h=128&fit=crop",
      image: d.image,
      video: (d as any).video,
      transform: d.transform,
      location: "",
      likes: 0,
      comments: 0,
      caption: d.text,
      pinned: true,
    };
    setPins((prev) => [post, ...prev]);
    setDraft({ text: "" });
    setCreateOpen(false);
  }, []);

  const openCreate = useCallback((prefill?: Partial<CreatePinDraft>) => {
    setDraft((d) => ({ ...d, ...prefill }));
    setCreateOpen(true);
  }, []);

  const closeCreate = useCallback(() => setCreateOpen(false), []);

  const feed = useMemo(() => {
    // Show latest pins first, then initial feed
    return [...pins, ...INITIAL_FEED];
  }, [pins]);

  const syncWithTelegram = useCallback(() => {
    try {
      const tg = (window as any)?.Telegram?.WebApp;
      if (!tg) return;
      // Example: set main button text to show pinned count
      try {
        const count = pins.length + INITIAL_FEED.length;
        tg.MainButton.setText(`Пины: ${count}`);
        tg.MainButton.show();
      } catch {}
    } catch {}
  }, [pins]);

  const value = useMemo(
    () => ({
      feed,
      pins,
      mode,
      setMode,
      createPin,
      like,
      toggleStar,
      getStarData,
      isCreateOpen,
      openCreate,
      closeCreate,
      draft,
      setDraft,
      telegramAvailable,
      telegramUser,
      syncWithTelegram,
    }),
    [feed, pins, mode, createPin, like, toggleStar, getStarData, isCreateOpen, openCreate, closeCreate, draft, telegramAvailable, telegramUser, syncWithTelegram],
  );

  return <PinsContext.Provider value={value}>{children}</PinsContext.Provider>;
}

export function usePins() {
  const ctx = useContext(PinsContext);
  if (!ctx) throw new Error("usePins must be used within PinsProvider");
  return ctx;
}
