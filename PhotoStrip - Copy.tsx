import { useSite } from "../context/SiteContext";
import { MediaTile } from "./Media";

/** A continuously sliding strip of photos/videos used as an animated divider. */
export function PhotoStrip() {
  const { data } = useSite();
  const items = data.mediaLibrary.length ? data.mediaLibrary : data.gallery.slides;
  const loopItems = [...items, ...items];
  const duration = Math.max(18, data.stripSpeed || 32);

  return (
    <div className="photo-strip">
      <div className="photo-strip-track" style={{ animationDuration: `${duration}s` }}>
        {loopItems.map((item, i) => (
          <div className="photo-strip-cell" key={`${item.id}-${i}`}>
            <MediaTile item={item} alt={item.label || "Gallery media"} className="photo-strip-media" kenBurns active />
          </div>
        ))}
      </div>
      <div className="photo-strip-fade left" />
      <div className="photo-strip-fade right" />
    </div>
  );
}
