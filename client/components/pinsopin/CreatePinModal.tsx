import React, { useRef, useState } from "react";
import { X, Upload } from "lucide-react";
import { usePins } from "@/context/PinsContext";

export default function CreatePinModal() {
  const { isCreateOpen, closeCreate, draft, setDraft, createPin } = usePins();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);

  if (!isCreateOpen) return null;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // handle video files with duration check
    if (f.type.startsWith("video/")) {
      const url = URL.createObjectURL(f);
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      videoEl.src = url;
      videoEl.onloadedmetadata = () => {
        const duration = videoEl.duration || 0;
        if (duration > 15) {
          const el = document.getElementById("create-pin-err");
          if (el) {
            el.textContent = "Видео не длиннее 15 секунд.";
            el.classList.remove("opacity-0");
            setTimeout(() => el.classList.add("opacity-0"), 3000);
          }
          URL.revokeObjectURL(url);
          return;
        }
        setDraft({ ...draft, video: url });
      };
      return;
    }

    const url = await readAsDataURL(f);
    setDraft({ ...draft, image: url });
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeCreate}
      role="dialog"
      aria-modal="true"
      aria-label="Со��дать пин"
    >
      <div
        className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-base font-semibold">Создать пин</h3>
          <button onClick={closeCreate} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="aspect-square overflow-hidden rounded-xl bg-secondary/60 border border-border flex items-center justify-center">
              {draft.video ? (
                <video src={draft.video} className="h-full w-full object-cover" controls style={{ transform: `rotate(${rotate}deg) scale(${scale})` }} />
              ) : draft.image ? (
                <img src={draft.image} alt="preview" className="h-full w-full object-cover" style={{ transform: `rotate(${rotate}deg) scale(${scale})` }} />
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center gap-2 text-white/70"
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Загрузить</span>
                </button>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <textarea
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              placeholder="Текст пина..."
              rows={6}
              className="w-full resize-none rounded-xl bg-secondary/60 border border-border p-3 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-white/70">Поворот</label>
                <button onClick={() => setRotate((r) => r - 90)} className="px-3 py-1 rounded bg-secondary/60">-90</button>
                <button onClick={() => setRotate((r) => r + 90)} className="px-3 py-1 rounded bg-secondary/60">+90</button>
                <label className="text-sm text-white/70 ml-4">Масштаб</label>
                <input type="range" min="0.5" max="1.8" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="mx-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 text-primary hover:opacity-90"
                  >
                    Заменить файл
                  </button>
                  <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={closeCreate} className="px-4 py-2 rounded-xl bg-secondary/60 border border-border">Отмена</button>
                  <button
                    onClick={() => {
                      if (!draft.image && !draft.text?.trim() && !draft.video) {
                        const el = document.getElementById("create-pin-err");
                        if (el) el.classList.remove("opacity-0");
                        setTimeout(() => el && el.classList.add("opacity-0"), 2000);
                        return;
                      }
                      const toCreate = { ...draft, transform: { rotate, scale } };
                      createPin(toCreate);
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
              <div id="create-pin-err" className="mt-2 text-sm text-red-400 opacity-0 transition-opacity">Пожалуйста, добавьте изображение или текст.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function readAsDataURL(file: File) {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}
