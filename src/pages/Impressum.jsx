import { useEffect } from "react";

/**
 * Impressum – florian-lingner.ch
 * Stand: Juni 2026
 *
 * Anbieterkennzeichnung nach schweizerischem Recht (UWG Art. 3 Abs. 1 lit. s)
 * und – da in DACH geworben wird – zusätzlich DE-tauglich gehalten.
 *
 * Drop-in für src/pages/Impressum.jsx (Route /impressum).
 * Styling über CI-Variablen, kein Tailwind. Inter Tight kommt global.
 */

export default function Impressum() {
  useEffect(() => {
    document.title = "Impressum – Florian Lingner";
  }, []);

  return (
    <div className="legal">
      <style>{css}</style>

      {/* Kopfzeile: Logo + Zurück */}
      <div className="legal__bar">
        <a className="legal__logo" href="/">florian lingner</a>
        <a className="legal__back" href="/">← Zurück zur Startseite</a>
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
          <p className="legal__address">
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
            <a href="mailto:Kontakt@florian-lingner.ch">
              Kontakt@florian-lingner.ch
            </a>
            <br />
            Web:{" "}
            <a href="https://florian-lingner.ch">florian-lingner.ch</a>
          </p>
        </section>

        <section className="legal__sec">
          <h2>Mehrwertsteuer</h2>
          <p>
            Es besteht keine Mehrwertsteuer- bzw. Unternehmens-Identifikations­nummer
            (nicht mehrwertsteuerpflichtig).
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
            Seiten (Texte, Grafiken, Logos, Bilder) unterliegen dem
            Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die
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
        <a href="/impressum">Impressum</a>
        <span aria-hidden="true">·</span>
        <a href="/datenschutz">Datenschutz</a>
        <span aria-hidden="true">·</span>
        <a href="/">Startseite</a>
      </footer>
    </div>
  );
}

const css = `
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
  -webkit-font-smoothing: antialiased;
}

.legal a { color: var(--orange); text-decoration: none; }
.legal a:hover { text-decoration: underline; }
.legal a:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; border-radius: 2px; }

.legal__bar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
  max-width: 820px; margin: 0 auto;
  padding: 1.5rem clamp(1.25rem, 5vw, 2rem) 0;
}
.legal__logo { font-weight: 800; letter-spacing: -0.02em; color: var(--ink); font-size: 1.05rem; }
.legal__logo:hover { text-decoration: none; color: var(--orange); }
.legal__back { color: var(--warmgrau); font-size: .9rem; }
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
  font-size: clamp(2.5rem, 7vw, 4rem); margin: 0;
}
.legal__lead {
  margin: 1rem 0 0; max-width: 58ch;
  font-size: 1.05rem; line-height: 1.6; color: #4a4843;
}

.legal__sec { margin-bottom: clamp(1.75rem, 4vw, 2.5rem); }
.legal__sec h2 {
  font-weight: 800; letter-spacing: -0.02em;
  font-size: clamp(1.15rem, 2.6vw, 1.4rem); margin: 0 0 .6rem;
}
.legal__sec p {
  margin: 0; max-width: 70ch;
  font-size: 1.02rem; line-height: 1.72; color: #2c2a27;
}
.legal__address { font-style: normal; }

.legal__stand {
  margin-top: clamp(2.5rem, 6vw, 3.5rem);
  padding-top: 1.25rem;
  border-top: 1px solid var(--sand);
  font-size: .9rem; color: var(--warmgrau);
}

.legal__footer {
  max-width: 820px; margin: 0 auto;
  padding: 1.5rem clamp(1.25rem, 5vw, 2rem) 3rem;
  display: flex; gap: .75rem; flex-wrap: wrap;
  font-size: .9rem; color: var(--warmgrau);
}
.legal__footer span { color: var(--sand); }

@media (prefers-reduced-motion: reduce) {
  .legal * { scroll-behavior: auto !important; }
}
`;
