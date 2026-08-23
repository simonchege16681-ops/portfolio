import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useSite } from "../context/SiteContext";
import type {
  ExpertiseItem,
  HobbyItem,
  MediaItem,
  MediaKind,
  ProjectItem,
  SiteData,
  TimelineItem,
} from "../types";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function newMedia(kind: MediaKind = "image", src = ""): MediaItem {
  return { id: uid(), kind, src, label: "" };
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} />;
}

function TextAreaInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <textarea className="adm-input adm-textarea" value={value} onChange={(e) => onChange(e.target.value)} />;
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="adm-color-row">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
      <input className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** Editor for a single MediaItem: kind toggle + URL/upload. */
function MediaEditor({ value, onChange }: { value: MediaItem; onChange: (v: MediaItem) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...value, src: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="adm-media-field">
      <div className="adm-image-preview">
        {value.src ? (
          value.kind === "video" ? (
            <video src={value.src} muted loop autoPlay playsInline />
          ) : (
            <img src={value.src} alt="preview" />
          )
        ) : (
          <span>Empty</span>
        )}
      </div>
      <div className="adm-image-controls">
        <div className="adm-kind-toggle">
          <button
            type="button"
            className={`adm-kind-btn tap${value.kind === "image" ? " active" : ""}`}
            onClick={() => onChange({ ...value, kind: "image" })}
          >
            Image
          </button>
          <button
            type="button"
            className={`adm-kind-btn tap${value.kind === "video" ? " active" : ""}`}
            onClick={() => onChange({ ...value, kind: "video" })}
          >
            Video
          </button>
        </div>
        <input
          className="adm-input"
          placeholder={value.kind === "video" ? "Video URL (.mp4)" : "Image URL"}
          value={value.src.startsWith("data:") ? "" : value.src}
          onChange={(e) => onChange({ ...value, src: e.target.value })}
        />
        <button type="button" className="adm-btn tap" onClick={() => fileRef.current?.click()}>
          Upload {value.kind === "video" ? "video" : "image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={value.kind === "video" ? "video/*" : "image/*"}
          hidden
          onChange={handleFile}
        />
      </div>
    </div>
  );
}

/** Editor for a reorderable list of MediaItems (hero / gallery slideshows). */
function MediaListEditor({ items, onChange }: { items: MediaItem[]; onChange: (items: MediaItem[]) => void }) {
  const update = (id: string, next: MediaItem) => onChange(items.map((m) => (m.id === id ? next : m)));
  const remove = (id: string) => onChange(items.filter((m) => m.id !== id));
  const move = (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((m) => m.id === id);
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= items.length) return;
    const next = [...items];
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    onChange(next);
  };

  return (
    <div className="adm-media-list">
      {items.map((m, i) => (
        <div className="adm-item" key={m.id}>
          <div className="adm-item-head">
            <span className="adm-item-num">Slide {i + 1}</span>
            <div className="adm-item-move">
              <button type="button" className="adm-mini-btn tap" onClick={() => move(m.id, -1)} disabled={i === 0}>
                ↑
              </button>
              <button
                type="button"
                className="adm-mini-btn tap"
                onClick={() => move(m.id, 1)}
                disabled={i === items.length - 1}
              >
                ↓
              </button>
            </div>
          </div>
          <MediaEditor value={m} onChange={(v) => update(m.id, v)} />
          <button className="adm-btn adm-remove tap" onClick={() => remove(m.id)}>
            Remove slide
          </button>
        </div>
      ))}
      <button className="adm-btn tap" onClick={() => onChange([...items, newMedia("image", "")])}>
        + Add slide
      </button>
    </div>
  );
}

function Section({
  title,
  defaultOpen,
  children,
  icon,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  icon?: string;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`adm-section${open ? " open" : ""}`}>
      <button type="button" className="adm-section-head tap" onClick={() => setOpen((o) => !o)}>
        <span>
          {icon ? <span className="adm-section-icon">{icon}</span> : null}
          {title}
        </span>
        <span className="adm-chev" aria-hidden="true">
          ⌄
        </span>
      </button>
      <div className="adm-section-body">
        <div className="adm-section-body-inner">{children}</div>
      </div>
    </div>
  );
}

const TABS = [
  { id: "content", label: "Content", icon: "📝" },
  { id: "media", label: "Media", icon: "🎞️" },
  { id: "design", label: "Design", icon: "🎨" },
  { id: "security", label: "Security", icon: "🔐" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function AdminPanel() {
  const { data, setData, resetToDefault, replaceAll, adminOpen, closeAdmin, passcode, setPasscode } = useSite();
  const [tab, setTab] = useState<TabId>("content");
  const [toast, setToast] = useState<string | null>(null);
  const [newPasscode, setNewPasscode] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const patch = (updater: (prev: SiteData) => SiteData) => setData(updater);

  const updateList = <K extends "timeline" | "projects" | "expertise" | "hobbies" | "panels" | "mediaLibrary">(
    key: K,
    id: string,
    patchObj: Partial<SiteData[K][number]>
  ) => {
    patch((prev) => ({
      ...prev,
      [key]: (prev[key] as any[]).map((item) => (item.id === id ? { ...item, ...patchObj } : item)),
    }));
  };

  const removeFromList = (
    key: "timeline" | "projects" | "expertise" | "hobbies" | "panels" | "mediaLibrary",
    id: string
  ) => {
    patch((prev) => ({ ...prev, [key]: (prev[key] as any[]).filter((item) => item.id !== id) }));
  };

  const addTimeline = () =>
    patch((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        { id: uid(), tag: "NEW", title: "New chapter", body: "Describe this moment." } as TimelineItem,
      ],
    }));

  const addProject = () =>
    patch((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: uid(),
          index: String(prev.projects.length + 1).padStart(2, "0"),
          name: "New Project",
          tags: "TAG • TAG",
          body: "Describe the project here.",
        } as ProjectItem,
      ],
    }));

  const addExpertise = () =>
    patch((prev) => ({
      ...prev,
      expertise: [
        ...prev.expertise,
        {
          id: uid(),
          icon: "code",
          title: "New Skill",
          body: "Describe this skill.",
          more: ["Detail one"],
        } as ExpertiseItem,
      ],
    }));

  const addHobby = () =>
    patch((prev) => ({
      ...prev,
      hobbies: [
        ...prev.hobbies,
        { id: uid(), tab: `Hobby ${prev.hobbies.length + 1}`, title: "New Hobby", media: newMedia() } as HobbyItem,
      ],
    }));

  const addLibraryMedia = () =>
    patch((prev) => ({ ...prev, mediaLibrary: [...prev.mediaLibrary, newMedia("image", "")] }));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-data.json";
    a.click();
    URL.revokeObjectURL(url);
    flash("Exported site-data.json");
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        replaceAll(parsed);
        flash("Import successful");
      } catch {
        flash("Import failed — invalid JSON");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const savePasscode = () => {
    if (newPasscode.trim().length < 3) {
      flash("Passcode must be at least 3 characters");
      return;
    }
    setPasscode(newPasscode.trim());
    setNewPasscode("");
    flash("Passcode updated");
  };

  return (
    <>
      <div className={`adm-overlay${adminOpen ? " open" : ""}`} onClick={closeAdmin} />
      <aside className={`adm-panel${adminOpen ? " open" : ""}`} aria-hidden={!adminOpen}>
        <div className="adm-glow" aria-hidden="true" />
        <div className="adm-header">
          <div>
            <span className="adm-eyebrow">Control Console</span>
            <h2>Site Admin</h2>
          </div>
          <button className="adm-close tap" onClick={closeAdmin} aria-label="Close admin panel">
            ✕
          </button>
        </div>

        <div className="adm-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`adm-tab tap${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="adm-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="adm-body">
          {tab === "design" && (
            <>
              <Section title="Theme Colors" defaultOpen icon="●">
                <Field label="Background">
                  <ColorInput value={data.colors.bg} onChange={(v) => patch((p) => ({ ...p, colors: { ...p.colors, bg: v } }))} />
                </Field>
                <Field label="Panel background">
                  <ColorInput
                    value={data.colors.bgAlt}
                    onChange={(v) => patch((p) => ({ ...p, colors: { ...p.colors, bgAlt: v } }))}
                  />
                </Field>
                <Field label="Card background">
                  <ColorInput
                    value={data.colors.bgAlt2}
                    onChange={(v) => patch((p) => ({ ...p, colors: { ...p.colors, bgAlt2: v } }))}
                  />
                </Field>
                <Field label="Text (foreground)">
                  <ColorInput value={data.colors.fg} onChange={(v) => patch((p) => ({ ...p, colors: { ...p.colors, fg: v } }))} />
                </Field>
                <Field label="Dim text">
                  <ColorInput
                    value={data.colors.fgDim}
                    onChange={(v) => patch((p) => ({ ...p, colors: { ...p.colors, fgDim: v } }))}
                  />
                </Field>
                <Field label="Accent">
                  <ColorInput value={data.colors.gold} onChange={(v) => patch((p) => ({ ...p, colors: { ...p.colors, gold: v } }))} />
                </Field>
                <Field label="Hero stage background">
                  <ColorInput
                    value={data.colors.stage}
                    onChange={(v) => patch((p) => ({ ...p, colors: { ...p.colors, stage: v } }))}
                  />
                </Field>
              </Section>

              <Section title="Motion" icon="◐">
                <Field label={`Slideshow speed — ${(data.slideSpeed / 1000).toFixed(1)}s per slide`}>
                  <input
                    type="range"
                    min={2000}
                    max={10000}
                    step={200}
                    value={data.slideSpeed}
                    onChange={(e) => patch((p) => ({ ...p, slideSpeed: Number(e.target.value) }))}
                  />
                </Field>
                <Field label={`Sliding photo strip speed — ${data.stripSpeed}s per loop`}>
                  <input
                    type="range"
                    min={10}
                    max={70}
                    step={2}
                    value={data.stripSpeed}
                    onChange={(e) => patch((p) => ({ ...p, stripSpeed: Number(e.target.value) }))}
                  />
                </Field>
              </Section>

              <button className="adm-btn adm-reset tap" onClick={resetToDefault}>
                Reset everything to default
              </button>
            </>
          )}

          {tab === "media" && (
            <>
              <Section title="Hero Slideshow" defaultOpen icon="🏠">
                <MediaListEditor
                  items={data.hero.slides}
                  onChange={(slides) => patch((p) => ({ ...p, hero: { ...p.hero, slides } }))}
                />
              </Section>
              <Section title="Gallery Slideshow Pool" icon="🖼️">
                <MediaListEditor
                  items={data.gallery.slides}
                  onChange={(slides) => patch((p) => ({ ...p, gallery: { ...p.gallery, slides } }))}
                />
              </Section>
              <Section title="Section Panels" icon="▦">
                {data.panels.map((p) => (
                  <Field label={p.tab} key={p.id}>
                    <MediaEditor value={p.media} onChange={(v) => updateList("panels", p.id, { media: v })} />
                  </Field>
                ))}
              </Section>
              <Section title="Hobby Media" icon="🎸">
                {data.hobbies.map((h) => (
                  <Field label={h.title} key={h.id}>
                    <MediaEditor value={h.media} onChange={(v) => updateList("hobbies", h.id, { media: v })} />
                  </Field>
                ))}
              </Section>
              <Section title="Media Library (used by the sliding photo strip)" icon="📚">
                {data.mediaLibrary.map((m) => (
                  <div className="adm-item" key={m.id}>
                    <MediaEditor value={m} onChange={(v) => updateList("mediaLibrary", m.id, v)} />
                    <button className="adm-btn adm-remove tap" onClick={() => removeFromList("mediaLibrary", m.id)}>
                      Remove from library
                    </button>
                  </div>
                ))}
                <button className="adm-btn tap" onClick={addLibraryMedia}>
                  + Add media to library
                </button>
              </Section>
            </>
          )}

          {tab === "security" && (
            <>
              <Section title="Admin Passcode" defaultOpen icon="🔑">
                <p className="adm-note">Current passcode: <span className="mono">{"•".repeat(passcode.length)}</span></p>
                <Field label="Set a new passcode">
                  <input
                    className="adm-input"
                    type="text"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="New passcode"
                  />
                </Field>
                <button className="adm-btn adm-btn-primary tap" onClick={savePasscode}>
                  Update passcode
                </button>
              </Section>

              <Section title="Backup & Restore" icon="💾">
                <p className="adm-note">Export the entire site as JSON, or import a previously saved backup.</p>
                <button className="adm-btn tap" onClick={exportJson}>
                  Export site data (.json)
                </button>
                <button className="adm-btn tap" onClick={() => importRef.current?.click()}>
                  Import site data (.json)
                </button>
                <input ref={importRef} type="file" accept="application/json" hidden onChange={handleImport} />
              </Section>

              <button className="adm-btn adm-reset tap" onClick={resetToDefault}>
                Reset everything to default
              </button>
            </>
          )}

          {tab === "content" && (
            <>
              <Section title="Site Title & Hero" defaultOpen icon="✦">
                <Field label="Site / logo name">
                  <TextInput value={data.siteTitle} onChange={(v) => patch((p) => ({ ...p, siteTitle: v }))} />
                </Field>
                <Field label="Eyebrow pill text">
                  <TextInput
                    value={data.hero.eyebrow}
                    onChange={(v) => patch((p) => ({ ...p, hero: { ...p.hero, eyebrow: v } }))}
                  />
                </Field>
                <Field label="Name — line 1 (lowercase)">
                  <TextInput
                    value={data.hero.nameLine1}
                    onChange={(v) => patch((p) => ({ ...p, hero: { ...p.hero, nameLine1: v } }))}
                  />
                </Field>
                <Field label="Name — line 2 (outlined)">
                  <TextInput
                    value={data.hero.nameLine2}
                    onChange={(v) => patch((p) => ({ ...p, hero: { ...p.hero, nameLine2: v } }))}
                  />
                </Field>
                <Field label="Tagline">
                  <TextAreaInput
                    value={data.hero.tagline}
                    onChange={(v) => patch((p) => ({ ...p, hero: { ...p.hero, tagline: v } }))}
                  />
                </Field>
              </Section>

              <Section title="Gallery Quote & Intro" icon="❝">
                <Field label="Gallery marquee quote">
                  <TextInput
                    value={data.gallery.quote}
                    onChange={(v) => patch((p) => ({ ...p, gallery: { ...p.gallery, quote: v } }))}
                  />
                </Field>
                <Field label="Intro paragraph">
                  <TextAreaInput value={data.introText} onChange={(v) => patch((p) => ({ ...p, introText: v }))} />
                </Field>
                <Field label="Intro small line">
                  <TextAreaInput
                    value={data.introSmallText}
                    onChange={(v) => patch((p) => ({ ...p, introSmallText: v }))}
                  />
                </Field>
              </Section>

              <Section title="About" icon="◎">
                <Field label="About paragraph">
                  <TextAreaInput
                    value={data.about.intro}
                    onChange={(v) => patch((p) => ({ ...p, about: { ...p.about, intro: v } }))}
                  />
                </Field>
              </Section>

              <Section title="Timeline" icon="↳">
                {data.timeline.map((t) => (
                  <div className="adm-item" key={t.id}>
                    <Field label="Tag">
                      <TextInput value={t.tag} onChange={(v) => updateList("timeline", t.id, { tag: v })} />
                    </Field>
                    <Field label="Title">
                      <TextInput value={t.title} onChange={(v) => updateList("timeline", t.id, { title: v })} />
                    </Field>
                    <Field label="Body">
                      <TextAreaInput value={t.body} onChange={(v) => updateList("timeline", t.id, { body: v })} />
                    </Field>
                    <button className="adm-btn adm-remove tap" onClick={() => removeFromList("timeline", t.id)}>
                      Remove entry
                    </button>
                  </div>
                ))}
                <button className="adm-btn tap" onClick={addTimeline}>
                  + Add timeline entry
                </button>
              </Section>

              <Section title="Projects" icon="▣">
                {data.projects.map((pr) => (
                  <div className="adm-item" key={pr.id}>
                    <Field label="Index">
                      <TextInput value={pr.index} onChange={(v) => updateList("projects", pr.id, { index: v })} />
                    </Field>
                    <Field label="Name">
                      <TextInput value={pr.name} onChange={(v) => updateList("projects", pr.id, { name: v })} />
                    </Field>
                    <Field label="Tags">
                      <TextInput value={pr.tags} onChange={(v) => updateList("projects", pr.id, { tags: v })} />
                    </Field>
                    <Field label="Description">
                      <TextAreaInput value={pr.body} onChange={(v) => updateList("projects", pr.id, { body: v })} />
                    </Field>
                    <button className="adm-btn adm-remove tap" onClick={() => removeFromList("projects", pr.id)}>
                      Remove project
                    </button>
                  </div>
                ))}
                <button className="adm-btn tap" onClick={addProject}>
                  + Add project
                </button>
              </Section>

              <Section title="Expertise" icon="◆">
                {data.expertise.map((ex) => (
                  <div className="adm-item" key={ex.id}>
                    <Field label="Title">
                      <TextInput value={ex.title} onChange={(v) => updateList("expertise", ex.id, { title: v })} />
                    </Field>
                    <Field label="Description">
                      <TextAreaInput value={ex.body} onChange={(v) => updateList("expertise", ex.id, { body: v })} />
                    </Field>
                    <Field label="Detail bullets (one per line)">
                      <TextAreaInput
                        value={ex.more.join("\n")}
                        onChange={(v) => updateList("expertise", ex.id, { more: v.split("\n").filter(Boolean) })}
                      />
                    </Field>
                    <button className="adm-btn adm-remove tap" onClick={() => removeFromList("expertise", ex.id)}>
                      Remove card
                    </button>
                  </div>
                ))}
                <button className="adm-btn tap" onClick={addExpertise}>
                  + Add expertise card
                </button>
              </Section>

              <Section title="Hobbies" icon="♪">
                {data.hobbies.map((h) => (
                  <div className="adm-item" key={h.id}>
                    <Field label="Tab label">
                      <TextInput value={h.tab} onChange={(v) => updateList("hobbies", h.id, { tab: v })} />
                    </Field>
                    <Field label="Title">
                      <TextInput value={h.title} onChange={(v) => updateList("hobbies", h.id, { title: v })} />
                    </Field>
                    <button className="adm-btn adm-remove tap" onClick={() => removeFromList("hobbies", h.id)}>
                      Remove hobby
                    </button>
                  </div>
                ))}
                <button className="adm-btn tap" onClick={addHobby}>
                  + Add hobby
                </button>
              </Section>

              <Section title="Contact" icon="✉">
                <Field label="Heading">
                  <TextInput
                    value={data.contact.heading}
                    onChange={(v) => patch((p) => ({ ...p, contact: { ...p.contact, heading: v } }))}
                  />
                </Field>
                <Field label="Body">
                  <TextAreaInput
                    value={data.contact.body}
                    onChange={(v) => patch((p) => ({ ...p, contact: { ...p.contact, body: v } }))}
                  />
                </Field>
                <Field label="Email">
                  <TextInput
                    value={data.contact.email}
                    onChange={(v) => patch((p) => ({ ...p, contact: { ...p.contact, email: v } }))}
                  />
                </Field>
              </Section>

              <button className="adm-btn adm-reset tap" onClick={resetToDefault}>
                Reset everything to default
              </button>
            </>
          )}
        </div>

        <div className={`adm-toast${toast ? " show" : ""}`}>{toast}</div>
      </aside>
    </>
  );
}
