// src/pages/Datenschutz.jsx
// Datenschutzerklärung – florian-lingner.ch · Stand: Juli 2026
// Erfüllt Schweizer revDSG (primär) UND EU-DSGVO (DACH-Werbung/EU-Besucher).
// Abgedeckte Dienste (live): Vercel, Google Tag Manager, Google Analytics 4,
// Microsoft Clarity, Meta Pixel, Google Fonts (CDN), Kit/ConvertKit,
// Kontakt per E-Mail, Social-Media-Links.
// Router-Seite: interne Links als <Link>. Kein Anwalt – Entwurf nach bestem Wissen.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Datenschutz() {
  useEffect(() => {
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
          <h1 className="legal__h1">Datenschutz&shy;erklärung</h1>
          <p className="legal__lead">
            Diese Erklärung informiert dich darüber, welche personenbezogenen
            Daten beim Besuch dieser Website verarbeitet werden, zu welchem Zweck
            und auf welcher Grundlage. Sie richtet sich nach dem schweizerischen
            Datenschutzgesetz (revDSG) und – soweit anwendbar – der
            EU-Datenschutz-Grundverordnung (DSGVO).
          </p>
        </header>

        <section className="legal__sec">
          <h2>1. Verantwortlicher</h2>
          <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
          <p>
            Florian Lingner<br />
            Bahnhofstrasse 14a<br />
            4133 Pratteln<br />
            Schweiz<br />
            E-Mail:{" "}
            <a href="mailto:Kontakt@florian-lingner.ch">Kontakt@florian-lingner.ch</a>
          </p>
          <p>
            Für sämtliche Fragen rund um den Datenschutz und zur Ausübung deiner
            Rechte kannst du dich jederzeit unter der oben genannten Adresse an
            mich wenden.
          </p>
        </section>

        <section className="legal__sec">
          <h2>2. Geltung &amp; anwendbares Recht</h2>
          <p>
            Als Betreiber mit Sitz in der Schweiz unterliege ich primär dem
            revidierten Schweizer Datenschutzgesetz (revDSG). Soweit diese
            Website Personen in der Europäischen Union erreicht und sich an diese
            richtet, gilt zusätzlich die DSGVO. Wo nachfolgend Rechtsgrundlagen
            nach DSGVO genannt werden, gelten für den schweizerischen Bereich die
            entsprechenden Grundsätze des revDSG (insbesondere die Bearbeitung
            nach Treu und Glauben, Verhältnismässigkeit, Zweckbindung sowie – wo
            erforderlich – die Einwilligung).
          </p>
        </section>

        <section className="legal__sec">
          <h2>3. Grundsätze &amp; Rechtsgrundlagen</h2>
          <p>
            Ich verarbeite personenbezogene Daten nur, soweit dies für die
            Bereitstellung einer funktionsfähigen Website und meiner Inhalte
            erforderlich ist oder du eingewilligt hast. Die Verarbeitung erfolgt
            insbesondere auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a
            DSGVO), zur Erfüllung vorvertraglicher/vertraglicher Massnahmen
            (Art. 6 Abs. 1 lit. b DSGVO) oder aufgrund berechtigter Interessen an
            einem sicheren, funktionierenden und bedarfsgerechten Angebot (Art. 6
            Abs. 1 lit. f DSGVO). Im Geltungsbereich des revDSG stütze ich die
            Bearbeitung auf deine Einwilligung bzw. ein überwiegendes berechtigtes
            Interesse.
          </p>
        </section>

        <section className="legal__sec">
          <h2>4. Hosting &amp; Server-Logfiles (Vercel)</h2>
          <p>
            Diese Website wird bei Vercel Inc., USA, gehostet. Beim Aufruf der
            Seite werden durch den Server automatisch Informationen erfasst, die
            dein Browser übermittelt und die technisch erforderlich sind, um die
            Website anzuzeigen und ihre Stabilität und Sicherheit zu
            gewährleisten: insbesondere IP-Adresse, Datum und Uhrzeit des
            Zugriffs, aufgerufene Seite/Datei, übertragene Datenmenge, Browsertyp
            und -version, Betriebssystem sowie die Referrer-URL.
          </p>
          <p>
            Rechtsgrundlage ist mein berechtigtes Interesse am sicheren und
            zuverlässigen Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO). Diese
            Daten werden nicht mit anderen Datenquellen zusammengeführt. Da der
            Anbieter seinen Sitz in den USA hat, kann es zu einer Übermittlung in
            ein Drittland kommen (siehe Ziff. 12). Weitere Informationen:{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>.
          </p>
        </section>

        <section className="legal__sec">
          <h2>5. Cookies &amp; Einwilligung (Consent-Banner)</h2>
          <p>
            Diese Website verwendet Cookies und vergleichbare Technologien.
            Technisch notwendige Cookies sind erforderlich, damit die Seite
            funktioniert (z. B. zum Speichern deiner Cookie-Auswahl); sie werden
            auf Grundlage meines berechtigten Interesses bzw. § 25 Abs. 2 TTDSG
            gesetzt und benötigen keine Einwilligung.
          </p>
          <p>
            Alle nicht notwendigen Cookies und Dienste (Statistik und Marketing)
            werden erst geladen, nachdem du über den Consent-Banner aktiv
            eingewilligt hast (Art. 6 Abs. 1 lit. a DSGVO bzw. Einwilligung nach
            revDSG). Bis dahin werden die entsprechenden Skripte blockiert. Die
            Steuerung erfolgt technisch über den Google Tag Manager in Verbindung
            mit Google Consent Mode v2. Du kannst deine Einwilligung jederzeit
            mit Wirkung für die Zukunft widerrufen oder anpassen, indem du die
            Cookie-Einstellungen über den entsprechenden Link im Footer erneut
            aufrufst. Der Widerruf berührt die Rechtmässigkeit der bis dahin
            erfolgten Verarbeitung nicht.
          </p>
          <p>Die Einwilligungskategorien sind:</p>
          <ul className="legal__list">
            <li><strong>Notwendig</strong> – technisch erforderlich, immer aktiv.</li>
            <li><strong>Statistik</strong> – Reichweitenmessung und Analyse (Google Analytics 4, Microsoft Clarity).</li>
            <li><strong>Marketing</strong> – Werbe- und Reichweiten-Tracking (Meta Pixel).</li>
          </ul>
        </section>

        <section className="legal__sec">
          <h2>6. Google Tag Manager</h2>
          <p>
            Zur Verwaltung von Website-Tags nutze ich den Google Tag Manager
            (Anbieter: Google Ireland Limited, Gordon House, Barrow Street,
            Dublin 4, Irland). Der Tag Manager selbst setzt keine Cookies und
            erfasst keine personenbezogenen Daten zu Analysezwecken; er dient
            ausschliesslich dazu, andere Dienste (z. B. Analyse- und
            Marketing-Tags) auszuspielen. Die Auslösung dieser Tags erfolgt erst
            nach deiner Einwilligung über den Consent-Banner. Werden Tags
            ausgelöst, kann der Tag Manager Daten an Google übermitteln (auch in
            die USA, siehe Ziff. 12).
          </p>
        </section>

        <section className="legal__sec">
          <h2>7. Google Analytics 4</h2>
          <p>
            Nach deiner Einwilligung in die Kategorie „Statistik" nutze ich
            Google Analytics 4, einen Webanalysedienst der Google Ireland Limited
            (Gordon House, Barrow Street, Dublin 4, Irland). Google Analytics
            verwendet Cookies und ähnliche Technologien, um die Nutzung der
            Website auszuwerten (z. B. aufgerufene Seiten, ungefährer Standort auf
            Basis einer gekürzten IP-Adresse, Verweildauer, verwendetes Gerät).
            Die IP-Adresse wird von Google gekürzt verarbeitet; eine direkte
            Personenbeziehbarkeit wird dadurch erschwert.
          </p>
          <p>
            Diese Daten helfen mir, die Website zu verstehen und zu verbessern.
            Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            Die Verarbeitung kann eine Übermittlung in die USA umfassen (siehe
            Ziff. 12). Du kannst deine Einwilligung jederzeit über die
            Cookie-Einstellungen widerrufen. Weitere Informationen:{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
          </p>
        </section>

        <section className="legal__sec">
          <h2>8. Microsoft Clarity</h2>
          <p>
            Nach deiner Einwilligung in die Kategorie „Statistik" nutze ich
            Microsoft Clarity (Anbieter: Microsoft Ireland Operations Limited, One
            Microsoft Place, South County Business Park, Leopardstown, Dublin 18,
            Irland). Clarity erstellt anonymisierte Auswertungen des
            Nutzungsverhaltens, z. B. über Heatmaps und aggregierte
            Sitzungsaufzeichnungen (Mausbewegungen, Klicks, Scrollverhalten), um
            die Benutzerfreundlichkeit der Website zu verstehen und zu verbessern.
            Dabei können Nutzungs- und Gerätedaten verarbeitet werden.
          </p>
          <p>
            Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            Eine Übermittlung in die USA ist möglich (siehe Ziff. 12). Weitere
            Informationen:{" "}
            <a href="https://privacy.microsoft.com/de-de/privacystatement" target="_blank" rel="noopener noreferrer">privacy.microsoft.com</a>.
          </p>
        </section>

        <section className="legal__sec">
          <h2>9. Meta Pixel (Facebook Pixel)</h2>
          <p>
            Nach deiner Einwilligung in die Kategorie „Marketing" setze ich das
            Meta Pixel ein (Anbieter: Meta Platforms Ireland Limited, 4 Grand
            Canal Square, Grand Canal Harbour, Dublin 2, Irland). Damit kann das
            Verhalten von Besucherinnen und Besuchern nachverfolgt werden, nachdem
            sie durch Anklicken einer Meta-Werbeanzeige (Facebook, Instagram) auf
            die Website weitergeleitet wurden. So lässt sich die Wirksamkeit von
            Werbeanzeigen auswerten und es lassen sich z. B. Zielgruppen für
            künftige Werbung bilden. Dabei können Daten an Meta übermittelt und
            mit deinem Meta-Konto verknüpft werden.
          </p>
          <p>
            Für die Erhebung und Übermittlung der Daten über das Pixel bin ich
            gemeinsam mit Meta verantwortlich (gemeinsame Verantwortlichkeit nach
            Art. 26 DSGVO). Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1
            lit. a DSGVO). Eine Übermittlung in die USA ist möglich (siehe
            Ziff. 12). Du kannst deine Einwilligung jederzeit über die
            Cookie-Einstellungen widerrufen. Weitere Informationen:{" "}
            <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">facebook.com/privacy/policy</a>.
          </p>
        </section>

        <section className="legal__sec">
          <h2>10. Schriftarten (Google Fonts)</h2>
          <p>
            Zur einheitlichen Darstellung von Schriften wird auf dieser Website
            die Schriftart „Inter Tight" über Google Fonts (Google Ireland
            Limited bzw. Google LLC) eingebunden. Beim Aufruf einer Seite lädt
            dein Browser die benötigten Schriftdateien von einem Google-Server.
            Dadurch erhält Google Kenntnis davon, dass über deine IP-Adresse diese
            Website aufgerufen wurde. Die Einbindung dient einer ansprechenden und
            konsistenten Darstellung meines Angebots.
          </p>
          <p>
            Rechtsgrundlage ist mein berechtigtes Interesse an einer einheitlichen
            Darstellung (Art. 6 Abs. 1 lit. f DSGVO) bzw. – soweit über den
            Consent-Banner erfasst – deine Einwilligung (Art. 6 Abs. 1 lit. a
            DSGVO). Eine Übermittlung in die USA ist möglich (siehe Ziff. 12).
            Weitere Informationen:{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
          </p>
        </section>

        <section className="legal__sec">
          <h2>11. Newsletter &amp; Anmeldungen (Kit / ConvertKit)</h2>
          <p>
            Für den Versand von Newslettern und die Verwaltung von Anmeldungen
            (z. B. zu Gratis-Inhalten) nutze ich den Dienst Kit (vormals
            ConvertKit; Anbieter: Kit, USA). Wenn du dich anmeldest, werden die
            von dir angegebenen Daten (insbesondere E-Mail-Adresse, ggf. Name)
            sowie technische Daten zur Bestätigung der Anmeldung verarbeitet und
            bei Kit gespeichert.
          </p>
          <p>
            Die Anmeldung erfolgt im Double-Opt-in-Verfahren: Nach der Anmeldung
            erhältst du eine E-Mail mit der Bitte, die Anmeldung zu bestätigen.
            Dies dient dem Nachweis, dass die Anmeldung tatsächlich von dir
            ausgeht. Zeitpunkt der Anmeldung und der Bestätigung sowie deine
            IP-Adresse können protokolliert werden. Rechtsgrundlage ist deine
            Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst den Newsletter
            jederzeit abbestellen, etwa über den Abmeldelink in jeder E-Mail; der
            Widerruf berührt die Rechtmässigkeit der bisherigen Verarbeitung
            nicht. Eine Übermittlung in die USA ist möglich (siehe Ziff. 12).
            Weitere Informationen:{" "}
            <a href="https://kit.com/privacy" target="_blank" rel="noopener noreferrer">kit.com/privacy</a>.
          </p>
        </section>

        <section className="legal__sec">
          <h2>12. Übermittlung in Drittländer (USA)</h2>
          <p>
            Mehrere der eingesetzten Dienste werden von Anbietern aus den USA
            bereitgestellt bzw. können Daten in die USA übermitteln (insbesondere
            Vercel, Google, Microsoft, Meta und Kit). In Ländern ausserhalb der
            EU/der Schweiz besteht unter Umständen kein mit dem europäischen bzw.
            schweizerischen Recht vergleichbares Datenschutzniveau.
          </p>
          <p>
            Soweit Anbieter unter dem EU-US Data Privacy Framework (bzw. dessen
            Schweizer Erweiterung) zertifiziert sind, gilt für entsprechende
            Übermittlungen ein angemessenes Datenschutzniveau. Im Übrigen stütze
            ich Übermittlungen auf geeignete Garantien, insbesondere die
            Standardvertragsklauseln der EU-Kommission, und – soweit einschlägig –
            auf deine ausdrückliche Einwilligung (Art. 49 Abs. 1 lit. a DSGVO).
            Trotz dieser Massnahmen kann nicht vollständig ausgeschlossen werden,
            dass Behörden in den USA auf Daten zugreifen.
          </p>
        </section>

        <section className="legal__sec">
          <h2>13. Kontaktaufnahme</h2>
          <p>
            Wenn du mich per E-Mail kontaktierst, werden deine Angaben
            (insbesondere E-Mail-Adresse, Name und der Inhalt deiner Nachricht)
            zur Bearbeitung deiner Anfrage verarbeitet und gespeichert.
            Rechtsgrundlage ist mein berechtigtes Interesse an der Beantwortung
            der Anfrage (Art. 6 Abs. 1 lit. f DSGVO) bzw., wenn die Anfrage auf
            einen Vertrag abzielt, Art. 6 Abs. 1 lit. b DSGVO. Ich gebe diese
            Daten nicht ohne deine Einwilligung weiter und lösche sie, sobald sie
            nicht mehr benötigt werden und keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.
          </p>
        </section>

        <section className="legal__sec">
          <h2>14. Social-Media-Links</h2>
          <p>
            Auf dieser Website findest du Links zu meinen Profilen bei Instagram,
            TikTok und Facebook. Es handelt sich um einfache Verlinkungen, nicht
            um eingebettete Inhalte (keine „Plugins"). Eine Datenübermittlung an
            diese Plattformen erfolgt erst, wenn du den jeweiligen Link anklickst
            und auf die externe Plattform wechselst. Ab diesem Zeitpunkt gelten
            die Datenschutzbestimmungen des jeweiligen Anbieters, auf die ich
            keinen Einfluss habe.
          </p>
        </section>

        <section className="legal__sec">
          <h2>15. Persönlichkeitstest (Subdomain)</h2>
          <p>
            Unter test.florian-lingner.ch biete ich einen separaten
            Persönlichkeitstest an. Diese Subdomain ist ein eigenständiges Angebot
            mit eigener Datenverarbeitung (u. a. eigene Anmeldung über Kit sowie
            eigenes Tracking nach demselben Einwilligungsprinzip). Für die dortige
            Verarbeitung gilt die jeweils auf dieser Subdomain bereitgestellte
            Datenschutzinformation.
          </p>
        </section>

        <section className="legal__sec">
          <h2>16. Vertragsabschluss über die Unterschriftsseite</h2>
          <p>
            Für den Abschluss von Mentoring-Verträgen stelle ich eine gesonderte
            Unterschriftsseite bereit. Sie ist nicht öffentlich verlinkt und für
            Suchmaschinen gesperrt; du erreichst sie nur über einen persönlichen Link.
            Wenn du dort einen Vertrag unterzeichnest, verarbeite ich die von dir
            eingegebenen und unterzeichneten Daten: Vor- und Nachname, E-Mail-Adresse,
            die Auftragsdaten (z. B. Paket, Umfang, Preis, Zahlweise), deine
            elektronische Unterschrift (als Bild) sowie den Zeitpunkt der Unterzeichnung.
          </p>
          <p>
            <strong>Zweck:</strong> Zustandekommen und Abwicklung des Mentoring-Vertrags
            sowie die Erstellung und Zusendung deiner Vertragskopie.{" "}
            <strong>Rechtsgrundlage:</strong> Erfüllung eines Vertrags bzw. Durchführung
            vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO); soweit ich zur
            Aufbewahrung verpflichtet bin, zusätzlich rechtliche Verpflichtung
            (Art. 6 Abs. 1 lit. c DSGVO).
          </p>
          <p>
            Zur technischen Abwicklung setze ich folgende Dienstleister als
            Auftragsverarbeiter ein:
          </p>
          <ul className="legal__list">
            <li>
              <strong>Make (Automatisierung)</strong> - Anbieter Make.com; Datenverarbeitung
              in der EU-Region. Nimmt die Vertragsdaten entgegen und steuert die weiteren
              Schritte.
            </li>
            <li>
              <strong>CustomJS (PDF-Erstellung)</strong> - Anbieter TechnologyCircle GmbH,
              Hamburg, Deutschland. Erzeugt aus den Vertragsdaten das PDF-Vertragsdokument.
            </li>
            <li>
              <strong>Google / Gmail (E-Mail-Versand)</strong> - Anbieter Google Ireland
              Limited. Versendet die Vertragskopie an dich und an mich. Dabei kann eine
              Übermittlung in die USA erfolgen (siehe Abschnitt „Übermittlung in
              Drittländer").
            </li>
          </ul>
          <p>
            Mit diesen Dienstleistern bestehen die datenschutzrechtlich erforderlichen
            Vereinbarungen zur Auftragsverarbeitung nach Art. 28 DSGVO.
          </p>
          <p>
            <strong>Speicherdauer:</strong> Unterschriebene Verträge und die zugehörigen
            Daten bewahre ich gemäß den gesetzlichen Aufbewahrungsfristen auf und lösche sie
            danach, sofern keine weitere Rechtsgrundlage für die Speicherung besteht.
          </p>
        </section>

        <section className="legal__sec">
          <h2>17. Speicherdauer</h2>
          <p>
            Ich speichere personenbezogene Daten nur so lange, wie es für die
            jeweiligen Zwecke erforderlich ist oder wie es gesetzliche
            Aufbewahrungsfristen vorsehen. Danach werden die Daten gelöscht oder
            anonymisiert. Bei Einwilligungen (z. B. Newsletter, Tracking) endet
            die Verarbeitung spätestens mit deinem Widerruf.
          </p>
        </section>

        <section className="legal__sec">
          <h2>18. Deine Rechte</h2>
          <p>Dir stehen im Rahmen der gesetzlichen Vorgaben folgende Rechte zu:</p>
          <ul className="legal__list">
            <li>Auskunft über die zu dir verarbeiteten Daten,</li>
            <li>Berichtigung unrichtiger Daten,</li>
            <li>Löschung („Recht auf Vergessenwerden"),</li>
            <li>Einschränkung der Verarbeitung,</li>
            <li>Datenübertragbarkeit,</li>
            <li>Widerspruch gegen Verarbeitungen, die auf berechtigtem Interesse beruhen,</li>
            <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft.</li>
          </ul>
          <p>
            Zur Ausübung deiner Rechte genügt eine formlose Nachricht an{" "}
            <a href="mailto:Kontakt@florian-lingner.ch">Kontakt@florian-lingner.ch</a>.
          </p>
        </section>

        <section className="legal__sec">
          <h2>19. Beschwerderecht</h2>
          <p>
            Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu
            beschweren. In der Schweiz ist dies der Eidgenössische Datenschutz-
            und Öffentlichkeitsbeauftragte (EDÖB),{" "}
            <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer">edoeb.admin.ch</a>.
            Innerhalb der EU kannst du dich an die für dich zuständige
            Datenschutzbehörde deines Wohnsitzlandes wenden.
          </p>
        </section>

        <section className="legal__sec">
          <h2>20. Datensicherheit</h2>
          <p>
            Diese Website nutzt eine SSL- bzw. TLS-Verschlüsselung, erkennbar am
            „https://" in der Adresszeile deines Browsers. Dadurch werden Daten,
            die du an diese Website übermittelst, gegen unbefugten Zugriff
            geschützt.
          </p>
        </section>

        <section className="legal__sec">
          <h2>21. Automatisierte Entscheidungen</h2>
          <p>
            Eine automatisierte Entscheidungsfindung einschliesslich Profiling mit
            rechtlicher Wirkung dir gegenüber findet nicht statt.
          </p>
        </section>

        <section className="legal__sec">
          <h2>22. Änderungen dieser Erklärung</h2>
          <p>
            Ich passe diese Datenschutzerklärung an, sobald Änderungen der von mir
            durchgeführten Datenverarbeitung dies erforderlich machen (z. B. bei
            der Einführung neuer Dienste). Es gilt jeweils die hier
            veröffentlichte aktuelle Fassung.
          </p>
        </section>

        <p className="legal__stand">Stand: Juli 2026</p>
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
/* Grundstil (Reset, CI-Farben, Inter Tight, color-scheme:light) kommt global
   aus src/index.css. Diese Seite braucht keinen eigenen Gegen-Reset mehr. */

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
  font-size: clamp(2.1rem, 6.5vw, 3.7rem); margin: 0; color: var(--ink);
}
.legal__lead {
  margin: 1.1rem 0 0; max-width: 62ch;
  font-size: 1.05rem; line-height: 1.65; color: #4a4843;
}

.legal__sec { margin-bottom: clamp(1.75rem, 4vw, 2.5rem); }
.legal__sec h2 {
  font-weight: 800; letter-spacing: -0.02em; color: var(--ink);
  font-size: clamp(1.15rem, 2.6vw, 1.4rem); margin: 0 0 .6rem;
  scroll-margin-top: 1.5rem;
}
.legal__sec p {
  margin: 0 0 .9rem; max-width: 72ch;
  font-size: 1.02rem; line-height: 1.72; color: #2c2a27;
}
.legal__sec p:last-child { margin-bottom: 0; }

.legal__list {
  margin: .2rem 0 .9rem; padding-left: 1.2rem;
  max-width: 72ch; color: #2c2a27;
}
.legal__list li { margin-bottom: .4rem; line-height: 1.6; }
.legal__list strong { font-weight: 700; }

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
