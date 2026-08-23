/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║   SIMON CHEGE — TYPOGRAPHY ANIMATION ENGINE v3                  ║
 * ║   Bold. Expressive. Cinematic.                                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";

/* ── shared easing ── */
const E = {
  expo:   [0.76, 0,    0.24, 1] as [number,number,number,number],
  bounce: [0.34, 1.56, 0.64, 1] as [number,number,number,number],
  soft:   [0.16, 0.8,  0.24, 1] as [number,number,number,number],
};

/* ── scramble character pool ── */
const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?";
const pick  = () => POOL[Math.floor(Math.random() * POOL.length)];

/* ══════════════════════════════════════════════════════════════════
   1.  SPLIT CHAR  –  each character enters independently
       Effects: rise | fall | flip | zoom | swing | blur
   ══════════════════════════════════════════════════════════════════ */
type Effect = "rise" | "fall" | "flip" | "zoom" | "swing" | "blur";

const FX: Record<Effect, { h: object; v: object }> = {
  rise:  { h: { y: "115%", opacity: 0 },              v: { y: "0%",  opacity: 1 } },
  fall:  { h: { y: "-115%", opacity: 0 },             v: { y: "0%",  opacity: 1 } },
  flip:  { h: { rotateX: 95, opacity: 0, z: -80 },   v: { rotateX: 0,  opacity: 1, z: 0 } },
  zoom:  { h: { scale: 0.2, opacity: 0, y: 20 },     v: { scale: 1,    opacity: 1, y: 0 } },
  swing: { h: { rotate: -22, y: 60, opacity: 0 },     v: { rotate: 0,   y: 0,       opacity: 1 } },
  blur:  { h: { filter: "blur(18px)", opacity: 0, y: 30 }, v: { filter: "blur(0px)", opacity: 1, y: 0 } },
};

