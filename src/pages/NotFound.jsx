// src/pages/NotFound.jsx
// Catch-all-Seite fuer alle Pfade, die es nicht gibt (<Route path="*"> in App.jsx).
//
// WICHTIG zum Statuscode: vercel.json schreibt jeden Pfad auf index.html um.
// Der Server antwortet deshalb immer mit 200, auch hier. Ein echter 404-Status
// waere nur mit einer Serverless-Funktion moeglich. Der wirksame Hebel ist
// stattdessen das noindex, das App.jsx fuer unbekannte Pfade setzt (NOT_FOUND_SEO).
//
// Grundstil (Reset, CI-Farben, Inter Tight, color-scheme:light) kommt global aus src/index.css.

import { Link } from "react-router-dom";

const CSS = `
.fl-404{
  --creme:#F4F1EB; --sand:#D6CBBF; --warmgrau:#AFA79D;
  --ink:#1C1C1C; --orange:#FF4D00; --soft:#595854;
  --r-pill:100px;
  font-family:'Inter Tight',system-ui,-apple-system,sans-serif;
  background:var(--creme); color:var(--ink);
  min-height:100svh;
  display:flex; align-items:center; justify-content:center;
  padding:clamp(24px,6vw,64px);
  -webkit-font-smoothing:antialiased; line-height:1.5;
}

.fl-404__inner{max-width:620px;width:100%;text-align:center;}

.fl-404__code{
  font-size:clamp(80px,18vw,150px);
  font-weight:800; font-style:italic;
  line-height:.9; letter-spacing:-.04em;
  color:var(--orange);
  margin:0 0 clamp(16px,3vw,26px);
}

.fl-404__title{
  font-size:clamp(26px,5vw,42px);
  font-weight:800; text-transform:uppercase;
  letter-spacing:-.01em; line-height:1.08;
  margin:0 0 16px;
}

.fl-404__text{
  font-size:clamp(15px,2.2vw,17px);
  color:var(--soft);
  max-width:44ch; margin:0 auto clamp(26px,4vw,36px);
}

.fl-404__actions{
  display:flex; flex-wrap:wrap; gap:12px; justify-content:center;
}

.fl-404__btn{
  display:inline-block;
  font-family:inherit; font-size:.95rem; font-weight:700;
  padding:14px 26px; border-radius:var(--r-pill);
  text-decoration:none; border:1px solid transparent;
  transition:background .15s ease,color .15s ease,border-color .15s ease;
}
.fl-404__btn--primary{background:var(--ink);color:var(--creme);}
.fl-404__btn--ghost{background:transparent;color:var(--ink);border-color:var(--sand);}

@media (hover:hover){
  .fl-404__btn--primary:hover{background:var(--orange);}
  .fl-404__btn--ghost:hover{border-color:var(--ink);}
}

.fl-404__btn:focus-visible{outline:2px solid var(--orange);outline-offset:2px;}
`;

export default function NotFound() {
  return (
    <>
      <style>{CSS}</style>
      <main className="fl-404">
        <div className="fl-404__inner">
          <p className="fl-404__code">404</p>
          <h1 className="fl-404__title">Diese Seite gibt es nicht</h1>
          <p className="fl-404__text">
            Vielleicht ein Tippfehler, vielleicht ist sie umgezogen. So oder so: hier
            geht es nicht weiter. Zurück zum Anfang?
          </p>
          <div className="fl-404__actions">
            <Link className="fl-404__btn fl-404__btn--primary" to="/">
              Zur Startseite
            </Link>
            <Link className="fl-404__btn fl-404__btn--ghost" to="/mentoring">
              Mein Angebot ansehen
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
