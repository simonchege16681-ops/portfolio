import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageTransition } from "../components/Chrome";
import { Reveal } from "../components/Sections";
import { SplitText, RunningText, CountUp } from "../components/Typography";
import { useSite } from "../context/SiteContext";

function ExpIcon({ name }: { name: string }) {
  const c = { className: "exp-icon", viewBox: "0 0 24 24", fill: "none" } as const;
  if (name === "code") return <svg {...c}><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "ai")   return <svg {...c}><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" /></svg>;
  if (name === "ui")   return <svg {...c}><path d="M4 19.5V6a2 2 0 012-2h8l6 6v9.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 4v5a1 1 0 001 1h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
  return <svg {...c}><path d="M4 17V7a2 2 0 012-2h9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.6" /><path d="M17 9.5l4-2v9l-4-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}

const STATS = [
  { to: 6, suffix: "+", label: "Projects Shipped" },
  { to: 3, suffix: "yrs", label: "Building Independently" },
  { to: 4, suffix: "", label: "Core Disciplines" },
  { to: 100, suffix: "%", label: "Self-Taught" },
];

export default function Expertise() {
  const { data } = useSite();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <PageTransition>
      <div className="page-wrapper">
        <div className="page-hero page-hero-tall" data-bg-word="SKILLS">
          <div className="wrap">
            <motion.span className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              Skills
            </motion.span>
            <h1 className="page-h1-big" style={{ marginTop: 12 }}>
              <SplitText text="Expertise" delay={0.15} stagger={0.06} effect="flip" className="page-split-h1" />
            </h1>
            <motion.p className="page-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
              Building across several lanes since day one. Click a card for more.
            </motion.p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="expertise-stats-strip">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="expertise-stat"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 24 }}
            >
              <div className="expertise-stat-num">
                <CountUp to={s.to} suffix={s.suffix} duration={1.6} delay={i * 0.12} />
              </div>
              <div className="expertise-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <RunningText text="WEB DEV · AI TOOLS · UI/UX · MOTION · CONTENT ·" direction="right" className="page-runner" />

        <div className="wrap page-content">
          <div className="exp-grid" style={{ maxWidth: 860, margin: "0 auto" }}>
            {data.expertise.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.1}>
                <motion.div
                  className={`exp-card${open === e.id ? " open" : ""}`}
                  onClick={() => setOpen(open === e.id ? null : e.id)}
                  whileHover={{ y: -8, boxShadow: "0 32px 64px rgba(20,20,22,0.1)", transition: { type: "spring", stiffness: 300, damping: 22 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div whileHover={{ rotate: 14, scale: 1.2 }} transition={{ type: "spring", stiffness: 420 }}>
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
                        transition={{ duration: 0.42, ease: [0.16, 0.8, 0.24, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <ul className="exp-list">
                          {e.more.map((m) => <li key={m}>{m}</li>)}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="exp-more">{open === e.id ? "Less detail" : "More detail"} →</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
