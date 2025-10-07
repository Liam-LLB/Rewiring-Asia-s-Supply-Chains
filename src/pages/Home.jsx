import React, { useRef, useEffect, useState } from "react";
import { NavLink, BrowserRouter } from "react-router-dom";
import { motion } from "framer-motion";

export default function PreviewSafeHome() {
  return (
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
}

function Home() {
  const menuRef = useRef(null);
  const goToMenu = () => menuRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <Hero goToMenu={goToMenu} menuRef={menuRef} />
      <MenuSection ref={menuRef} />
      <Footer />
    </div>
  );
}

function Hero({ goToMenu, menuRef }) {
  const [scrollDir, setScrollDir] = useState("down");
  const [lastY, setLastY] = useState(0);
  const [visible, setVisible] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = {
      hover: new Audio("https://assets.mixkit.co/sfx/download/mixkit-select-click-1109.wav"),
      click: new Audio("https://assets.mixkit.co/sfx/download/mixkit-fast-small-sweep-transition-166.wav"),
    };
    Object.values(audioRef.current).forEach(a => (a.volume = 0.18));
  }, []);

  const playSound = (type) => {
    const s = audioRef.current?.[type];
    if (!s) return;
    try { s.currentTime = 0; s.play(); } catch {}
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrollDir(y > lastY ? "down" : "up");
      setLastY(y);

      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const ratio = 1 - y / totalHeight;
      setVisible(ratio > 0.05);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <section className="relative h-[100svh] grid place-items-center select-none overflow-hidden">
      {/* Fond majestueux animé amélioré */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0% 0%", "200% 200%", "400% 0%", "0% 0%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          style={{
            backgroundImage:
              "conic-gradient(from 180deg, #010a1f, #031a3a, #062f5e, #0a407f, #153c6d, #4b132d, #700f20, #3b0918, #1a0822, #010a1f)",
            backgroundSize: "500% 500%",
            filter: "blur(20px) brightness(1.1) saturate(1.4)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
          style={{
            background:
              "radial-gradient(40% 40% at 15% 50%, rgba(56,189,248,0.25) 0%, rgba(0,0,0,0) 80%), radial-gradient(40% 40% at 85% 50%, rgba(248,113,113,0.25) 0%, rgba(0,0,0,0) 80%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* Ligne interrompue centrée */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-0">
        <div className="w-px h-[44vh] bg-gradient-to-b from-blue-400/0 via-white/80 to-white/0" />
        <div className="h-[2.3rem]" />
        <div className="w-px h-[44vh] bg-gradient-to-t from-red-400/0 via-white/80 to-white/0" />
      </div>

      {/* Titre avec lueur dynamique */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-extrabold leading-tight flex items-center justify-center gap-4 text-center z-10"
        style={{ textShadow: "0 0 25px rgba(255,255,255,0.5)" }}
      >
        <motion.span animate={{ textShadow: [
          "0 0 25px rgba(30,144,255,0.6)",
          "0 0 45px rgba(30,144,255,0.8)",
          "0 0 25px rgba(30,144,255,0.6)"
        ] }} transition={{ duration: 4, repeat: Infinity }} className="text-blue-400">USA</motion.span>
        <span className="relative flex flex-col items-center">
          <div className="h-[1px] w-14 bg-white/70 mb-1" />
          <motion.span animate={{ textShadow: [
            "0 0 10px rgba(255,255,255,0.5)",
            "0 0 25px rgba(255,255,255,0.8)",
            "0 0 10px rgba(255,255,255,0.5)"
          ] }} transition={{ duration: 3, repeat: Infinity }} className="text-white/90 text-4xl md:text-5xl">vs</motion.span>
          <div className="h-[1px] w-14 bg-white/70 mt-1" />
        </span>
        <motion.span animate={{ textShadow: [
          "0 0 25px rgba(220,38,38,0.6)",
          "0 0 45px rgba(220,38,38,0.8)",
          "0 0 25px rgba(220,38,38,0.6)"
        ] }} transition={{ duration: 4, repeat: Infinity }} className="text-red-400">Chine</motion.span>
      </motion.h1>

      {/* Bouton & Toggle fixes en bas */}
      <motion.div
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        <button
          onClick={() => { goToMenu(); playSound("click"); }}
          onMouseEnter={() => playSound("hover")}
          className="px-5 py-2 rounded-full border border-white/30 bg-white/5 hover:bg-white/10 text-sm backdrop-blur transition"
        >
          Découvrir
        </button>
        <VerticalToggle dir={scrollDir} />
      </motion.div>
    </section>
  );
}

function VerticalToggle({ dir }) {
  const [y, setY] = useState(0);
  useEffect(() => {
    setY(dir === "down" ? 22 : -22);
  }, [dir]);
  return (
    <div
      className={`relative h-12 w-7 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm overflow-hidden shadow-inner ring-1 ${
        dir === "down" ? "ring-blue-400/40" : "ring-red-400/40"
      }`}
    >
      <motion.div
        animate={{ y, backgroundColor: dir === "down" ? "rgba(56,189,248,0.9)" : "rgba(248,113,113,0.9)" }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full shadow-[0_0_18px_rgba(255,255,255,0.4)]"
      />
      <div className="absolute inset-x-1 top-1 h-[2px] bg-white/20" />
      <div className="absolute inset-x-1 bottom-1 h-[2px] bg-white/20" />
    </div>
  );
}

const MenuSection = React.forwardRef(function MenuSection(_, ref) {
  const items = [
    { to: "/context", title: "Contexte", desc: "Pourquoi tout a changé" },
    { to: "/usa", title: "USA", desc: "Onshoring & Friend-shoring" },
    { to: "/china", title: "Chine", desc: "Nœud manufacturier" },
    { to: "/asia", title: "Reste de l’Asie", desc: "Stratégie China+1" },
    { to: "/case-study", title: "Étude de cas", desc: "Industries critiques" },
    { to: "/conclusion", title: "Conclusion", desc: "Ce qui se dessine" },
  ];

  return (
    <section ref={ref} className="relative py-20 bg-[#0b0f19]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-center text-xl tracking-wide text-white/60 mb-8">Explorer</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <MenuCard key={item.to} {...item} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
});

function MenuCard({ to, title, desc, index }) {
  return (
    <NavLink
      to={to}
      className="group block rounded-2xl bg-white/5 border border-white/10 ring-1 ring-white/15 hover:ring-white/25 p-5 transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 shadow-[0_0_20px_0_rgba(255,255,255,0.12)]"
    >
      <div className="flex items-start gap-4">
        <div className="min-w-[40px] h-[40px] grid place-items-center rounded-xl border border-white/20 text-white/70 font-semibold">
          {String(index).padStart(2, "0")}
        </div>
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-white/70 text-sm mt-1">{desc}</p>
        </div>
        <span className="ml-auto opacity-0 group-hover:opacity-100 transition pt-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </NavLink>
  );
}

function Footer() {
  return (
    <footer className="py-14 text-center text-sm text-white/60">
      <p>© 2025 — Page d’accueil immersive · Pas de navbar · Navigation par menu</p>
    </footer>
  );
}
