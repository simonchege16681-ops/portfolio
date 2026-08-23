import type { SiteData, MediaItem } from "./types";

/* ------------------------------------------------------------------ */
/*  Real Simon Chege images from Cloudinary                            */
/* ------------------------------------------------------------------ */
const SIMON = {
  s1: "https://res.cloudinary.com/cblgrea6/image/upload/v1787493789/2Z6A3690.jpg",
  s2: "https://res.cloudinary.com/cblgrea6/image/upload/v1787493785/2Z6A3691.jpg",
  s3: "https://res.cloudinary.com/cblgrea6/image/upload/v1786810963/WhatsApp_Image_2026-08-04_at_4.00.58_PM.jpg",
  s4: "https://res.cloudinary.com/cblgrea6/image/upload/v1786810963/WhatsApp_Image_2026-08-06_at_2.24.46_PM.jpg",
  // Team / crew shots
  crew1: "https://res.cloudinary.com/cblgrea6/image/upload/v1786810966/IMG-20260330-WA0133.jpg",
  crew2: "https://res.cloudinary.com/cblgrea6/image/upload/v1786810965/IMG-20251028-WA0022.jpg",
  crew3: "https://res.cloudinary.com/cblgrea6/image/upload/v1786810964/WhatsApp_Image_2026-08-05_at_3.29.19_PM.jpg",
  crew4: "https://res.cloudinary.com/cblgrea6/image/upload/v1786810964/WhatsApp_Image_2026-08-05_at_3.28.26_PM.jpg",
};

/* Stock / editorial for panels that aren't personal portraits */
const STOCK = {
  code:  "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  code2: "https://images.pexels.com/photos/14553704/pexels-photo-14553704.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  robot: "https://images.pexels.com/photos/8386356/pexels-photo-8386356.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  robot2:"https://images.pexels.com/photos/8386369/pexels-photo-8386369.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  studio:"https://images.pexels.com/photos/31236094/pexels-photo-31236094.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  gear:  "https://images.pexels.com/photos/7698475/pexels-photo-7698475.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
  desk2: "https://images.pexels.com/photos/37022834/pexels-photo-37022834.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
};

let counter = 0;
function media(src: string, kind: MediaItem["kind"] = "image", label = ""): MediaItem {
  counter += 1;
  return { id: `m${counter}`, kind, src, label };
}

export const NAV_LINKS = [
  { id: "home",      label: "Home" },
  { id: "about",     label: "About" },
  { id: "projects",  label: "Projects" },
  { id: "expertise", label: "Expertise" },
  { id: "hobbies",   label: "Hobbies" },
];

