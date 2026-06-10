// src/components/Footer.jsx
// Globaler Footer für florian-lingner.ch.
// Selbst-enthaltend: eigenes Logo-SVG, eigene CI-Variablen (via Footer.css).
// Dadurch kann er beim Multipage-Port direkt nach App.jsx wandern und
// funktioniert auf jeder Seite, auch ausserhalb von .fl-root.

import { openConsentSettings } from "../lib/consent";
import "./Footer.css";

const TEST_URL = "https://test.florian-lingner.ch/";

const LOGO_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 533.93 60.95\"><g><g><path fill=\"currentColor\" d=\"M37.07.51v59.92h-9.33V24.48c0-2.31-1.8-4.11-4.11-4.11h-9.33v40.06H4.88V23.03c0-1.45-1.2-2.65-2.65-2.65H0v-4.88h4.88C4.88,8.3,9.16.51,20.12.51h16.95ZM27.74,15.49v-5.99c0-2.31-1.8-4.11-4.11-4.11h-2.48c-4.96,0-6.85,3.25-6.85,7.36,0,1.54,1.2,2.74,2.65,2.74h10.79Z\"/><path fill=\"currentColor\" d=\"M93.99,38.01c0,11.47-8.3,22.94-25.08,22.94s-25.08-11.47-25.08-22.94,8.39-23.03,25.08-23.03,25.08,11.47,25.08,23.03ZM84.32,37.92c0-9.07-5.14-18.15-15.41-18.15s-15.41,9.07-15.41,18.15,5.14,18.23,15.41,18.23,15.41-9.07,15.41-18.23Z\"/><path fill=\"currentColor\" d=\"M128.66,14.98v9.59c-11.47-4.88-18.58,1.28-18.58,13.35v22.51h-9.33V15.49h9.33v3.25c0,1.54,1.8,2.4,3,1.37,3.85-3.34,9.25-5.14,15.58-5.14Z\"/><path fill=\"currentColor\" d=\"M132.69,5.65c0-3.08,2.57-5.65,5.74-5.65s5.65,2.57,5.65,5.65-2.57,5.74-5.65,5.74-5.74-2.57-5.74-5.74ZM133.71,60.44V15.49h9.33v44.94h-9.33Z\"/><path fill=\"currentColor\" d=\"M189.78,30.48v29.96h-9.33v-2.65c0-1.63-1.97-2.57-3.17-1.46-3.6,3-8.13,4.62-13.01,4.62-9.25,0-14.55-5.05-14.55-12.07,0-9.25,8.82-18.58,29.45-18.92.68,0,1.28-.6,1.28-1.28,0-4.88-1.63-8.9-8.9-8.9-9.07,0-16.01,5.05-16.09,5.05l-3.08-3.68c.26-.26,7.1-6.16,19.18-6.16,13.18,0,18.23,5.39,18.23,15.49ZM180.45,38.01c0-1.8-1.46-3.25-3.25-3.08-12.84.77-18.06,6.59-18.06,12.84,0,4.2,3.08,7.28,8.13,7.28,7.19,0,13.18-6.42,13.18-17.04Z\"/><path fill=\"currentColor\" d=\"M239.52,29.45v30.99h-9.42v-31.07c0-5.74-3.85-8.47-9.07-8.47-7.28,0-13.27,6.42-13.27,17.04v22.51h-9.33V15.49h9.33v2.48c0,1.71,2.05,2.65,3.34,1.54,3.51-2.91,7.96-4.54,12.84-4.54,9.25,0,15.58,5.22,15.58,14.47Z\"/><path fill=\"currentColor\" d=\"M287.29,60.44V15.49h9.33v44.94h-9.33Z\"/><path fill=\"currentColor\" d=\"M346.69,29.45v30.99h-9.42v-31.07c0-5.74-3.85-8.47-9.07-8.47-7.28,0-13.27,6.42-13.27,17.04v22.51h-9.33V15.49h9.33v2.48c0,1.71,2.05,2.65,3.34,1.54,3.51-2.91,7.96-4.54,12.84-4.54,9.25,0,15.58,5.22,15.58,14.47Z\"/><path fill=\"currentColor\" d=\"M446.62,29.45v30.99h-9.42v-31.07c0-5.74-3.85-8.47-9.07-8.47-7.28,0-13.27,6.42-13.27,17.04v22.51h-9.33V15.49h9.33v2.48c0,1.71,2.05,2.65,3.34,1.54,3.51-2.91,7.96-4.54,12.84-4.54,9.25,0,15.58,5.22,15.58,14.47Z\"/><path fill=\"currentColor\" d=\"M495.07,49.99l3.08,3.77s-7.45,7.19-20.89,7.19c-16.27,0-24.31-11.47-24.31-23.03,0-15.32,11.64-22.94,23.28-22.94s23.29,7.62,23.29,22.94h-33.47c-1.97,0-3.42,1.71-3.17,3.6,1.11,7.62,5.99,14.04,14.98,14.04,10.53,0,17.21-5.56,17.21-5.56ZM462.97,33.13h23.03c2.14,0,3.68-2.14,3-4.2-2.31-6.68-7.45-9.16-12.5-9.16-5.99,0-12.07,3.42-13.52,13.35Z\"/><path fill=\"currentColor\" d=\"M533.93,14.98v9.59c-11.47-4.88-18.58,1.28-18.58,13.35v22.51h-9.33V15.49h9.33v3.25c0,1.54,1.8,2.4,3,1.37,3.85-3.34,9.25-5.14,15.58-5.14Z\"/><path fill=\"currentColor\" d=\"M287.29,51.97c-.25,2.05-1.92,3.59-4.06,3.59h-2.48c-4.96,0-6.85-3.25-6.85-7.36,0-.07.02-.14.02-.22h-.02V.51h-9.42v24.63h0v20.41c.04,7.17,4.32,14.89,15.24,14.89h7.57v-8.47Z\"/><path fill=\"currentColor\" d=\"M394.43,57.87c-.77-.59-1.73-.91-2.69-.91-.66,0-1.28.15-1.86.43-3.47,1.73-7.39,2.65-11.35,2.65-16.62,0-24.06-11.32-24.06-22.53s7.44-22.53,24.06-22.53c10.78,0,17.17,6.62,17.43,6.9l.48.51-3.38,3.56-.53-.53c-.23-.23-5.68-5.54-13.99-5.54-11.3,0-15.31,9.5-15.31,17.63s4.01,17.63,15.31,17.63c4.7,0,8.44-1.7,10.84-3.22v-9.21c0-1.52-1.21-2.75-2.69-2.75h-15.06v-5.46h26.14v24.57c0,.56-.64.87-1.08.53l-2.24-1.73Z\"/><circle fill=\"#FF4D00\" cx=\"291.95\" cy=\"5.69\" r=\"5.69\"/></g></g></svg>";

