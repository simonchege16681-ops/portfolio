import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { useScrolled } from "../hooks";

/* ─────────────────────────────────────────────────────────────────────
   GREETINGS in 30+ languages — rapid-fire flash sequence
   ───────────────────────────────────────────────────────────────────── */
const GREETINGS = [
  { word: "你好",          lang: "Chinese"      },
  { word: "HELLO",         lang: "English"      },
  { word: "مرحبا",         lang: "Arabic"       },
  { word: "नमस्ते",        lang: "Hindi"        },
  { word: "HOLA",          lang: "Spanish"      },
  { word: "BONJOUR",       lang: "French"       },
  { word: "CIAO",          lang: "Italian"      },
  { word: "OLÁ",           lang: "Portuguese"   },
  { word: "HALLO",         lang: "German"       },
  { word: "ПРИВЕТ",        lang: "Russian"      },
  { word: "こんにちは",     lang: "Japanese"     },
  { word: "안녕하세요",     lang: "Korean"       },
  { word: "مرحبا",         lang: "Urdu"         },
  { word: "SAWUBONA",      lang: "Zulu"         },
  { word: "HABARI",        lang: "Swahili"      },
  { word: "SANNU",         lang: "Hausa"        },
  { word: "AKWAABA",       lang: "Twi"          },
  { word: "JAMBO",         lang: "Kiswahili"    },
  { word: "สวัสดี",        lang: "Thai"         },
  { word: "XIN CHÀO",      lang: "Vietnamese"   },
  { word: "MERHABA",       lang: "Turkish"      },
  { word: "SHALOM",        lang: "Hebrew"       },
  { word: "ΓΕΙΑ ΣΑΣ",      lang: "Greek"        },
  { word: "HEJ",           lang: "Swedish"      },
  { word: "GOD DAG",       lang: "Norwegian"    },
  { word: "SELAM",         lang: "Amharic"      },
  { word: "DUMELA",        lang: "Sesotho"      },
  { word: "KARIBU",        lang: "Swahili"      },
  { word: "CZEŚĆ",         lang: "Polish"       },
  { word: "AHOJ",          lang: "Czech"        },
  { word: "SALAM",         lang: "Azerbaijani"  },
  { word: "TUNGJATJETA",   lang: "Albanian"     },
  { word: "I'M SIMON.",    lang: "Nairobi, KE"  },
];

/* Duration of each flash (ms) — starts fast, slows to stop */
function getFlashDuration(i: number, total: number): number {
  const pct = i / (total - 1);
  // exponential slow-down: 55ms at start → 320ms at end
  return Math.round(55 + (320 - 55) * Math.pow(pct, 2.4));
}

export function Preloader() {
  const [idx,   setIdx]   = useState(0);
  const [phase, setPhase] = useState<"greet" | "hold" | "out" | "gone">("greet");

  /* ---- drive the greeting flash sequence ---- */
  useEffect(() => {
    let totalElapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    GREETINGS.forEach((_, i) => {
      const dur = getFlashDuration(i, GREETINGS.length);
      const t = setTimeout(() => {
        setIdx(i);
        if (i === GREETINGS.length - 1) {
          // reached final "I'M SIMON." — hold, then exit
          const h = setTimeout(() => setPhase("hold"), 80);
          const o = setTimeout(() => setPhase("out"),  1000);
          const g = setTimeout(() => setPhase("gone"), 2000);
          timers.push(h, o, g);
        }
      }, totalElapsed);
      timers.push(t);
      totalElapsed += dur;
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "gone") return null;

  const current = GREETINGS[idx];
  const isFinal = idx === GREETINGS.length - 1;
  const isRTL   = ["Arabic", "Hebrew", "Urdu"].includes(current.lang);

  return (
    <motion.div
      className="preloader"
      animate={phase === "out" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Progress bar — fills as greetings advance */}
      <div className="preloader-track">
        <motion.div
          className="preloader-bar"
          animate={{ scaleX: (idx + 1) / GREETINGS.length }}
          transition={{ duration: 0.12, ease: "linear" }}
        />
      </div>

      {/* Greeting counter */}
      <div className="preloader-counter">
        <span className="preloader-count-cur">{String(idx + 1).padStart(2, "0")}</span>
        <span className="preloader-count-sep">/</span>
        <span className="preloader-count-tot">{GREETINGS.length}</span>
      </div>

      {/* Main greeting word */}
      <div className="preloader-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            className={`preloader-greeting${isFinal ? " is-final" : ""}`}
            dir={isRTL ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: isFinal ? 0 : 36, scale: isFinal ? 0.92 : 1, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{   opacity: 0, y: isFinal ? 0 : -28, scale: 0.96, filter: "blur(4px)" }}
            transition={
              isFinal
                ? { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }
                : { duration: 0.09, ease: "linear" }
            }
          >
            {current.word}
          </motion.div>
        </AnimatePresence>

        {/* Language label */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`lang-${idx}`}
            className="preloader-lang"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.55, y: 0 }}
            exit={{   opacity: 0,   y: -6 }}
            transition={{ duration: 0.08 }}
          >
            {current.lang}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Simon tagline — only visible on final hold */}
      <motion.div
        className="preloader-tagline"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: phase === "hold" ? 1 : 0, y: phase === "hold" ? 0 : 16 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        Creative Technologist&nbsp;·&nbsp;Nairobi, Kenya
      </motion.div>

      {/* Big decorative index number top-right */}
      <div className="preloader-bg-num" aria-hidden="true">
        {String(idx + 1).padStart(2, "0")}
      </div>
    </motion.div>
  );
}

