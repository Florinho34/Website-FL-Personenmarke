import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Startseite from "./pages/Startseite";
import Philosophie from "./pages/Philosophie";
import Mentoring from "./pages/Mentoring";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Vertrag from "./pages/Vertrag";
import NotFound from "./pages/NotFound";
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
// Titel, Description, Canonical, Robots und OG-Tags pro Route an EINER Stelle.
// Ändert die in index.html vorhandenen Tags (bzw. legt fehlende an), damit
// kein doppelter Titel entsteht. Der statische Kern in index.html deckt den
// Fall ab, dass ein Crawler kein JavaScript ausführt (dann greift die Startseite).
//
// noindex: true  → Seite darf NICHT in den Index (Vertragsstrecke, 404).
//   Dann gilt:  Robots-Meta wird gesetzt · Canonical wird ENTFERNT
//               (ein selbstreferenzierendes Canonical ist ein "indexiere mich"-Signal)
//               · OG/Twitter fallen auf die Startseiten-Werte zurück, damit ein
//                 geteilter Link die normale Hauptseiten-Vorschau zeigt.
//   Absicherung ohne JavaScript: X-Robots-Tag-Header in vercel.json (nur /vertrag).
const SITE = "https://florian-lingner.ch";
const DEFAULT_SEO = {
  title: "Florian Lingner | Autor, Philosoph und Mentor",
  description: "Weil „ganz okay“ nicht dein Anspruch sein kann.",
};
const NOT_FOUND_SEO = {
  title: "Seite nicht gefunden | Florian Lingner",
  description: "Diese Seite gibt es nicht (mehr).",
  noindex: true,
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
  "/vertrag": {
    title: "Mentoring-Vertrag | Florian Lingner",
    description: "Persönliche Vertragsseite.",
    noindex: true,
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
function removeMeta(attr, key) {
  const el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
  if (el && el.parentNode) el.parentNode.removeChild(el);
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
function removeCanonical() {
  const el = document.head.querySelector('link[rel="canonical"]');
  if (el && el.parentNode) el.parentNode.removeChild(el);
}
function setSharing(title, description, url) {
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
}

// Pfad normalisieren: React Router matcht auch mit Schrägstrich am Ende und
// unabhängig von Gross-/Kleinschreibung. Ohne Normalisierung würde /Mentoring/
// die Mentoring-Seite anzeigen, aber in der SEO-Map nicht gefunden und
// fälschlich als 404 behandelt (= noindex auf einer echten Seite).
function normalize(pathname) {
  if (pathname.length <= 1) return "/";
  return pathname.replace(/\/+$/, "").toLowerCase() || "/";
}

function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = normalize(pathname);
    const seo = SEO[path] || NOT_FOUND_SEO;

    document.title = seo.title;
    setMeta("name", "description", seo.description);

    if (seo.noindex) {
      setMeta("name", "robots", "noindex, nofollow");
      removeCanonical();
      setSharing(DEFAULT_SEO.title, DEFAULT_SEO.description, SITE + "/");
      return;
    }

    removeMeta("name", "robots");
    const url = SITE + (path === "/" ? "/" : path);
    setCanonical(url);
    setSharing(seo.title, seo.description, url);
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ConsentBanner />
    </BrowserRouter>
  );
}
