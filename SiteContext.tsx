import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SITE_DATA } from "../defaultData";
import type { SiteData } from "../types";

const STORAGE_KEY = "simon-site-data-v1";
const PASSCODE_KEY = "simon-admin-passcode-v1";
const DEFAULT_PASSCODE = "2580";

function loadInitial(): SiteData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_DATA,
      ...parsed,
      colors: { ...DEFAULT_SITE_DATA.colors, ...parsed.colors },
      hero: { ...DEFAULT_SITE_DATA.hero, ...parsed.hero, slides: parsed.hero?.slides?.length ? parsed.hero.slides : DEFAULT_SITE_DATA.hero.slides },
      gallery: {
        ...DEFAULT_SITE_DATA.gallery,
        ...parsed.gallery,
        slides: parsed.gallery?.slides?.length ? parsed.gallery.slides : DEFAULT_SITE_DATA.gallery.slides,
      },
      about: { ...DEFAULT_SITE_DATA.about, ...parsed.about },
      contact: { ...DEFAULT_SITE_DATA.contact, ...parsed.contact },
      panels: parsed.panels?.length ? parsed.panels : DEFAULT_SITE_DATA.panels,
      timeline: parsed.timeline?.length ? parsed.timeline : DEFAULT_SITE_DATA.timeline,
      projects: parsed.projects?.length ? parsed.projects : DEFAULT_SITE_DATA.projects,
      expertise: parsed.expertise?.length ? parsed.expertise : DEFAULT_SITE_DATA.expertise,
      hobbies: parsed.hobbies?.length ? parsed.hobbies : DEFAULT_SITE_DATA.hobbies,
      mediaLibrary: parsed.mediaLibrary?.length ? parsed.mediaLibrary : DEFAULT_SITE_DATA.mediaLibrary,
      stripSpeed: parsed.stripSpeed ?? DEFAULT_SITE_DATA.stripSpeed,
      slideSpeed: parsed.slideSpeed ?? DEFAULT_SITE_DATA.slideSpeed,
    };
  } catch {
    return DEFAULT_SITE_DATA;
  }
}

function loadPasscode(): string {
  try {
    return window.localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE;
  } catch {
    return DEFAULT_PASSCODE;
  }
}

interface SiteContextValue {
  data: SiteData;
  setData: (updater: (prev: SiteData) => SiteData) => void;
  resetToDefault: () => void;
  replaceAll: (next: SiteData) => void;
  adminOpen: boolean;
  gateOpen: boolean;
  openGate: () => void;
  closeGate: () => void;
  unlockAdmin: (code: string) => boolean;
  closeAdmin: () => void;
  passcode: string;
  setPasscode: (code: string) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

const COLOR_VAR_MAP: Record<keyof SiteData["colors"], string> = {
  bg: "--bg",
  bgAlt: "--bg-alt",
  bgAlt2: "--bg-alt-2",
  fg: "--fg",
  fgDim: "--fg-dim",
  gold: "--gold",
  stage: "--stage",
};

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<SiteData>(loadInitial);
  const [adminOpen, setAdminOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [passcode, setPasscodeState] = useState(loadPasscode);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    window.localStorage.setItem(PASSCODE_KEY, passcode);
  }, [passcode]);

  useEffect(() => {
    const root = document.documentElement.style;
    (Object.keys(COLOR_VAR_MAP) as (keyof SiteData["colors"])[]).forEach((key) => {
      root.setProperty(COLOR_VAR_MAP[key], data.colors[key]);
    });
  }, [data.colors]);

  const setData = useCallback((updater: (prev: SiteData) => SiteData) => {
    setDataState((prev) => updater(prev));
  }, []);

  const resetToDefault = useCallback(() => {
    setDataState(DEFAULT_SITE_DATA);
  }, []);

  const replaceAll = useCallback((next: SiteData) => {
    setDataState(next);
  }, []);

  const unlockAdmin = useCallback(
    (code: string) => {
      if (code === passcode) {
        setAdminOpen(true);
        setGateOpen(false);
        return true;
      }
      return false;
    },
    [passcode]
  );

  const value = useMemo<SiteContextValue>(
    () => ({
      data,
      setData,
      resetToDefault,
      replaceAll,
      adminOpen,
      gateOpen,
      openGate: () => setGateOpen(true),
      closeGate: () => setGateOpen(false),
      unlockAdmin,
      closeAdmin: () => setAdminOpen(false),
      passcode,
      setPasscode: (code: string) => setPasscodeState(code || DEFAULT_PASSCODE),
    }),
    [data, setData, resetToDefault, replaceAll, adminOpen, gateOpen, unlockAdmin, passcode]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
