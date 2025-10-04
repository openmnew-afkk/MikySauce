import React from "react";

export default function Search() {
  return (
    <div className="min-h-screen" style={{ paddingBottom: 'var(--nav-height)' }}>
      <main className="max-w-md mx-auto px-4 pt-6 space-y-4">
        <h1 className="text-lg font-semibold">Поиск</h1>

        <input
          type="text"
          placeholder="Поиск по пользователям, тегам или темам"
          className="w-full rounded-2xl bg-secondary/60 border border-border p-3 placeholder:text-white/40"
        />

      </main>
    </div>
  );
}
