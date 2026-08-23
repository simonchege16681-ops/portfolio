import { useEffect, useState } from "react";
import type { MediaItem } from "../types";

/** Renders a single MediaItem as an <img> or looping muted <video>. */
export function MediaTile({
  item,
  className,
  alt,
  kenBurns,
  active = true,
}: {
  item: MediaItem;
  className?: string;
  alt: string;
  kenBurns?: boolean;
  active?: boolean;
}) {
  if (!item) return null;
  const cls = `${className ?? ""}${kenBurns ? " kenburns" : ""}${active ? " kb-play" : ""}`;
  if (item.kind === "video") {
    return (
      <video
        className={cls}
        src={item.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }
  return <img className={cls} src={item.src} alt={alt} loading="lazy" />;
}

/**
 * Crossfades between a list of media items automatically, with a slow
 * ken-burns zoom/pan applied to whichever slide is active.
 */
export function MediaSlideshow({
  slides,
  intervalMs = 5200,
  className,
  tileClassName,
  alt,
  fadeMs = 1100,
}: {
  slides: MediaItem[];
  intervalMs?: number;
  className?: string;
  tileClassName?: string;
  alt: string;
  fadeMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  if (!slides.length) return null;

  return (
    <div className={`media-slideshow${className ? ` ${className}` : ""}`}>
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`media-slide${i === index ? " is-active" : ""}${i % 2 === 0 ? " pan-a" : " pan-b"}`}
          style={{ transitionDuration: `${fadeMs}ms` }}
        >
          <MediaTile item={s} alt={`${alt} ${i + 1}`} className={tileClassName} kenBurns active={i === index} />
        </div>
      ))}
    </div>
  );
}
