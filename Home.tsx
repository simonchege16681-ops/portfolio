import { Gallery, Hero, Intro, Marquee } from "../components/Hero";
import { PhotoStrip } from "../components/PhotoStrip";
import { Stack, Contact } from "../components/Sections";
import { PageTransition } from "../components/Chrome";
import { TeamSection } from "../components/Team";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Gallery />
      <Marquee />
      <Intro />
      <TeamSection />
      <PhotoStrip />
      <Stack />
      <Contact />
    </PageTransition>
  );
}
