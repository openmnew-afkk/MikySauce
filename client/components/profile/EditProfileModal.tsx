import React, { useEffect, useRef, useState } from "react";

type Profile = {
  name: string;
  handle: string;
  location: string;
  avatar?: string;
};

export default function EditProfileModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (p: Partial<Profile>) => void;
  initial: Profile;
}) {
  const [form, setForm] = useState<Profile>(initial);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setForm(initial), [initial]);

  if (!open) return null;

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, avatar: reader.result as string }));
    reader.readAsDataURL(f);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-card/60 backdrop-blur rounded-2xl border border-white/6 shadow-soft" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-base font-semibold">Редактировать п��офиль</h3>
          <button onClick={onClose} className="text-white/70">✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex flex-col items-center">
            <div className="h-28 w-28 rounded-full overflow-hidden bg-secondary/40 p-1">
              {form.avatar ? <img src={form.avatar} className="h-full w-full object-cover rounded-full" /> : <div className="h-full w-full bg-white/5 rounded-full" />}
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => fileRef.current?.click()} className="px-3 py-1 rounded-xl bg-secondary/60 border border-border">Загрузить</button>
              <button onClick={() => setForm((s) => ({ ...s, avatar: "" }))} className="px-3 py-1 rounded-xl bg-secondary/40 border border-border">Удалить</button>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/80">Имя</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-2 rounded-xl bg-secondary/60 border border-border p-2" />
          </div>

          <div>
            <label className="text-sm text-white/80">Ник</label>
            <input value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} className="w-full mt-2 rounded-xl bg-secondary/60 border border-border p-2" />
          </div>

          <div>
            <label className="text-sm text-white/80">Локация</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full mt-2 rounded-xl bg-secondary/60 border border-border p-2" />
          </div>


          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>

        <div className="p-4 pt-0 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-secondary/60 border border-border">Отмена</button>
          <button
            onClick={() => {
              onSave(form);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
