import { motion } from "framer-motion";
import { PageTransition } from "../components/Chrome";
import { TeamSection } from "../components/Team";

export default function Team() {
  return (
    <PageTransition>
      <div style={{ paddingTop: 88 }}>
        <div className="page-hero">
          <div className="wrap">
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Behind the work
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 220, damping: 24 }}
            >
              Our Team
            </motion.h1>
            <motion.p
              className="page-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              A crew of builders, makers and storytellers based in Nairobi — each obsessed with doing things properly.
            </motion.p>
          </div>
        </div>
        <TeamSection />
      </div>
    </PageTransition>
  );
}