export const DEFAULT_SITE_DATA: SiteData = {
  siteTitle: "Simon Chege",

  colors: {
    bg:     "#f6f6f4",
    bgAlt:  "#ffffff",
    bgAlt2: "#eeeeec",
    fg:     "#1c1c1e",
    fgDim:  "#5c5c60",
    gold:   "#3a3a3d",
    stage:  "#c7c7c5",
  },

  hero: {
    eyebrow: "🌐 Based in Nairobi, Kenya",
    nameLine1: "simon",
    nameLine2: "Chege",
    tagline: "A creative technologist who's also a self-taught, full-stack developer.",
    slides: [
      media(SIMON.s2,  "image", "Simon — studio portrait"),
      media(SIMON.s1,  "image", "Simon — editorial shot"),
      media(SIMON.s4,  "image", "Simon — candid"),
      media(SIMON.s3,  "image", "Simon — on location"),
    ],
  },

  gallery: {
    quote: "CURIOSITY IS THE ENGINE",
    slides: [
      media(SIMON.s1,  "image", "Editorial"),
      media(SIMON.s2,  "image", "Studio portrait"),
      media(SIMON.s3,  "image", "On location"),
      media(SIMON.s4,  "image", "Candid"),
      media(SIMON.crew3, "image", "Creative session"),
      media(SIMON.crew4, "image", "Behind the scenes"),
    ],
  },

  introText:
    "Always building, always curious — chasing tools and ideas I haven't touched yet. From my first lines of CSS to voice assistants and AI-integrated apps, I love figuring out how things work, then building my own version.",
  introSmallText:
    "And I don't quit easily. Stuck on a bug for hours, I'll always find a way through.",

  panels: [
    { id: "p1", tab: "About",     href: "/about",     title: "Who I Am",       media: media(SIMON.s2,  "image") },
    { id: "p2", tab: "Projects",  href: "/projects",  title: "Stuff I've Made", media: media(STOCK.code, "image") },
    { id: "p3", tab: "Expertise", href: "/expertise", title: "What I'm Good At",media: media(STOCK.robot,"image") },
    { id: "p4", tab: "Hobbies",   href: "/hobbies",   title: "What I Do For Fun",media: media(SIMON.crew3,"image") },
  ],

  about: {
    intro:
      "I care about turning ideas into things people can actually use — whether that's a line of code, a piece of UI, or a full product. Curiosity is what keeps me moving between web development, AI tooling, and content creation, and it's what's shaped every project below.",
  },

  timeline: [
    {
      id: "t1",
      tag: "EARLY DAYS",
      title: "Learning by breaking things",
      body: "Started out fixing CSS and wiring up Firebase for a scrappy chat app, and got hooked on the feeling of watching code turn into something real.",
    },
    {
      id: "t2",
      tag: "FIRST REAL BUILD",
      title: "Wooza takes shape",
      body: "Grew a simple chat app into a full social platform, adding glassmorphism UI, stories, vanish mode and an AI theme engine one feature at a time.",
    },
    {
      id: "t3",
      tag: "GOING INDEPENDENT",
      title: "Building for real clients",
      body: "Started taking on client work — from trading platforms to gyms to hospitality brands — and learned to design for someone else's business instead of just my own ideas.",
    },
    {
      id: "t4",
      tag: "AI ERA",
      title: "Voice, tools and assistants",
      body: "Went deep on AI-integrated products: voice assistants, learning apps, and tools built to respond to people instead of just displaying things at them.",
    },
    {
      id: "t5",
      tag: "RIGHT NOW",
      title: "Design-first, animation-heavy",
      body: "These days I'm chasing one distinct aesthetic (light, premium, animated) across everything I ship — from nonprofit sites to hotel brands to my own tools.",
    },
  ],

  projects: [
    {
      id: "pr1",
      index: "01",
      name: "Wooza",
      tags: "FIREBASE • REACT • PWA",
      body: "A social chat app grown from scratch into a full platform: glassmorphism auth, Instagram-style media editing, story banners, vanish mode, an AI theme engine, and a full mobile-ready PWA build.",
    },
    {
      id: "pr2",
      index: "02",
      name: "Summit Trades",
      tags: "REACT • FINTECH UI",
      body: "A trading platform concept built for African markets, designed to feel as sharp and confident as the traders using it.",
    },
    {
      id: "pr3",
      index: "03",
      name: "CSCO",
      tags: "ANIMATION • HIDDEN CMS",
      body: "A fully animated website for a healthcare nonprofit, complete with scroll-triggered motion, a hero slideshow, and a hidden, password-protected content editor for the team.",
    },
    {
      id: "pr4",
      index: "04",
      name: "Nexus",
      tags: "SOCIAL • MVP",
      body: "A social app prototype mixing the best parts of Instagram, Discord, WhatsApp and TikTok into one connected space, built out as a working MVP.",
    },
    {
      id: "pr5",
      index: "05",
      name: "LearnRobotics",
      tags: "3D • PYTHON IDE • AI TUTOR",
      body: "An interactive STEM platform with a 3D robot builder, an in-browser Python IDE, a physics simulator and an AI tutor interface.",
    },
    {
      id: "pr6",
      index: "06",
      name: "Hilltop Haven & The Ridge House",
      tags: "HOSPITALITY • SINGLE-FILE BUILDS",
      body: "Fully animated hotel and boutique-hostel sites for properties in the Kenya Highlands, built to sell the feeling of the place, not just list its rooms.",
    },
  ],

  expertise: [
    {
      id: "e1",
      icon: "code",
      title: "Web Development",
      body: "Full-stack builds, from single-file sites to Firebase-backed apps. I like owning a project end to end, from layout to deployment.",
      more: ["React, TypeScript & vanilla JS", "Firebase auth, Firestore & storage", "PWA builds and deployment"],
    },
    {
      id: "e2",
      icon: "ai",
      title: "AI-Integrated Tools",
      body: "Voice assistants, tutoring apps and AI-powered features that talk back, instead of just displaying data on a screen.",
      more: ["LLM-powered chat & tutoring flows", "Speech-to-text voice interfaces", "Prompt design and tool calling"],
    },
    {
      id: "e3",
      icon: "ui",
      title: "UI/UX & Motion",
      body: "Light, premium, animated interfaces. I care as much about how a site feels to scroll through as what it actually says.",
      more: ["Framer Motion & scroll-triggered animation", "Design tokens & type scales", "Layered depth & slideshow systems"],
    },
    {
      id: "e4",
      icon: "video",
      title: "Content Production",
      body: "Writing and scripting video content, including a full slate of nursery rhyme YouTube shorts, start to finish.",
      more: ["Scriptwriting & storyboarding", "Editing and sound design", "Publishing and channel strategy"],
    },
  ],

  hobbies: [
    { id: "h1", tab: "Hobby 01", title: "Content Creation", media: media(STOCK.studio, "image") },
    { id: "h2", tab: "Hobby 02", title: "AI Tinkering",     media: media(STOCK.robot2, "image") },
    { id: "h3", tab: "Hobby 03", title: "Visual Design",    media: media(STOCK.gear,   "image") },
  ],

  contact: {
    heading: "Wanna build something together?",
    body: "Always happy to connect — for a quick chat, a collab, a helping hand, or just to answer your questions. Feel free to reach out.",
    email: "simonchege16681@gmail.com",
  },

  mediaLibrary: [
    media(SIMON.s1,    "image", "Simon — editorial"),
    media(SIMON.s2,    "image", "Simon — studio"),
    media(SIMON.s3,    "image", "Simon — on location"),
    media(SIMON.s4,    "image", "Simon — candid"),
    media(SIMON.crew3, "image", "Creative session"),
    media(SIMON.crew4, "image", "Behind the scenes"),
    media(STOCK.code,  "image", "Code close-up"),
    media(STOCK.robot, "image", "Robotic hand"),
  ],

  stripSpeed: 32,
  slideSpeed: 5200,
};
