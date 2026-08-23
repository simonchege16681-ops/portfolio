export type MediaKind = "image" | "video";

export interface MediaItem {
  id: string;
  kind: MediaKind;
  src: string;
  label?: string;
}

export interface ColorScheme {
  bg: string;
  bgAlt: string;
  bgAlt2: string;
  fg: string;
  fgDim: string;
  gold: string;
  stage: string;
}

export interface HeroContent {
  eyebrow: string;
  nameLine1: string;
  nameLine2: string;
  tagline: string;
  slides: MediaItem[];
}

export interface GalleryContent {
  quote: string;
  slides: MediaItem[];
}

export interface PanelItem {
  id: string;
  tab: string;
  href: string;
  title: string;
  media: MediaItem;
}

export interface TimelineItem {
  id: string;
  tag: string;
  title: string;
  body: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  name: string;
  tags: string;
  body: string;
}

export interface ExpertiseItem {
  id: string;
  icon: string;
  title: string;
  body: string;
  more: string[];
}

export interface HobbyItem {
  id: string;
  tab: string;
  title: string;
  media: MediaItem;
}

export interface AboutContent {
  intro: string;
}

export interface ContactContent {
  heading: string;
  body: string;
  email: string;
}

export interface SiteData {
  siteTitle: string;
  colors: ColorScheme;
  hero: HeroContent;
  gallery: GalleryContent;
  introText: string;
  introSmallText: string;
  panels: PanelItem[];
  about: AboutContent;
  timeline: TimelineItem[];
  projects: ProjectItem[];
  expertise: ExpertiseItem[];
  hobbies: HobbyItem[];
  contact: ContactContent;
  mediaLibrary: MediaItem[];
  stripSpeed: number;
  slideSpeed: number;
}
