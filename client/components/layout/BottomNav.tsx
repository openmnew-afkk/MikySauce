import { Link, useLocation } from "react-router-dom";
import { Home, Search, MessageSquare, User, Plus } from "lucide-react";
import { usePins } from "@/context/PinsContext";

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className="flex items-center flex-col gap-1 px-3">
      <div
        className={`rounded-xl p-2 transition-all ${active ? "bg-primary text-primary-foreground shadow-soft" : "bg-transparent text-white/70 hover:text-white hover:bg-white/5"}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[11px] mt-1 text-white/60">{label}</span>
    </Link>
  );
}

export default function BottomNav() {
  const { openCreate } = usePins();

  return (
    <nav
      className="fixed inset-x-0 bottom-4 z-40 pointer-events-none"
      aria-hidden={false}
    >
      <div className="mx-auto max-w-md px-4 pointer-events-auto">
        <div className="relative">
          {/* Centered pill */}
          <div className="mx-auto w-full max-w-md bg-card/50 backdrop-blur rounded-full py-2 px-3 flex items-center justify-between shadow-soft border border-white/6">
            <NavItem to="/" icon={Home} label="Главная" />
            <NavItem to="/search" icon={Search} label="Поиск" />

            {/* center integrated create button */}
            <button
              aria-label="Создать пин"
              onClick={() => openCreate()}
              className="mx-2 h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#6EE7B7] to-[#60A5FA] shadow-md ring-1 ring-white/8 transform-gpu hover:scale-105 transition-all"
            >
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>

            <NavItem to="/chat" icon={MessageSquare} label="Чат" />
            <NavItem to="/profile" icon={User} label="Профиль" />
          </div>
        </div>
      </div>
    </nav>
  );
}
