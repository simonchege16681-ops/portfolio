import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { MediaTile } from "./Media";

const NAV_ROUTES = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "team", label: "Team", path: "/team" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "expertise", label: "Expertise", path: "/expertise" },
  { id: "hobbies", label: "Hobbies", path: "/hobbies" },
];

const CARD_POSES = [
  { left: "0%", top: "4%", width: "58%", height: "46%", rotate: -3 },
  { right: "4%", top: "0%", width: "46%", height: "52%", rotate: 2 },
  { left: "4%", bottom: "0%", width: "42%", height: "46%", rotate: 1 },
  { right: "8%", bottom: "4%", width: "48%", height: "44%", rotate: -1 },
];

export function MomentsLauncher() {
  const [open, setOpen] = useState(false);
  const { data } = useSite();
  const collage = data.mediaLibrary.slice(0, 4);

  return (
    <>
      {/* Floating launcher button */}
      <motion.button
        className={`moments-fab${open ? " is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open moments menu"
        aria-expanded={open}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        <motion.span
          className="moments-fab-ring"
          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0.12, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="moments-fab-core">
          {open ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 16l4-4a2 2 0 012.8 0L14 15l1.5-1.5a2 2 0 012.8 0L20 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="5" width="18" height="14" rx="2.4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          )}
        </span>
      </motion.button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="moments-overlay open"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.16, 0.8, 0.24, 1] }}
          >
            {/* Tilted photo collage */}
            <div className="moments-collage">
              {collage.map((m, i) => (
                <motion.div
                  key={m.id}
                  className={`moments-photo mp-${i}`}
                  initial={{ opacity: 0, y: 60, rotate: 0, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, rotate: CARD_POSES[i]?.rotate ?? 0, scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 24 }}
                  whileHover={{
                    rotate: (CARD_POSES[i]?.rotate ?? 0) * -0.5,
                    scale: 1.06,
                    zIndex: 20,
                    transition: { type: "spring", stiffness: 280 },
                  }}
                >
                  <MediaTile item={m} alt={m.label || "Moment"} kenBurns active={open} />
                </motion.div>
              ))}
            </div>

            {/* Close button */}
            <motion.button
              className="moments-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              whileHover={{ scale: 1.12, backgroundColor: "#fff", color: "#3d3d3f" }}
              whileTap={{ scale: 0.88, rotate: 90 }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 380 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>

            {/* Navigation */}
            <nav className="moments-nav">
              {NAV_ROUTES.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: 70 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.15, type: "spring", stiffness: 300, damping: 26 }}
                >
                  <Link
                    to={l.path}
                    className="moments-link"
                    onClick={() => setOpen(false)}
                  >
                    <motion.span
                      whileHover={{
                        color: "#ffffff",
                        x: -8,
                        transition: { type: "spring", stiffness: 400, damping: 20 },
                      }}
                      style={{ display: "inline-block" }}
                    >
                      {l.label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer socials */}
            <motion.div
              className="moments-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="moments-lab">Socials</span>
              <div className="moments-socials">
                <motion.a href="https://www.instagram.com/official_simonchege" target="_blank" rel="noopener" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}>Instagram</motion.a>
                <motion.a href="mailto:simonchege16681@gmail.com" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}>Email</motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
