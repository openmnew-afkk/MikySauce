import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const showTitle = pathname === "/" || pathname === "/splash";

  return (
    <header className="w-full bg-gradient-to-b from-[#051027] to-[hsl(var(--background))]">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-center">
        {showTitle ? (
          <h1 className="text-2xl font-extrabold text-white tracking-tight">MikySauce</h1>
        ) : (
          <Link to="/" className="text-white/60 hover:text-white">&nbsp;</Link>
        )}
      </div>
    </header>
  );
}
