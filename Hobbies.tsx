import { motion } from "framer-motion";
import { PageTransition } from "../components/Chrome";
import { Reveal } from "../components/Sections";
import { MediaTile } from "../components/Media";
import { MaskReveal, RunningText } from "../components/Typography";
import { useSite } from "../context/SiteContext";

export default function Hobbies() {
  const { data } = useSite();

  return (
    <PageTransition>
      <div className="page-wrapper">
        <div className="page-hero page-hero-tall" data-bg-word="FUN">
          <div className="wrap">
            <motion.span className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>Off the Clock</motion.span>
            <div className="page-h1-wrap">
              <MaskReveal delay={0.16} duration={0.8}>
                <h1 className="page-h1-big">Hobbies</h1>
              </MaskReveal>
            </div>
            <motion.p className="page-subtitle page-subtitle-stagger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              What I do for fun tends to look a lot like what I do for work, just with less of a deadline.
            </motion.p>
          </div>
        </div>
        <RunningText text="CONTENT · DESIGN · AI · MUSIC · PHOTOGRAPHY ·" direction="left" className="page-runner" />

        <div className="wrap page-content">
          <div className="hob-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", maxWidth: 1000, margin: "0 auto" }}>
            {data.hobbies.map((h, i) => (
              <Reveal key={h.id} delay={i * 0.12}>
                <motion.div
                  className="hob-card-full"
                  whileHover={{ y: -12, boxShadow: "0 40px 80px rgba(20,20,22,0.18)", transition: { type: "spring", stiffness: 260, damping: 20 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="hob-image-full">
                    <MediaTile item={h.media} alt={h.title} className="hob-bg" kenBurns active />
                    <motion.div
                      className="hob-overlay"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.span
                        className="hob-tab"
                        initial={{ y: 10, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.12 + 0.2 }}
                        viewport={{ once: true }}
                      >
                        {h.tab}
                      </motion.span>
                      <motion.h3
                        initial={{ y: 16, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.12 + 0.3, type: "spring" }}
                        viewport={{ once: true }}
                      >
                        {h.title}
                      </motion.h3>
                    </motion.div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
