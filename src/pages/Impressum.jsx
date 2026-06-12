// src/pages/Impressum.jsx
// Impressum – florian-lingner.ch · Stand: Juni 2026
// Anbieterkennzeichnung nach CH-Recht (UWG) + DE-tauglich (§ 5 DDG).
// Router-Seite: interne Links als <Link>, Inter Tight kommt global (index.html).
// Kein Anwalt – bestmöglicher Entwurf, im Zweifel prüfen lassen.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Impressum() {
  useEffect(() => {
    document.title = "Impressum – Florian Lingner";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal">
      <style>{css}</style>

      <div className="legal__bar">
        <Link className="legal__logo" to="/" aria-label="florian lingner – zur Startseite"><Logo /></Link>
        <Link className="legal__back" to="/">← Zurück zur Startseite</Link>
      </div>

      <main className="legal__main">
        <header className="legal__head">
          <p className="legal__eyebrow">Rechtliches</p>
          <h1 className="legal__h1">Impressum</h1>
          <p className="legal__lead">
            Angaben gemäss schweizerischem Recht (UWG) sowie § 5 DDG für
            Besucherinnen und Besucher aus Deutschland.
          </p>
        </header>

        <section className="legal__sec">
          <h2>Verantwortlich für dieses Angebot</h2>
          <p>
            Florian Lingner<br />
            Bahnhofstrasse 14a<br />
            4133 Pratteln<br />
            Schweiz
          </p>
        </section>

        <section className="legal__sec">
          <h2>Kontakt</h2>
          <p>
            E-Mail:{" "}
            <a href="mailto:Kontakt@florian-lingner.ch">Kontakt@florian-lingner.ch</a>
            <br />
            Web: <a href="https://florian-lingner.ch">florian-lingner.ch</a>
          </p>
        </section>

        <section className="legal__sec">
          <h2>Mehrwertsteuer</h2>
          <p>
            Es besteht keine Mehrwertsteuer- bzw.
            Unternehmens-Identifikationsnummer (nicht mehrwertsteuerpflichtig).
          </p>
        </section>

        <section className="legal__sec">
          <h2>Verantwortlich für den Inhalt</h2>
          <p>Florian Lingner (Anschrift wie oben).</p>
        </section>

        <section className="legal__sec">
          <h2>Haftung für Inhalte</h2>
          <p>
            Die Inhalte dieser Website wurden mit grösstmöglicher Sorgfalt
            erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der
            Inhalte wird jedoch keine Gewähr übernommen. Als Anbieter bin ich für
            eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich, jedoch nicht verpflichtet, übermittelte oder
            gespeicherte fremde Informationen zu überwachen. Verpflichtungen zur
            Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben unberührt. Eine diesbezügliche Haftung
            ist erst ab dem Zeitpunkt der Kenntnis einer konkreten
            Rechtsverletzung möglich. Bei Bekanntwerden entsprechender
            Rechtsverletzungen werden die betreffenden Inhalte umgehend entfernt.
          </p>
        </section>

        <section className="legal__sec">
          <h2>Haftung für Links</h2>
          <p>
            Dieses Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte ich keinen Einfluss habe. Deshalb kann für diese fremden
            Inhalte auch keine Gewähr übernommen werden. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstösse überprüft; rechtswidrige
            Inhalte waren nicht erkennbar. Eine permanente inhaltliche Kontrolle
            der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer
            Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
            Rechtsverletzungen werden derartige Links umgehend entfernt.
          </p>
        </section>

        <section className="legal__sec">
          <h2>Urheberrecht</h2>
          <p>
            Die durch den Betreiber erstellten Inhalte und Werke auf diesen
            Seiten (Texte, Grafiken, Logos, Bilder) unterliegen dem Urheberrecht.
            Beiträge Dritter sind als solche gekennzeichnet. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen der
            schriftlichen Zustimmung. Downloads und Kopien dieser Seite sind nur
            für den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
        </section>

        <section className="legal__sec">
          <h2>Streitbeilegung</h2>
          <p>
            Ich bin nicht bereit und nicht verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        <p className="legal__stand">Stand: Juni 2026</p>
      </main>

      <footer className="legal__footer">
        <Link to="/impressum">Impressum</Link>
        <span aria-hidden="true">·</span>
        <Link to="/datenschutz">Datenschutz</Link>
        <span aria-hidden="true">·</span>
        <Link to="/">Startseite</Link>
      </footer>
    </div>
  );
}