function LogoMark() {
  return <span className="fl-logo-svg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />;
}

export default function Footer() {
  return (
    <footer className="fl-foot">
      <div className="fl-wrap">
        <div className="top">
          <div>
            <a className="fl-logo" href="#top" aria-label="florian lingner"><LogoMark /></a>
            <p className="fl-foot-tagline">Ehrliche Impulse für ein Leben, das wirklich zu dir passt.</p>
          </div>
          <div className="cols">
            <div>
              <h4>Seiten</h4>
              <ul>
                <li><a href="#philosophie">Meine Philosophie</a></li>
                <li><a href="#mentoring">Mentoring</a></li>
                <li><a href="#kostenloses">Kostenloses</a></li>
                <li><a href={TEST_URL} target="_blank" rel="noopener noreferrer">Persönlichkeitstest</a></li>
              </ul>
            </div>
            <div>
              <h4>Rechtliches</h4>
              <ul>
                <li><a href="#impressum">Impressum</a></li>
                <li><a href="#datenschutz">Datenschutz</a></li>
                <li>
                  <button type="button" className="fl-foot-consent" onClick={openConsentSettings}>
                    Cookie-Einstellungen
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4>Folgen</h4>
              <ul>
                <li><a className="soc" href="#" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" /></svg>
                  Instagram</a></li>
                <li><a className="soc" href="#" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2 1.6 3.5 3.5 3.8v2.5c-1.3 0-2.5-.4-3.5-1.1v6.3c0 3-2.4 5.5-5.4 5.5S5.7 17.5 5.7 14.5 8.1 9 11.1 9c.3 0 .6 0 .9.1v2.6c-.3-.1-.6-.2-.9-.2-1.6 0-2.8 1.3-2.8 2.9s1.2 2.9 2.8 2.9 2.8-1.3 2.8-2.9V3h2.6z" /></svg>
                  TikTok</a></li>
                <li><a className="soc" href="#" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" /></svg>
                  Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bottom">
          <span>© {new Date().getFullYear()} Florian Lingner</span>
          <span>Pratteln, Schweiz</span>
        </div>
      </div>
    </footer>
  );
}
