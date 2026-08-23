import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { NAV_LINKS } from "../defaultData";
import { useLongPress } from "../hooks";
import { MediaTile } from "./Media";

/* ---- Reusable reveal wrapper ---- */
export function Reveal({
  children,
  delay = 0,
  y = 48,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay, duration: 0.7, type: "spring", stiffness: 200, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}

export function Stack() {
  const { data } = useSite();
  return (
    <section className="stack">
      <div className="wrap">
        <Reveal className="stack-head">
          <span className="eyebrow">Start Here</span>
          <h2>What I do, in four parts.</h2>
        </Reveal>
        <div className="stack-grid">
          {data.panels.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <motion.a
                className="panel"
                href={p.href}
                whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                whileTap={{ scale: 0.965 }}
              >
                <span className="panel-tab">{p.tab}</span>
                <div className="panel-image">
                  <MediaTile item={p.media} alt={p.title} className="panel-bg" kenBurns active />
                  <h3 className="panel-title">{p.title}</h3>
                  <span className="touch-hint">Tap to view <span aria-hidden="true">→</span></span>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineNode({ t, i, visible, onVisible }: {
  t: { id: string; tag: string; title: string; body: string };
  i: number;
  visible: boolean;
  onVisible: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) onVisible(); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [onVisible]);

  return (
    <motion.div
      ref={ref}
      className="t-node"
      initial={{ opacity: 0, x: -30 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ delay: i * 0.07, duration: 0.6, type: "spring", stiffness: 220, damping: 26 }}
    >
      <motion.span
        className="t-dot"
        animate={visible ? { scale: [1, 1.6, 1], borderColor: "var(--gold)" } : {}}
        transition={{ duration: 0.5, delay: i * 0.07 + 0.2 }}
      />
      <span className="t-tag mono">{t.tag}</span>
      <h3>{t.title}</h3>
      <p>{t.body}</p>
    </motion.div>
  );
}

function Timeline() {
  const { data } = useSite();
  const [visible, setVisible] = useState<boolean[]>(() => data.timeline.map(() => false));
  const progress = (visible.filter(Boolean).length / Math.max(data.timeline.length, 1)) * 100;

  return (
    <div className="timeline">
      <div className="timeline-track" />
      <motion.div className="timeline-progress" animate={{ height: `${progress}%` }} transition={{ duration: 0.5 }} />
      {data.timeline.map((t, i) => (
        <TimelineNode
          key={t.id}
          t={t}
          i={i}
          visible={!!visible[i]}
          onVisible={() => setVisible((prev) => { if (prev[i]) return prev; const n = [...prev]; n[i] = true; return n; })}
        />
      ))}
    </div>
  );
}

export function About() {
  const { data } = useSite();
  return (
    <section className="page" id="about">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Journey</span>
          <h2>How I got here.</h2>
        </Reveal>
        <div className="about-layout">
          <Reveal className="about-sticky">
            <p>{data.about.intro}</p>
            <motion.a href="/contact" className="pill-btn" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
              Get in touch <span aria-hidden="true">↗</span>
            </motion.a>
          </Reveal>
          <Timeline />
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  const { data } = useSite();
  const [open, setOpen] = useState<string | null>(data.projects[0]?.id ?? null);
  return (
    <section className="page" id="projects">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Selected Work</span>
          <h2>Projects</h2>
          <p>Click a row for detail.</p>
        </Reveal>
        <div>
          {data.projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <motion.div
                className={`proj-row${open === p.id ? " open" : ""}`}
                onClick={() => setOpen(open === p.id ? null : p.id)}
                whileHover={{ paddingLeft: "14px", backgroundColor: "rgba(20,20,22,0.02)" }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.25 }}
              >
                <div className="proj-top">
                  <div className="proj-title">
                    <span className="proj-index mono">{p.index}</span> {p.name}
                  </div>
                  <motion.span
                    className="proj-plus"
                    animate={{ rotate: open === p.id ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  />
                </div>
                <div className="proj-tags mono">{p.tags}</div>
                <AnimatePresence initial={false}>
                  {open === p.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 0.8, 0.24, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="proj-body-inner"><p>{p.body}</p></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpIcon({ name }: { name: string }) {
  const c = { className: "exp-icon", viewBox: "0 0 24 24", fill: "none" } as const;
  if (name === "code") return <svg {...c}><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "ai") return <svg {...c}><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" /></svg>;
  if (name === "ui") return <svg {...c}><path d="M4 19.5V6a2 2 0 012-2h8l6 6v9.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 4v5a1 1 0 001 1h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
  return <svg {...c}><path d="M4 17V7a2 2 0 012-2h9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.6" /><path d="M17 9.5l4-2v9l-4-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}

export function Expertise() {
  const { data } = useSite();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="page" id="expertise">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Skills</span>
          <h2>Expertise</h2>
          <p>Click each card to see more.</p>
        </Reveal>
        <div className="exp-grid">
          {data.expertise.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.09}>
              <motion.div
                className={`exp-card${open === e.id ? " open" : ""}`}
                onClick={() => setOpen(open === e.id ? null : e.id)}
                whileHover={{ y: -8, boxShadow: "0 28px 60px rgba(20,20,22,0.12)", transition: { type: "spring", stiffness: 300, damping: 22 } }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div whileHover={{ rotate: 12, scale: 1.15 }} transition={{ type: "spring", stiffness: 400 }}>
                  <ExpIcon name={e.icon} />
                </motion.div>
                <h3>{e.title}</h3>
                <p>{e.body}</p>
                <AnimatePresence initial={false}>
                  {open === e.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 0.8, 0.24, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <ul className="exp-list">
                        {e.more.map((m) => <li key={m}>{m}</li>)}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="exp-more">{open === e.id ? "Less" : "More detail"} →</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Hobbies() {
  const { data } = useSite();
  return (
    <section className="page" id="hobbies">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Off the Clock</span>
          <h2>Hobbies</h2>
          <p>What I do for fun.</p>
        </Reveal>
        <div className="hob-grid">
          {data.hobbies.map((h, i) => (
            <Reveal key={h.id} delay={i * 0.1}>
              <motion.a
                className="hob-card"
                href="#hobbies"
                whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                whileTap={{ scale: 0.965 }}
              >
                <span className="hob-tab">{h.tab}</span>
                <div className="hob-image">
                  <MediaTile item={h.media} alt={h.title} className="hob-bg" kenBurns active />
                  <h3 className="panel-title">{h.title}</h3>
                  <span className="touch-hint">Tap to view →</span>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { data, openGate } = useSite();
  const [label, setLabel] = useState(data.contact.email);

  useEffect(() => { setLabel(data.contact.email); }, [data.contact.email]);

  const copy = () => {
    navigator.clipboard?.writeText(data.contact.email).then(() => {
      setLabel("Copied!");
      setTimeout(() => setLabel(data.contact.email), 1600);
    });
  };

  const { progress, handlers } = useLongPress(openGate, 1400);

  return (
    <section className="contact-wrap" id="contact">
      <div className="wrap">
        <Reveal className="contact-card">
          <h2>{data.contact.heading}</h2>
          <p>{data.contact.body}</p>
          <motion.button
            className="talk-pill"
            onClick={copy}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(20,20,22,0.13)" }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="talk-email-spacer mono">{data.contact.email}</span>
            <span className="talk-face">→ Let's talk</span>
            <span className="talk-email-visible mono">{label}</span>
          </motion.button>
          <p className="contact-fallback">or <a href={`mailto:${data.contact.email}`}>email me directly</a></p>
          <div className="foot-links">
            <div className="foot-col">
              <span className="lab">Pages</span>
              {NAV_LINKS.map((l) => <Link key={l.id} to={`/${l.id === "home" ? "" : l.id}`}>{l.label}</Link>)}
            </div>
            <div className="foot-col">
              <span className="lab">Socials</span>
              <a href="https://www.instagram.com/official_simonchege" target="_blank" rel="noopener">Instagram</a>
              <a href="mailto:simonchege16681@gmail.com">Email</a>
            </div>
          </div>
        </Reveal>
      </div>
      <motion.button
        className="fine-print-btn"
        {...handlers}
        whileHover={{ letterSpacing: "0.06em" }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span className="fine-print-charge" style={{ scaleX: progress }} />
        © {new Date().getFullYear()} {data.siteTitle}. Built with care in Nairobi.
      </motion.button>
    </section>
  );
}