const css = `
/* Vite-Standard-Defaults aus index.css neutralisieren, solange diese Seite
   gemountet ist: Flex-Zentrierung von body, max-width/Padding von #root und
   dunkles color-scheme. Genau das verursachte den dunklen Streifen rechts,
   die Linksbündigkeit und die fehlende Mobile-Passung. */
html { background: #F4F1EB; color-scheme: light; }
body { margin: 0; display: block; min-width: 0; background: #F4F1EB; }
#root { max-width: none; width: auto; margin: 0; padding: 0; text-align: left; }

.legal {
  --creme:   #F4F1EB;
  --sand:    #D6CBBF;
  --warmgrau:#AFA79D;
  --ink:     #1C1C1C;
  --orange:  #FF4D00;

  background: var(--creme);
  color: var(--ink);
  font-family: "Inter Tight", system-ui, sans-serif;
  min-height: 100vh;
  text-align: left;
  overflow-wrap: break-word;
  -webkit-font-smoothing: antialiased;
}

.legal a { color: var(--orange); text-decoration: none; overflow-wrap: break-word; }
.legal a:hover { text-decoration: underline; }
.legal a:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; border-radius: 2px; }

.legal__bar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
  max-width: 820px; margin: 0 auto;
  padding: 1.5rem clamp(1.25rem, 5vw, 2rem) 0;
}
.legal__logo { display: inline-flex; align-items: center; color: var(--ink); }
.legal__logo:hover { color: var(--orange); }
.legal__logo svg { height: 22px; width: auto; display: block; }
.legal__back { color: var(--warmgrau); font-size: .9rem; white-space: nowrap; }
.legal__back:hover { color: var(--orange); }

.legal__main {
  max-width: 820px; margin: 0 auto;
  padding: clamp(2.5rem, 7vw, 4.5rem) clamp(1.25rem, 5vw, 2rem) 2rem;
}

.legal__head { margin-bottom: clamp(2.5rem, 6vw, 3.5rem); }
.legal__eyebrow {
  text-transform: uppercase; letter-spacing: 0.16em;
  font-size: .78rem; font-weight: 700; color: var(--orange);
  margin: 0 0 .75rem;
}
.legal__h1 {
  font-weight: 800; letter-spacing: -0.03em; line-height: 1.02;
  font-size: clamp(2.3rem, 7vw, 4rem); margin: 0; color: var(--ink);
}
.legal__lead {
  margin: 1rem 0 0; max-width: 58ch;
  font-size: 1.05rem; line-height: 1.6; color: #4a4843;
}

.legal__sec { margin-bottom: clamp(1.75rem, 4vw, 2.5rem); }
.legal__sec h2 {
  font-weight: 800; letter-spacing: -0.02em; color: var(--ink);
  font-size: clamp(1.15rem, 2.6vw, 1.4rem); margin: 0 0 .6rem;
}
.legal__sec p {
  margin: 0; max-width: 70ch;
  font-size: 1.02rem; line-height: 1.72; color: #2c2a27;
}

.legal__stand {
  margin-top: clamp(2.5rem, 6vw, 3.5rem);
  padding-top: 1.25rem; border-top: 1px solid var(--sand);
  font-size: .9rem; color: var(--warmgrau);
}

.legal__footer {
  max-width: 820px; margin: 0 auto;
  padding: 1.5rem clamp(1.25rem, 5vw, 2rem) 3rem;
  display: flex; gap: .75rem; flex-wrap: wrap;
  font-size: .9rem; color: var(--warmgrau);
}
.legal__footer a { color: var(--warmgrau); }
.legal__footer a:hover { color: var(--orange); }
.legal__footer span { color: var(--sand); }
`;
