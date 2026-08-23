import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageTransition } from "../components/Chrome";
import { Reveal } from "../components/Sections";
import { MaskReveal } from "../components/Typography";
import { useSite } from "../context/SiteContext";
import { useLongPress } from "../hooks";

export default function Contact() {
  const { data, openGate } = useSite();
  const [label, setLabel] = useState(data.contact.email);
  const [sent, setSent] = useState(false);
  const { progress, handlers } = useLongPress(openGate, 1400);

  useEffect(() => { setLabel(data.contact.email); }, [data.contact.email]);

  const copy = () => {
    navigator.clipboard?.writeText(data.contact.email).then(() => {
      setLabel("Copied to clipboard! ✓");
      setSent(true);
      setTimeout(() => { setLabel(data.contact.email); setSent(false); }, 1800);
    });
  };

  const fields = [
    { label: "Your name", type: "text", placeholder: "Simon Chege" },
    { label: "Your email", type: "email", placeholder: "you@example.com" },
    { label: "Subject", type: "text", placeholder: "Let's build something" },
  ];

  return (
    <PageTransition>
      <div className="page-wrapper">
        <div className="page-hero page-hero-tall" data-bg-word="HELLO">
          <div className="wrap">
            <motion.span className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>Get In Touch</motion.span>
            <div className="page-h1-wrap">
              <MaskReveal delay={0.14} duration={0.85}>
                <h1 className="page-h1-big">Let's Talk</h1>
              </MaskReveal>
            </div>
            <motion.p className="page-subtitle page-subtitle-stagger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {data.contact.body}
            </motion.p>
          </div>
        </div>

        <div className="wrap page-content">
          <div className="contact-page-grid">
            {/* Contact form */}
            <Reveal>
              <div className="contact-form-card">
                <h3>Send a message</h3>
                {fields.map((f, i) => (
                  <motion.div
                    key={f.label}
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.1, type: "spring", stiffness: 260, damping: 24 }}
                  >
                    <label>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} className="contact-input" />
                  </motion.div>
                ))}
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.32, type: "spring" }}
                >
                  <label>Message</label>
                  <textarea className="contact-input contact-textarea" placeholder="Tell me about your project..." />
                </motion.div>
                <motion.button
                  className="contact-submit"
                  whileHover={{ scale: 1.03, boxShadow: "0 20px 50px rgba(20,20,22,0.18)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSent(true); setTimeout(() => setSent(false), 2000); }}
                >
                  {sent ? "Message sent! ✓" : "Send message →"}
                </motion.button>
              </div>
            </Reveal>

            {/* Email pill + info */}
            <Reveal delay={0.15}>
              <div className="contact-info-card">
                <p className="contact-info-label">Or copy my email directly</p>
                <motion.button
                  className="talk-pill"
                  onClick={copy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  style={{ marginBottom: 24 }}
                >
                  <span className="talk-email-spacer mono">{data.contact.email}</span>
                  <span className="talk-face">→ Let's talk</span>
                  <span className="talk-email-visible mono">{label}</span>
                </motion.button>
                <a href={`mailto:${data.contact.email}`} className="contact-direct">
                  {data.contact.email}
                </a>

                <div className="contact-social-list">
                  <p className="contact-info-label" style={{ marginTop: 32 }}>Find me on</p>
                  {[
                { name: "Instagram — @official_simonchege", url: "https://www.instagram.com/official_simonchege" },
                { name: "Email — simonchege16681@gmail.com", url: "mailto:simonchege16681@gmail.com" },
              ].map((s) => (
                    <motion.a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener"
                      className="contact-social-link"
                      whileHover={{ x: 6 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {s.name} →
                    </motion.a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Hidden admin trigger */}
        <motion.button
          className="fine-print-btn"
          {...handlers}
          whileHover={{ letterSpacing: "0.06em" }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span className="fine-print-charge" style={{ scaleX: progress }} />
          © {new Date().getFullYear()} {data.siteTitle}. Built with care in Nairobi.
        </motion.button>
      </div>
    </PageTransition>
  );
}
