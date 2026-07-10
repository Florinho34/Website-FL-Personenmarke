// src/pages/McDanke.jsx
// Ziel des Double-Opt-in-Buttons aus der Kit-Bestaetigungsmail.
// Route /mc-danke - noindex (SEO-Map in App.jsx) + X-Robots-Tag (vercel.json).
// NIRGENDS verlinken: ein zufaelliger Aufruf wuerde eine Bestaetigung vortaeuschen.
//
// TRACKING: feuert masterclass_confirmed mit funnel:"startseite".
// Der GTM-Tag dafuer EXISTIERT bereits (Trigger haengt am Event-Namen), er sendet
// bisher nur funnel:"test" von der Subdomain. In GTM ist KEINE Aenderung noetig -
// genau dafuer steht die Quelle als Parameter und nicht im Event-Namen.
//
// Kommt der Nutzer ohne erteilte Einwilligung hier an (typisch: Test am Laptop,
// Mail-Bestaetigung am Handy), laedt GTM nicht und das Event zaehlt nicht.
// Bekannte Luecke. Die echte Anmeldezahl steht in Kit, nicht in GA4.

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const CSS = `
.mcd{
  --creme:#F4F1EB; --sand:#D6CBBF; --warmgrau:#AFA79D;
  --ink:#1C1C1C; --orange:#FF4D00; --soft:#595854;
  --r-pill:100px;
  background:var(--creme); color:var(--ink);
  min-height:100svh;
  display:flex; align-items:center; justify-content:center;
  padding:clamp(24px,6vw,64px);
  -webkit-font-smoothing:antialiased; line-height:1.5;
}
.mcd__inner{max-width:600px; width:100%; text-align:center;}

/* Portrait ueber der Eyebrow. Hoehe automatisch, damit nichts verzerrt.
   Breite bewusst gedeckelt, sonst wirkt es ueberdimensional. */
.mcd__portrait{
  display:block; margin:0 auto clamp(18px,3vw,26px);
  width:50%; max-width:220px; height:auto;
  border-radius:50%;
}

.mcd__eyebrow{
  text-transform:uppercase; letter-spacing:.16em;
  font-size:.72rem; font-weight:700; color:var(--orange);
  margin:0 0 14px;
}
.mcd__title{
  font-size:clamp(30px,5.4vw,48px);
  font-weight:800; text-transform:uppercase;
  letter-spacing:-.02em; line-height:1.04;
  margin:0 0 18px;
}
/* Der einzige Akzent auf dieser Seite. */
.mcd__smile{color:var(--orange);}
.mcd__text{
  font-size:clamp(15px,2.2vw,17px);
  color:var(--soft);
  max-width:46ch; margin:0 auto 14px;
}
.mcd__hint{
  font-size:.82rem; color:var(--warmgrau);
  max-width:44ch; margin:0 auto clamp(28px,4vw,38px);
}
.mcd__btn{
  display:inline-block;
  font-family:inherit; font-size:.95rem; font-weight:700;
  padding:14px 26px; border-radius:var(--r-pill);
  text-decoration:none;
  background:var(--ink); color:var(--creme);
  border:1px solid transparent;
  transition:background .15s ease;
}
@media (hover:hover){ .mcd__btn:hover{background:var(--orange);} }
.mcd__btn:focus-visible{outline:2px solid var(--orange); outline-offset:2px;}
`;

export default function McDanke() {
  const fired = useRef(false);

  useEffect(() => {
    // Guard gegen den doppelten Effekt-Aufruf im StrictMode (nur Entwicklung).
    if (fired.current) return;
    fired.current = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "masterclass_confirmed", funnel: "startseite" });
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <main className="mcd">
        <div className="mcd__inner">
          <img
            className="mcd__portrait"
            src="/images/portrait-round.png"
            alt="Florian Lingner"
            width="440"
            height="440"
          />
          <p className="mcd__eyebrow">Bestätigt</p>
          <h1 className="mcd__title">
            Du bist dabei <span className="mcd__smile">:)</span>
          </h1>
          <p className="mcd__text">
            Deine Adresse ist bestätigt. Sobald die Masterclass online geht, bekommst du
            von mir eine Mail. Kein Spam, kein Countdown, kein Druck.
          </p>
          <p className="mcd__hint">
            Falls du mich bisher nur vom Vorbeiscrollen kennst: Auf der Startseite
            erfährst du, worum es mir eigentlich geht.
          </p>
          <Link className="mcd__btn" to="/">
            Lern mich kennen →
          </Link>
        </div>
      </main>
    </>
  );
}
