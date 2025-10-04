import React, { useEffect, useState } from "react";
import EditProfileModal from "@/components/profile/EditProfileModal";
import SettingsModal from "@/components/profile/SettingsModal";
import { usePins } from "@/context/PinsContext";

type ProfileData = {
  name: string;
  handle: string;
  location: string;
  avatar?: string;
  posts: number;
  followers: number;
  following: number;
  premium?: boolean;
  premiumExpires?: string;
};

const PROFILE_KEY = "pinsopin_profile";
const SETTINGS_KEY = "pinsopin_settings";

export default function Profile() {
  const { telegramAvailable, telegramUser, syncWithTelegram } = usePins();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ language: "ru", notifications: true, theme: "system", privacy: "public" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setProfile(JSON.parse(raw));
      else
        setProfile({ name: "Вы", handle: "@you", location: "Санкт‑Петербу��г", avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=128&h=128&fit=crop", posts: 12, followers: 1234, following: 180, premium: true, premiumExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
    } catch {
      setProfile({ name: "Вы", handle: "@you", location: "Санкт‑Петербург", avatar: "", posts: 12, followers: 1234, following: 180 });
    }

    try {
      const rawS = localStorage.getItem(SETTINGS_KEY);
      if (rawS) setSettings(JSON.parse(rawS));
    } catch {}
  }, []);

  useEffect(() => {
    if (telegramAvailable) {
      try {
        syncWithTelegram?.();
      } catch {}
    }
  }, [telegramAvailable, syncWithTelegram]);

  const saveProfile = (p: Partial<ProfileData>) => {
    const next = { ...(profile as ProfileData), ...p };
    setProfile(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  };

  const saveSettings = (s: any) => {
    setSettings(s);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen" style={{ paddingBottom: "var(--nav-height)" }}>
      <header className="max-w-md mx-auto px-4 pt-6 pb-4">
        <div className="flex flex-col items-center">
          <div className="relative -mt-6">
            <div className="h-36 w-36 rounded-full bg-gradient-to-br from-[#6EE7B7] to-[#60A5FA] p-1">
              <img src={profile.avatar} className="h-full w-full rounded-full object-cover border-4 border-black/30" />
            </div>
            <div className="absolute -bottom-3 right-0">
              {profile.premium && (
                <div title="Premium" className="h-9 w-9 rounded-full bg-yellow-400 flex items-center justify-center text-black shadow-md text-sm font-bold">★</div>
              )}
            </div>
          </div>

          <div className="mt-3 text-center">
            <div className="text-xl font-semibold">{profile.name}</div>
            <div className="text-sm text-white/60">{profile.handle} · {profile.location}</div>
            {telegramAvailable && telegramUser && (
              <div className="text-xs text-white/50 mt-1">@{telegramUser.username || `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`}</div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-6">
        <section className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between">
          <div>
            <div className="text-sm text-white/80">Посты</div>
            <div className="text-lg font-semibold">{profile.posts}</div>
          </div>
          <div>
            <div className="text-sm text-white/80">Подписчики</div>
            <div className="text-lg font-semibold">{profile.followers.toLocaleString("ru-RU")}</div>
          </div>
          <div>
            <div className="text-sm text-white/80">Подписки</div>
            <div className="text-lg font-semibold">{profile.following}</div>
          </div>
        </section>

        <section className="bg-card rounded-2xl p-4 border border-border space-y-3">
          <button onClick={() => setEditing(true)} className="w-full rounded-xl bg-primary text-primary-foreground h-11">Редактировать профиль</button>
          <button onClick={() => setSettingsOpen(true)} className="w-full rounded-xl bg-secondary/60 border border-border h-11">Настройки</button>
        </section>

        <section className="text-sm text-white/60">Информация</section>
        <section className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm">Добро пожаловать в ваш профиль. Здесь отображается основная информация о вас.</p>
        </section>
      </main>

      <EditProfileModal open={editing} onClose={() => setEditing(false)} initial={{ name: profile.name, handle: profile.handle, location: profile.location, avatar: profile.avatar }} onSave={(p) => saveProfile(p)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} initial={settings} onSave={(s) => saveSettings(s)} />
    </div>
  );
}
