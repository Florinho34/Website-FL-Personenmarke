// src/components/ConsentBanner.jsx
// Opt-in Cookie-Banner (DSG/DSGVO, Consent Mode v2).
// 3 Kategorien: Notwendig (immer an) · Statistik · Marketing.
// Setzt die Consent-Signale und lädt GTM erst nach Entscheidung.

import { useState, useEffect } from 'react';
import { getStoredConsent, saveConsent, applyConsent } from '../lib/consent';
import './ConsentBanner.css';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  const [statistik, setStatistik] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Beim Start: gespeicherte Wahl anwenden ODER Banner zeigen.
    const stored = getStoredConsent();
    if (stored) {
      applyConsent(stored); // consent update + GTM laden, kein Banner
    } else {
      setVisible(true);
    }

    // Footer-Link "Cookie-Einstellungen" kann den Banner erneut öffnen.
    const reopen = () => {
      const s = getStoredConsent();
      setStatistik(s ? s.statistik : false);
      setMarketing(s ? s.marketing : false);
      setDetails(true);
      setVisible(true);
    };
    window.addEventListener('fl:open-consent', reopen);
    return () => window.removeEventListener('fl:open-consent', reopen);
  }, []);

  function decide(stat, mkt) {
    const saved = saveConsent({ statistik: stat, marketing: mkt });
    applyConsent(saved);
    setVisible(false);
    setDetails(false);
  }

  if (!visible) return null;

  return (
    <div className="fl-consent" role="dialog" aria-modal="false" aria-label="Cookie-Einstellungen">
      <div className="fl-consent__box">
        <h2 className="fl-consent__title">
          Cookies, ganz <em>unaufgeregt</em>.
        </h2>
        <p className="fl-consent__text">
          Wir messen ein bisschen mit, um zu sehen, was auf der Seite funktioniert.
          Notwendiges läuft immer. Beim Rest entscheidest du.
        </p>

        {details && (
          <div className="fl-consent__details">
            <Row
              title="Notwendig"
              desc="Damit die Seite überhaupt läuft. Lässt sich nicht abschalten."
              checked
              locked
            />
            <Row
              title="Statistik"
              desc="Anonyme Nutzungsstatistik (Google Analytics, Microsoft Clarity). Zeigt uns, was ankommt."
              checked={statistik}
              onChange={() => setStatistik((v) => !v)}
            />
            <Row
              title="Marketing"
              desc="Reichweiten-Messung über Meta. Damit Inhalte die richtigen Leute finden."
              checked={marketing}
              onChange={() => setMarketing((v) => !v)}
            />
          </div>
        )}

        <div className="fl-consent__actions">
          {details ? (
            <>
              <button
                className="fl-consent__btn fl-consent__btn--ghost"
                onClick={() => decide(statistik, marketing)}
              >
                Auswahl speichern
              </button>
              <button
                className="fl-consent__btn fl-consent__btn--primary"
                onClick={() => decide(true, true)}
              >
                Alles akzeptieren
              </button>
            </>
          ) : (
            <>
              <button
                className="fl-consent__link"
                onClick={() => setDetails(true)}
              >
                Einstellungen
              </button>
              <div className="fl-consent__actions-main">
                <button
                  className="fl-consent__btn fl-consent__btn--ghost"
                  onClick={() => decide(false, false)}
                >
                  Nur Notwendiges
                </button>
                <button
                  className="fl-consent__btn fl-consent__btn--primary"
                  onClick={() => decide(true, true)}
                >
                  Alles akzeptieren
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Eine Kategorie-Zeile mit Toggle -----------------------------------------
function Row({ title, desc, checked, onChange, locked }) {
  return (
    <div className="fl-consent__row">
      <div className="fl-consent__row-text">
        <span className="fl-consent__row-title">{title}</span>
        <span className="fl-consent__row-desc">{desc}</span>
      </div>
      <button
        type="button"
        className={
          'fl-toggle' +
          (checked ? ' is-on' : '') +
          (locked ? ' is-locked' : '')
        }
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={locked}
        onClick={locked ? undefined : onChange}
      >
        <span className="fl-toggle__knob" />
      </button>
    </div>
  );
}
