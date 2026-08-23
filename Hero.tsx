import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useSite } from "../context/SiteContext";
import { MediaSlideshow } from "./Media";
import {
  SplitText, TypewriterText, RunningText,
  StaggerWords, KineticLine
} from "./Typography";

export function Hero() {
  const { data } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const parallaxY = useSpring(rawY, { stiffness: 80, damping: 22 });
  const nameScale   = useTransform(scrollYProgress, [0, 0.5], [1, 0.86]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bgShift     = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <section className="hero" id="home" ref={ref}>
      {/* Subtle moving gradient bg */}
      <motion.div className="hero-bg" style={{ backgroundPositionY: bgShift }} />

      {/* Parallax portrait */}
      <motion.div className="hero-photo" style={{ y: parallaxY }}>
        <MediaSlideshow
          slides={data.hero.slides}
          intervalMs={data.slideSpeed}
          className="hero-slideshow"
          tileClassName="hero-slideshow-tile"
          alt={data.siteTitle}
        />
      </motion.div>

      {/* Eyebrow pill */}
      <motion.div
        className="eyebrow-pill"
        initial={{ opacity: 0, y: 28, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 2.1, duration: 0.7, type: "spring", stiffness: 260, damping: 22 }}
      >
        🌐 {data.hero.eyebrow.replace(/^[^\s]+\s*/, "")}
      </motion.div>

      {/* Big hero name — per-char SplitText */}
      <motion.h1 className="hero-name" style={{ scale: nameScale, opacity: nameOpacity }}>
        <span className="lo">
          <SplitText text={data.hero.nameLine1} delay={2.2} stagger={0.055} effect="rise" />
        </span>
        {" "}
        <span className="ghost">
          <SplitText text={data.hero.nameLine2} delay={2.42} stagger={0.06} effect="fall" />
        </span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="hero-tagline"
        initial={{ opacity: 0, x: 44 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.7, duration: 0.8, ease: [0.16, 0.8, 0.24, 1] }}
      >
        <motion.span
          className="cue"
          aria-hidden="true"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >↘</motion.span>
        {data.hero.tagline}
      </motion.p>

      {/* Hero foot */}
      <motion.div
        className="hero-foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.9 }}
      >
        <span>Creative Technologist</span>
        <span className="hero-foot-typewriter">
          <TypewriterText lines={["Scroll to explore", "Nairobi, Kenya", "Est. 2022"]} speed={60} pauseMs={1200} />
        </span>
        <span>@official_simonchege</span>
      </motion.div>
    </section>
  );
}

export function Gallery() {
  const { data } = useSite();
  const slides = data.gallery.slides;
  const rotate = (offset: number) => {
    if (!slides.length) return [];
    return Array.from({ length: slides.length }, (_, i) => slides[(i + offset) % slides.length]);
  };
  const third = Math.max(1, Math.floor(slides.length / 3));
  const cards = [
    { cls: "g1", rot: -9, offset: 0 },
    { cls: "g2", rot: 0,  offset: third },
    { cls: "g3", rot: 9,  offset: third * 2 },
  ];

  return (
    <section className="gallery">
      {/* KineticLine quote — wave on hover */}
      <div className="gallery-quote" aria-hidden="true">
        <KineticLine text={data.gallery.quote} className="gallery-quote-kinetic" />
      </div>

      <div className="gallery-inner">
        {cards.map(({ cls, rot, offset }, i) => (
          <motion.div
            key={cls}
            className={`gallery-photo ${cls}`}
            initial={{ opacity: 0, rotate: rot * 0.3, y: 80, scale: 0.84 }}
            whileInView={{ opacity: 1, rotate: rot, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ delay: i * 0.15, duration: 1.0, type: "spring", stiffness: 160, damping: 22 }}
            whileHover={{ rotate: rot * 1.7, y: -20, scale: 1.07, zIndex: 10,
              transition: { type: "spring", stiffness: 260, damping: 18 } }}
            whileTap={{ scale: 0.97 }}
          >
            <MediaSlideshow slides={rotate(offset)} intervalMs={data.slideSpeed} alt={`Gallery ${i + 1}`} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Marquee ── */
const ROW_ONE = "CURIOSITY IS THE WHOLE ENGINE • CHASE WHAT YOU HAVEN'T TRIED YET •";
const ROW_TWO = "IDEAS ARE CHEAP, SHIPPING IS WHAT COUNTS • FINISH THE THING •";

function MarqueeRow({ text, dir }: { text: string; dir: "left" | "right" }) {
  const parts = text.split("•");
  const chunk = (
    <span>
      {parts.map((p, i) => (
        <span key={i}>
          {p.trim()}
          {i < parts.length - 1 && <span className="dot"> • </span>}
        </span>
      ))}
    </span>
  );
  return (
    <div className={`marquee-row dir-${dir}`}>
      <div className="marquee-track">{chunk}{chunk}{chunk}{chunk}</div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="marquee-band">
      <MarqueeRow text={ROW_ONE} dir="left" />
      <MarqueeRow text={ROW_TWO} dir="right" />
    </div>
  );
}

/* ── Intro with word reveal + running text ── */
export function Intro() {
  const { data } = useSite();
  return (
    <section className="intro-copy">
      {/* Massive running text above */}
      <RunningText text="BUILDING · SHIPPING · ITERATING · NAIROBI ·" direction="left" className="intro-runner" />

      <div className="wrap intro-copy-inner">
        <StaggerWords
          text={data.introText}
          className="reveal-words"
          delay={0.05}
          stagger={0.025}
        />
        <div style={{ marginTop: 20 }}>
          <StaggerWords
            text={data.introSmallText}
            className="reveal-words small"
            delay={0.1}
            stagger={0.03}
          />
        </div>
      </div>

      <RunningText text="CURIOSITY · CRAFT · CODE · CREATIVITY ·" direction="right" className="intro-runner intro-runner-b" />
    </section>
  );
}
