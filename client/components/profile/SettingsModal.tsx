import React, { useEffect, useState } from "react";

type Settings = {
  language: string;
  notifications: boolean;
  theme: "system" | "dark" | "light";
  privacy: "public" | "private";
};

export default function SettingsModal({ open, onClose, onSave, initial }: { open: boolean; onClose: () => void; onSave: (s: Settings) => void; initial: Settings; }) {
  const [form, setForm] = useState<Settings>(initial);
  useEffect(() => setForm(initial), [initial]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 bg-black/30" onClick={onClose}>
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-card/60 backdrop-blur border-l border-white/6 shadow-lg p-4 transition-transform transform translate-x-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-2">
          <h3 className="text-base font-semibold">Настройки</h3>
          <button onClick={onClose} className="text-white/70">✕</button>
        </div>

        <div className="p-2 space-y-4">
          <div>
            <label className="text-sm text-white/80">Язык</label>
            <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full mt-2 rounded-xl bg-secondary/60 border border-border p-2">
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white/80">Тема</label>
            <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value as any })} className="w-full mt-2 rounded-xl bg-secondary/60 border border-border p-2">
              <option value="system">Системная</option>
              <option value="dark">Тёмная</option>
              <option value="light">Светлая</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/80">Уведомления</div>
              <div className="text-xs text-white/60">Управление уведомлениями из Telegram</div>
            </div>
            <input type="checkbox" checked={form.notifications} onChange={(e) => setForm({ ...form, notifications: e.target.checked })} className="h-5 w-5 accent-primary" />
          </div>

          <div>
            <label className="text-sm text-white/80">Приватность</label>
            <select value={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.value as any })} className="w-full mt-2 rounded-xl bg-secondary/60 border border-border p-2">
              <option value="public">Публичный профиль</option>
              <option value="private">Приватный профиль</option>
            </select>
          </div>
        </div>

        <div className="p-2 pt-0 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-secondary/60 border border-border">Отмена</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Сохранить</button>
        </div>
      </aside>
    </div>
  );
}
