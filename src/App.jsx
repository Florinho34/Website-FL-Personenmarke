import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Startseite from "./pages/Startseite";
import Philosophie from "./pages/Philosophie";
import Mentoring from "./pages/Mentoring";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import ConsentBanner from "./components/ConsentBanner";

// Bei jedem Seitenwechsel nach ganz oben springen (SPA behält sonst die Scrollposition).
// Anker-Links (#abschnitt) bleiben unangetastet; Sprung ohne Animation trotz Smooth-Scroll.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/philosophie" element={<Philosophie />} />
        <Route path="/mentoring" element={<Mentoring />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
      </Routes>
      <ConsentBanner />
    </BrowserRouter>
  );
}
