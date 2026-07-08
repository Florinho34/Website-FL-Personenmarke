import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Startseite from "./pages/Startseite";
import Philosophie from "./pages/Philosophie";
import Mentoring from "./pages/Mentoring";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Vertrag from "./pages/Vertrag";
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

// --- Zentrale SEO-Steuerung ---------------------------------------------------
// Titel, Description, Canonical und OG-Tags pro Route an EINER Stelle.
// Ändert die in index.html vorhandenen Tags (bzw. legt fehlende an), damit
// kein doppelter Titel entsteht. Der statische Kern in index.html deckt den
// Fall ab, dass ein Crawler kein JavaScript ausführt (dann greift die Startseite).
const SITE = "https://florian-lingner.ch";
const DEFAULT_SEO = {
  title: "Florian Lingner | Autor, Philosoph und Mentor",
  description: "Weil „ganz okay“ nicht dein Anspruch sein kann.",
};
const SEO = {
  "/": DEFAULT_SEO,
  "/philosophie": {
    title: "Meine Philosophie | Florian Lingner",
    description:
      "Warum echte Veränderung nicht mit mehr Wissen beginnt, sondern mit ehrlicher Selbstwahrnehmung. Die Denkweise hinter meiner Arbeit als Mentor.",
  },
  "/mentoring": {
    title: "Mentoring | Florian Lingner",
    description:
      "1:1-Mentoring für Menschen, die mehr vom Leben wollen. Ehrlich, direkt, ohne Hokuspokus.",
  },
  "/impressum": {
    title: "Impressum | Florian Lingner",
    description: "Impressum und Anbieterkennzeichnung von Florian Lingner.",
  },
  "/datenschutz": {
    title: "Datenschutz | Florian Lingner",
    description:
      "Wie personenbezogene Daten auf florian-lingner.ch verarbeitet werden.",
  },
};

function setMeta(attr, key, value) {
  let el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}
function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = SEO[pathname] || DEFAULT_SEO;
    const url = SITE + (pathname === "/" ? "/" : pathname);
    document.title = seo.title;
    setMeta("name", "description", seo.description);
    setCanonical(url);
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Seo />
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/philosophie" element={<Philosophie />} />
        <Route path="/mentoring" element={<Mentoring />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/vertrag" element={<Vertrag />} />
      </Routes>
      <ConsentBanner />
    </BrowserRouter>
  );
}
