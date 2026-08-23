import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageTransition } from "../components/Chrome";
import { Reveal } from "../components/Sections";
import { MaskReveal, GlitchText, RunningText, ScrambleText } from "../components/Typography";
import { useSite } from "../context/SiteContext";

export default function Projects() {
  const { data } = useSite();
  const [open, setOpen] = useState<string | null>(data.projects[0]?.id ?? null);

  return (
    <PageTransition>
      <div className="page-wrapper">
        <div className="page-hero page-hero-tall" data-bg-word="WORK">
          <div className="wrap">
            <motion.span className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              Selected Work
            </motion.span>
            <div className="page-h1-wrap">
              <MaskReveal delay={0.14} duration={0.8}>
                <h1 className="page-h1-big">
                  <GlitchText text="Projects" className="page-glitch-h1" />
                </h1>
              </MaskReveal>
            </div>
            <motion.p className="page-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              A few things I've built recently. Click a row for more detail.
            </motion.p>
          </div>
        </div>

        <RunningText text="WOOZA · NEXUS · CSCO · LEARNROBOTICS · SUMMIT TRADES ·" direction="left" className="page-runner" />

        <div className="wrap page-content">
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="wrap" style={{ paddingBottom: 16 }}>
              <ScrambleText text="— CLICK TO EXPAND —" className="page-scramble-label" delay={0.3} />
            </div>
            {data.projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.07}>
                <motion.div
                  className={`proj-row${open === p.id ? " open" : ""}`}
                  onClick={() => setOpen(open === p.id ? null : p.id)}
                  whileHover={{ paddingLeft: "18px", backgroundColor: "rgba(20,20,22,0.025)" }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="proj-top">
                    <div className="proj-title">
                      <motion.span className="proj-index mono"
                        animate={{ opacity: open === p.id ? 1 : 0.45 }}
                      >{p.index}</motion.span>
                      {" "}
                      <span className={open === p.id ? "proj-name-active" : ""}>{p.name}</span>
                    </div>
                    <motion.span
                      className="proj-plus"
                      animate={{ rotate: open === p.id ? 45 : 0, borderColor: open === p.id ? "var(--gold)" : "var(--line-strong)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 26 }}
                    />
                  </div>
                  <motion.div className="proj-tags mono"
                    animate={{ color: open === p.id ? "var(--gold)" : "var(--fg-faint-solid)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {p.tags}
                  </motion.div>
                  <AnimatePresence initial={false}>
                    {open === p.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 0.8, 0.24, 1] }}
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
      </div>
    </PageTransition>
  );
}
