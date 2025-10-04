import { Heart, MessageCircle, Send, MoreHorizontal, Star } from "lucide-react";
import { Post } from "@/context/PinsContext";
import { useState } from "react";
import { usePins } from "@/context/PinsContext";

export default function PostCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);
  const { toggleStar, getStarData } = usePins();
  const star = getStarData(post.id);

  return (
    <article className="bg-card rounded-3xl p-3 shadow-soft shadow-black/40 border border-border">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <img
            src={post.avatar}
            alt={post.author}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white/95">
              {post.author}
            </div>
            {post.location && (
              <div className="text-xs text-white/60">{post.location}</div>
            )}
          </div>
        </div>
        <button className="text-white/70 hover:text-white">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      <div className="mt-3 relative overflow-hidden rounded-2xl">
        {post.video ? (
          <video src={post.video} className="w-full h-[48vw] sm:h-[360px] object-cover select-none rounded-2xl" controls playsInline style={{ transform: post.transform ? `rotate(${post.transform.rotate || 0}deg) scale(${post.transform.scale || 1})` : undefined }} />
        ) : (
          <img
            src={post.image}
            alt="post"
            className="w-full h-[48vw] sm:h-[360px] object-cover select-none rounded-2xl"
            draggable={false}
            style={{ transform: post.transform ? `rotate(${post.transform.rotate || 0}deg) scale(${post.transform.scale || 1})` : undefined }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-overlay-dark rounded-2xl" />
      </div>

      <div className="mt-3 flex items-center gap-4 px-1">
        <button className="group inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Heart className="h-5 w-5 group-active:scale-90 transition-transform" />
          <span className="text-sm tabular-nums">{new Intl.NumberFormat("ru-RU").format(post.likes)}</span>
        </button>
        <button className="inline-flex items-center gap-2 text-white/70 hover:text-white">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm tabular-nums">{post.comments}</span>
        </button>

        <button
          onClick={() => toggleStar(post.id)}
          className={`inline-flex items-center gap-2 ${star.starred ? "text-yellow-400" : "text-white/70 hover:text-white"}`}
        >
          <Star className="h-5 w-5" />
          <span className="text-sm tabular-nums">{star.count}</span>
        </button>

        <button className="ml-auto text-white/70 hover:text-white">
          <Send className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2 text-sm text-white/90 px-1">
        {expanded ? post.caption : truncate(post.caption, 120)}
        {post.caption.length > 120 && (
          <button
            className="ml-2 text-primary hover:underline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Скрыть" : "Читать далее"}
          </button>
        )}
      </div>
    </article>
  );
}

function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}
