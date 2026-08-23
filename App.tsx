import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminGate } from "./components/AdminGate";
import { AdminPanel } from "./components/AdminPanel";
import { CursorBubble, Nav, Preloader } from "./components/Chrome";
import { MomentsLauncher } from "./components/Moments";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Expertise from "./pages/Expertise";
import Hobbies from "./pages/Hobbies";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import { SiteProvider } from "./context/SiteContext";

export default function App() {
  return (
    <SiteProvider>
      <BrowserRouter>
        <Preloader />
        <CursorBubble />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/expertise" element={<Expertise />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/team" element={<Team />} />
        </Routes>
        <MomentsLauncher />
        <AdminGate />
        <AdminPanel />
      </BrowserRouter>
    </SiteProvider>
  );
}