export function SplitChar({
  text,
  className = "",
  delay     = 0,
  stagger   = 0.038,
  effect    = "rise" as Effect,
  once      = true,
  bold      = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  effect?: Effect;
  once?: boolean;
  bold?: boolean;
}) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once, amount: 0.45 });
  const fx     = FX[effect];

  return (
    <span
      ref={ref}
      className={`sc-split ${bold ? "sc-bold" : ""} ${className}`}
      aria-label={text}
      style={{ display: "inline-flex", flexWrap: "wrap" as const, perspective: 600 }}
    >
      {text.split("").map((ch, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block", lineHeight: 1 }}>
          <motion.span
            style={{ display: "inline-block", lineHeight: "inherit" }}
            initial={fx.h as any}
            animate={inView ? fx.v as any : fx.h as any}
            transition={{
              delay:     delay + i * stagger,
              type:      "spring",
              stiffness: 340,
              damping:   30,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Alias so existing imports don't break */
export const SplitText = SplitChar;

/* ══════════════════════════════════════════════════════════════════
   2.  MASK REVEAL  –  text slides up from behind solid clipping wall
   ══════════════════════════════════════════════════════════════════ */
export function MaskReveal({
  children,
  className = "",
  delay     = 0,
  duration  = 0.82,
  once      = true,
}: {
  children:  React.ReactNode;
  className?: string;
  delay?:    number;
  duration?: number;
  once?:     boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once, amount: 0.55 });

  return (
    <div ref={ref} className={`mask-reveal-wrap ${className}`} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ y: "105%", skewY: 3 }}
        animate={inView ? { y: "0%", skewY: 0 } : { y: "105%", skewY: 3 }}
        transition={{ delay, duration, ease: E.expo }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3.  WORD STAGGER  –  words spring in with rotate + blur
   ══════════════════════════════════════════════════════════════════ */
export function StaggerWords({
  text,
  className = "",
  delay     = 0,
  stagger   = 0.065,
  once      = true,
}: {
  text:      string;
  className?: string;
  delay?:    number;
  stagger?:  number;
  once?:     boolean;
}) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once, amount: 0.35 });

  return (
    <span
      ref={ref}
      className={`stagger-words ${className}`}
      style={{ display: "inline-flex", flexWrap: "wrap" as const, gap: "0 0.3em" }}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
          <motion.span
            style={{ display: "inline-block", transformOrigin: "bottom center" }}
            initial={{ y: "112%", opacity: 0, rotate: 5, filter: "blur(4px)" }}
            animate={
              inView
                ? { y: "0%", opacity: 1, rotate: 0, filter: "blur(0px)" }
                : { y: "112%", opacity: 0, rotate: 5, filter: "blur(4px)" }
            }
            transition={{
              delay:     delay + i * stagger,
              type:      "spring",
              stiffness: 260,
              damping:   26,
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4.  GLITCH TEXT  –  RGB-split scanline glitch
   ══════════════════════════════════════════════════════════════════ */
export function GlitchText({
  text,
  className = "",
  alwaysOn  = false,
}: {
  text:      string;
  className?: string;
  alwaysOn?: boolean;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!alwaysOn) return;
    const fire = () => {
      setOn(true);
      setTimeout(() => setOn(false), 280 + Math.random() * 140);
    };
    fire();
    const id = setInterval(fire, 3000 + Math.random() * 1200);
    return () => clearInterval(id);
  }, [alwaysOn]);

  return (
    <span
      className={`glitch-text ${on ? "glitching" : ""} ${className}`}
      data-text={text}
      onMouseEnter={() => !alwaysOn && setOn(true)}
      onMouseLeave={() => !alwaysOn && setOn(false)}
    >
      {text}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   5.  SCRAMBLE TEXT  –  letters resolve from random noise
   ══════════════════════════════════════════════════════════════════ */
export function ScrambleText({
  text,
  className = "",
  delay     = 0,
  speed     = 35,
}: {
  text:      string;
  className?: string;
  delay?:    number;
  speed?:    number;
}) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [display, setDisplay] = useState(text.replace(/\S/g, "░"));

  useEffect(() => {
    if (!inView) return;
    let iter   = 0;
    const total = text.length * 2.8;
    const start = Date.now() + delay * 1000;
    const id = setInterval(() => {
      if (Date.now() < start) return;
      const p = Math.min(iter / total, 1);
      setDisplay(
        text.split("").map((ch, i) =>
          ch === " " ? " " : i < Math.floor(p * text.length) ? ch : pick()
        ).join("")
      );
      iter++;
      if (p >= 1) { setDisplay(text); clearInterval(id); }
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, delay, speed]);

  return (
    <span ref={ref} className={`scramble-text ${className}`} aria-label={text}>
      {display}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   6.  TYPEWRITER  –  types → pauses → deletes → next line
   ══════════════════════════════════════════════════════════════════ */
export function TypewriterText({
  lines,
  className = "",
  speed     = 55,
  pauseMs   = 1400,
}: {
  lines:     string[];
  className?: string;
  speed?:    number;
  pauseMs?:  number;
}) {
  const [li, setLi]  = useState(0);
  const [ci, setCi]  = useState(0);
  const [del, setDel] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) {
      const t = setTimeout(() => { setPause(false); setDel(true); }, pauseMs);
      return () => clearTimeout(t);
    }
    const cur = lines[li];
    const t = setTimeout(() => {
      if (!del) {
        if (ci < cur.length) setCi((c) => c + 1);
        else setPause(true);
      } else {
        if (ci > 0) setCi((c) => c - 1);
        else { setDel(false); setLi((l) => (l + 1) % lines.length); }
      }
    }, del ? speed * 0.45 : speed);
    return () => clearTimeout(t);
  }, [ci, del, li, lines, pause, pauseMs, speed]);

  return (
    <span className={`typewriter-text ${className}`}>
      {lines[li].slice(0, ci)}
      <span className="typewriter-caret" aria-hidden="true">|</span>
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   7.  ROTATING WORDS  –  vertical slide swap with skew
   ══════════════════════════════════════════════════════════════════ */
export function RotatingWords({
  prefix   = "",
  words,
  className = "",
  interval  = 2400,
}: {
  prefix?:   string;
  words:     string[];
  className?: string;
  interval?:  number;
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className={`rotating-words ${className}`}>
      {prefix && <span className="rotating-prefix">{prefix} </span>}
      <span className="rotating-slot" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0, skewY: 8  }}
            animate={{ y: "0%",  opacity: 1, skewY: 0  }}
            exit={{   y: "-110%", opacity: 0, skewY: -6 }}
            transition={{ duration: 0.48, ease: E.expo }}
          >
            {words[idx]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   8.  COUNT UP  –  animated number when in view
   ══════════════════════════════════════════════════════════════════ */
export function CountUp({
  to,
  suffix   = "",
  prefix   = "",
  duration  = 1.8,
  delay     = 0,
  className = "",
}: {
  to:        number;
  suffix?:   string;
  prefix?:   string;
  duration?:  number;
  delay?:    number;
  className?: string;
}) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const tick  = (now: number) => {
      const p = Math.min(Math.max(0, now - start) / (duration * 1000), 1);
      setVal(Math.round((1 - Math.pow(1 - p, 4)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}{val.toLocaleString()}{suffix}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   9.  KINETIC LINE  –  hover ripple-wave per character
   ══════════════════════════════════════════════════════════════════ */
export function KineticLine({
  text,
  className = "",
}: {
  text:      string;
  className?: string;
}) {
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [active,   setActive]   = useState(false);

  const waveY = (i: number) => {
    if (!active || hoverIdx < 0) return 0;
    const d = Math.abs(i - hoverIdx);
    if (d > 6) return 0;
    return -(24 - d * 3.8);
  };

  const waveScale = (i: number) => {
    if (!active || hoverIdx < 0) return 1;
    const d = Math.abs(i - hoverIdx);
    return d === 0 ? 1.18 : d < 3 ? 1.06 : 1;
  };

  return (
    <span
      className={`kinetic-line ${className}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => { setActive(false); setHoverIdx(-1); }}
      aria-label={text}
      style={{ display: "inline-flex", flexWrap: "wrap" as const }}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          onHoverStart={() => setHoverIdx(i)}
          style={{ display: "inline-block", cursor: "default" }}
          animate={{ y: waveY(i), scale: waveScale(i) }}
          transition={{ type: "spring", stiffness: 550, damping: 18 }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   10.  RUNNING TEXT  –  parallax scroll-driven giant italic line
   ══════════════════════════════════════════════════════════════════ */
export function RunningText({
  text,
  className  = "",
  direction  = "left" as "left" | "right",
  speed      = 6,
}: {
  text:       string;
  className?:  string;
  direction?:  "left" | "right";
  speed?:     number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(
    scrollYProgress, [0, 1],
    direction === "left" ? [`${speed}%`, `-${speed}%`] : [`-${speed}%`, `${speed}%`]
  );
  const smooth = useSpring(x, { stiffness: 60, damping: 22 });

  return (
    <div ref={ref} className={`running-text-wrap ${className}`} aria-hidden="true">
      <motion.div className="running-text-inner" style={{ x: smooth }}>
        {text}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   11.  MAGNETIC LETTER  –  follows cursor magnetically
   ══════════════════════════════════════════════════════════════════ */
export function MagneticText({
  text,
  className = "",
  strength  = 28,
}: {
  text:      string;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const sx  = useSpring(mx, { stiffness: 220, damping: 18 });
  const sy  = useSpring(my, { stiffness: 220, damping: 18 });

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    mx.set((e.clientX - cx) / r.width  * strength);
    my.set((e.clientY - cy) / r.height * strength);
  }, [mx, my, strength]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.span
      ref={ref}
      className={`magnetic-text ${className}`}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {text}
    </motion.span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   12.  OUTLINE FILL  –  stroke → fill driven by scroll progress
   ══════════════════════════════════════════════════════════════════ */
export function OutlineFill({
  text,
  className = "",
}: {
  text:      string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.35, 0.7, 1]);
  const scale   = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const blur    = useTransform(scrollYProgress, [0, 0.5, 1], [6, 2, 0]);

  return (
    <motion.div
      ref={ref}
      className={`outline-fill-wrap ${className}`}
      style={{ opacity, scale }}
      aria-label={text}
    >
      <motion.span
        className="outline-fill-base"
        aria-hidden="true"
        style={{ filter: `blur(${blur.get()}px)` }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   13.  HIGHLIGHT SWEEP  –  word underline sweeps on view
   ══════════════════════════════════════════════════════════════════ */
export function HighlightSweep({
  text,
  className = "",
  color     = "var(--highlight)",
  delay     = 0,
}: {
  text:      string;
  className?: string;
  color?:    string;
  delay?:    number;
}) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.6 });

  return (
    <span ref={ref} className={`highlight-sweep ${className}`} style={{ position: "relative", display: "inline-block" }}>
      {text}
      <motion.span
        className="highlight-bar"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay, duration: 0.6, ease: E.expo }}
        style={{ background: color, transformOrigin: "left" }}
      />
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   14.  BIG DISPLAY WORD  –  huge weighted word with entrance
         Perfect for section openers
   ══════════════════════════════════════════════════════════════════ */
export function DisplayWord({
  text,
  className  = "",
  delay       = 0,
  variant     = "solid" as "solid" | "outline" | "split",
}: {
  text:       string;
  className?:  string;
  delay?:     number;
  variant?:   "solid" | "outline" | "split";
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className={`display-word display-word--${variant} ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block" }}>
          <motion.span
            className={`dw-char dw-char--${i % 2 === 0 ? "even" : "odd"}`}
            style={{ display: "inline-block" }}
            initial={{ y: i % 2 === 0 ? "120%" : "-120%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : { y: i % 2 === 0 ? "120%" : "-120%", opacity: 0 }}
            transition={{
              delay:     delay + i * 0.045,
              type:      "spring",
              stiffness: 300,
              damping:   28,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
