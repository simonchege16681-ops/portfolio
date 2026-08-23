import { useEffect, useRef, useState } from "react";

/** Observes every [data-reveal] element in the document and adds .visible once seen. */
export function useRevealObserver() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.visible)").forEach((n) => obs.observe(n));
    };
    scan();

    // Catch elements added later (e.g. new admin-panel content, list items).
    const mutationObs = new MutationObserver(() => scan());
    mutationObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      mutationObs.disconnect();
    };
  }, []);
}

/** Splits text into words that slide up when the element scrolls into view. */
export function useWordReveal<T extends HTMLElement>(text: string) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [text]);

  return { ref, visible, words: text.split(" ") };
}

/** Tracks which section is currently in the middle of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids.join(",")]);
  return active;
}

export function useScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

/**
 * Long-press hook: fires onTrigger once the element has been pressed and
 * held for `holdMs`. Shows live progress (0-1) while pressing so a UI can
 * render a visual charge-up ring, and cancels cleanly on early release.
 */
export function useLongPress(onTrigger: () => void, holdMs = 1400) {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number>(0);
  const pressingRef = useRef(false);

  const tick = () => {
    if (!pressingRef.current) return;
    const elapsed = performance.now() - startRef.current;
    const p = Math.min(1, elapsed / holdMs);
    setProgress(p);
    if (p >= 1) {
      pressingRef.current = false;
      setProgress(0);
      onTrigger();
      return;
    }
    frameRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    pressingRef.current = true;
    startRef.current = performance.now();
    frameRef.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    pressingRef.current = false;
    setProgress(0);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  };

  useEffect(() => () => cancel(), []);

  return {
    progress,
    handlers: {
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
      onTouchStart: start,
      onTouchEnd: cancel,
      onTouchCancel: cancel,
    },
  };
}

/** Listens for a secret typed keyword anywhere on the page (e.g. "admin"). */
export function useSecretKeyword(keyword: string, onMatch: () => void) {
  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-keyword.length);
      if (buffer === keyword.toLowerCase()) {
        buffer = "";
        onMatch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyword, onMatch]);
}
