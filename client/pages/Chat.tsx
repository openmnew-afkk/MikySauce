import React, { useState, useEffect, useRef } from "react";
import { usePins } from "@/context/PinsContext";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

type Msg = { id: string; role: "user" | "assistant"; text: string; time?: string };

export default function Chat() {
  const [model, setModel] = useState("deepseek");
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m1", role: "assistant", text: "Привет! Я ИИ PinsOpin. Могу помоч�� с идеями для пинов или создать пин на основе вашег�� сообщения.", time: "только что" },
    { id: "m2", role: "user", text: "Привет, предложи идею для пина.", time: "1 мин" },
    { id: "m3", role: "assistant", text: "Предлагаю: ночной городской кадр с контрастным неоновым освещением и короткой подписью мотивации.", time: "1 мин" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const { openCreate } = usePins();
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const id = Date.now().toString();
    setMessages((m) => [...m, { id, role: "user", text, time: "только что" }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = suggest(text);
      setMessages((m) => [...m, { id: id + "a", role: "assistant", text: reply, time: "только что" }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="min-h-screen" style={{ paddingBottom: 'var(--nav-height)' }}>
      <main className="max-w-md mx-auto px-4 pt-6 py-3 space-y-3" style={{ paddingBottom: 'calc(var(--nav-height) + 20px)' }}>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white/70 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-lg font-semibold">Чат с ИИ</h1>
        </div>

        <div className="bg-card rounded-xl p-3 border border-border">
          <div className="text-sm text-white/70 mb-2">Модель ИИ</div>
          <div className="flex gap-2">
            <button onClick={() => setModel('deepseek')} className={`px-3 py-1 rounded-xl ${model==='deepseek' ? 'bg-primary text-primary-foreground' : 'bg-secondary/60'}`}>Deepseek</button>
            <button onClick={() => setModel('qwen')} className={`px-3 py-1 rounded-xl ${model==='qwen' ? 'bg-primary text-primary-foreground' : 'bg-secondary/60'}`}>Qwen 3 Max</button>
            <button onClick={() => setModel('other')} className={`px-3 py-1 rounded-xl ${model==='other' ? 'bg-primary text-primary-foreground' : 'bg-secondary/60'}`}>Другие</button>
          </div>
          <p className="text-white/60 text-sm mt-2">Вы выбрали: {model}</p>
        </div>
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`${m.role === "user" ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" : "bg-secondary/60 text-white rounded-2xl rounded-tl-sm"} max-w-[80%] px-4 py-3` }>
              <div className="text-sm leading-snug">{m.text}</div>
              <div className="mt-1 text-[11px] text-white/50">{m.time}</div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            ИИ печатает…
          </div>
        )}

        <div ref={endRef} />

        <div className="pt-2 flex flex-wrap gap-2">
          <button onClick={() => openCreate({ text: "Создай пин по моему запросу" })} className="inline-flex items-center gap-2 rounded-full bg-secondary/70 border border-border px-3 py-1 text-xs">
            <Plus className="h-3 w-3" /> Создать пин
          </button>
          <button onClick={() => setInput((v) => v + (v ? " " : "") + "Уточни детали, пожалуйста.")} className="rounded-full bg-secondary/70 border border-border px-3 py-1 text-xs">Уточнить запрос</button>
          <Link to="/profile" className="rounded-full bg-secondary/70 border border-border px-3 py-1 text-xs">Профиль</Link>
        </div>
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="fixed inset-x-0 z-50 bg-background/90 backdrop-blur border-t border-border"
        style={{ bottom: 'calc(var(--nav-height) + 12px)' }}
      >
        <div className="max-w-md mx-auto px-4 py-3 flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder="Напишите сооб��ение…"
            className="flex-1 resize-none rounded-2xl bg-secondary/60 border border-border p-3 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary max-h-36"
          />
          <button type="submit" className="h-11 px-4 rounded-2xl bg-primary text-primary-foreground font-medium">Отправить</button>
        </div>
      </form>
    </div>
  );
}

function suggest(text: string) {
  const t = text.toLowerCase();
  if (/(пин|pin)/.test(t)) return "Готово. Откройте форму, чтобы загрузить изображение и текст.";
  if (/(идея|подскажи|что снять)/.test(t)) return "Предлагаю идею: сфотограф��руйте контрастный свет в городе и добавьте короткую подпись мотивации.";
  return "Могу создать пин из этого сообщения или уточнить ваш запрос.";
}
