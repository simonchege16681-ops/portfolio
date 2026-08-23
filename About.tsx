import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/Chrome";
import { Reveal } from "../components/Sections";
import { MaskReveal, ScrambleText, RunningText, StaggerWords } from "../components/Typography";
import { useSite } from "../context/SiteContext";

export default function About() {
  const { data } = useSite();

  return (
    <PageTransition>
      <div className="page-wrapper">
        <div className="page-hero page-hero-tall" data-bg-word="ABOUT">
          <div className="wrap">
            <motion.span className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              Journey
            </motion.span>
            {/* Mask-reveal headline */}
            <div className="page-h1-wrap">
              <MaskReveal delay={0.14} duration={0.85} className="page-h1-mask">
                <h1 className="page-h1-big">How</h1>
              </MaskReveal>
              <MaskReveal delay={0.28} duration={0.85} className="page-h1-mask">
                <h1 className="page-h1-big page-h1-ghost">I got here.</h1>
              </MaskReveal>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ maxWidth: 560, marginTop: 24 }}>
              <StaggerWords text={data.about.intro} className="page-subtitle-stagger" delay={0.55} stagger={0.018} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <Link to="/contact" className="pill-btn" style={{ marginTop: 32, display: "inline-flex" }}>
                Get in touch ↗
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scramble running label */}
        <div className="wrap" style={{ paddingTop: 12, paddingBottom: 4 }}>
          <ScrambleText text="— TIMELINE OF EVENTS —" className="page-scramble-label" delay={0.2} />
        </div>

        <RunningText text="JOURNEY · GROWTH · BUILDING · LEARNING · NAIROBI ·" direction="left" className="page-runner" />

        <div className="wrap page-content">
          <div className="timeline timeline-full" style={{ paddingLeft: 52 }}>
            <div className="timeline-track" />
            <div className="timeline-progress" style={{ height: "100%" }} />
            {data.timeline.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1} y={36}>
                <div className="t-node visible" style={{ paddingLeft: 0 }}>
                  <span className="t-dot" style={{ left: -52 }} />
                  <span className="t-tag mono">{t.tag}</span>
                  <h3 className="t-node-h">{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