export function CursorBubble() {
  const elRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("View");
  const rafRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const isPanel = !!t?.closest(".panel, .hob-card, .gallery-photo, .hob-card-full");
      const isBtn = !!t?.closest("button, a");
      setActive(isPanel || isBtn);
      setLabel(isPanel ? "View" : isBtn ? "Go" : "View");
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (elRef.current) {
          elRef.current.style.left = `${e.clientX}px`;
          elRef.current.style.top = `${e.clientY}px`;
        }
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <motion.div
      ref={elRef}
      className="cursor-bubble"
      animate={{ scale: active ? 1 : 0.35, opacity: active ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      aria-hidden="true"
    >
      {label}
    </motion.div>
  );
}

function Logo() {
  const { data } = useSite();
  const navigate = useNavigate();
  const parts = data.siteTitle.split(" ");
  const first = parts[0] ? `${parts[0]} ` : "";
  const rest = parts.slice(1).join(" ");

  const makeLetters = (text: string, accent: boolean) =>
    text.split("").map((ch, i) => (
      <motion.span
        key={i}
        className={`letter${accent ? " accent" : ""}`}
        whileHover={{ y: -8, transition: { type: "spring", stiffness: 700, damping: 16 } }}
        style={{ display: "inline-block" }}
      >
        {ch === " " ? "\u00A0" : ch}
      </motion.span>
    ));

  return (
    <motion.a
      href="/"
      className="logo"
      aria-label={`${data.siteTitle} — home`}
      onClick={(e) => { e.preventDefault(); navigate("/"); }}
      whileTap={{ scale: 0.94 }}
    >
      {makeLetters(first, false)}
      {makeLetters(rest, true)}
    </motion.a>
  );
}

const NAV_ROUTES = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "team", label: "Team", path: "/team" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "expertise", label: "Expertise", path: "/expertise" },
  { id: "hobbies", label: "Hobbies", path: "/hobbies" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export function Nav() {
  const scrolled = useScrolled(40);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const currentId = location.pathname === "/" ? "home" : (location.pathname.slice(1) || "home");

  return (
    <>
      <motion.header
        className={`nav${scrolled ? " scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.9, ease: [0.16, 0.8, 0.24, 1] }}
      >
        <Logo />
        <nav className="pills">
          {NAV_ROUTES.map((l) => (
            <div key={l.id} style={{ position: "relative" }}>
              {currentId === l.id && (
                <motion.span
                  className="nav-active-bg"
                  layoutId="nav-pill-active"
                  transition={{ type: "spring", stiffness: 400, damping: 36 }}
                />
              )}
              <Link to={l.path} className={`nav-link${currentId === l.id ? " active" : ""}`}>
                {l.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="nav-right">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}>
            <Link className="pill-btn nav-cta" to="/contact">Let's talk</Link>
          </motion.div>
          <motion.button
            className="burger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88, rotate: 10 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu open"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.button
              className="mobile-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              whileTap={{ scale: 0.85, rotate: 90 }}
              transition={{ type: "spring", stiffness: 500 }}
            >✕</motion.button>
            {NAV_ROUTES.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.12, type: "spring", stiffness: 320, damping: 26 }}
              >
                <Link to={l.path} className="mobile-link" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
        transition={{ duration: 0.5, ease: [0.16, 0.8, 0.24, 1] }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
