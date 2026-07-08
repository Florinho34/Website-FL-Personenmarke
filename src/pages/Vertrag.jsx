import { useState, useRef, useEffect } from "react";

// =============================================================
// Vertrag.jsx - Unterschriftsseite fuers 1:1-Mentoring (Route /vertrag)
// Admin-Maske (?admin=KEY) erzeugt den Kundenlink (?d=...); der Kunde
// liest, scrollt, unterschreibt -> POST an den Make-Webhook.
// Kein Server, keine Datenbank, kein PDF (das uebernimmt Make).
// =============================================================

// Make-Webhook, der die zwei E-Mails ausloest:
const WEBHOOK_URL = "https://hook.eu1.make.com/z3ddjne3c9zybdpmadd86qx4n8k6lemg";
// Nur Obfuskation: Das Repo ist oeffentlich, das hier ist KEIN echtes Geheimnis.
// Wer /vertrag?admin=<KEY> kennt, sieht die Maske. Aendere den Wert nach Belieben.
const ADMIN_KEY = "flo-vertrag-2026";
const CONTRACT_VERSION = "2026-07-v1";

// Kurze, URL-sichere Kodierung der Auftragsdaten (Base64 statt langem %-Wust).
function encodeData(obj) {
  const json = JSON.stringify(obj);
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodeData(s) {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
// Kurze Schluessel im Link -> volle Feldnamen fuer die Kundenansicht.
function expand(c) {
  return {
    vorname: c.v || "", nachname: c.n || "", email: c.e || "",
    paket: c.p || "", preis: c.pr || "", sessions: c.s || "", dauer: c.d || "",
    zeitrahmen: c.z || "", zahlweise: c.zw || "", monate: c.m || "", monatsbetrag: c.mb || "",
  };
}

// Setzt Seitentitel + noindex, solange die Seite offen ist (nie indexieren).
function usePageMeta(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const m = document.createElement("meta");
    m.setAttribute("name", "robots");
    m.setAttribute("content", "noindex, nofollow");
    document.head.appendChild(m);
    return () => {
      if (m.parentNode) m.parentNode.removeChild(m);
      document.title = prevTitle;
    };
  }, [title]);
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
/* Vite-Grundstil neutralisieren (sonst dunkle Balken links/rechts, zentriert). */
html{background:#F4F1EB;color-scheme:light;}
body{margin:0;display:block;min-width:0;background:#F4F1EB;}
#root{max-width:none;width:auto;margin:0;padding:0;text-align:left;}
/* Globale Website-CSS faerbt h1..h4 hell (fuer dunkle Startseiten-Sektionen) -> hier explizit Ink. */
.flv-root h1,.flv-root h2,.flv-root h3,.flv-root h4{color:var(--ink);}
.flv-root{
  --creme:#F4F1EB; --sand:#D6CBBF; --warmgrau:#AFA79D;
  --ink:#1C1C1C; --orange:#FF4D00; --soft:#595854;
  --r-pill:100px; --r-card:22px;
  font-family:'Inter Tight',system-ui,-apple-system,sans-serif;
  background:var(--creme); color:var(--ink);
  min-height:100vh; padding:clamp(14px,4vw,34px);
  -webkit-font-smoothing:antialiased; line-height:1.5;
}
.flv-wrap{max-width:680px;margin:0 auto;}
.flv-eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:700;color:var(--orange);margin:0 0 8px;}
.flv-h1{font-size:clamp(26px,5vw,38px);font-weight:800;letter-spacing:-.02em;line-height:1.05;margin:0 0 6px;}
.flv-lead{color:var(--soft);margin:0 0 26px;font-size:15px;}
.flv-card{background:#fff;border:1px solid var(--sand);border-radius:var(--r-card);padding:clamp(18px,3.5vw,26px);box-shadow:0 20px 50px -34px rgba(28,28,28,.35);}
.flv-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:520px){.flv-grid{grid-template-columns:1fr;}}
.flv-field{display:flex;flex-direction:column;gap:6px;}
.flv-field.full{grid-column:1/-1;}
.flv-label{font-size:13px;font-weight:700;}
.flv-input,.flv-select{
  font-family:inherit;font-size:15px;color:var(--ink);
  background:var(--creme);border:1px solid var(--sand);border-radius:12px;
  padding:11px 13px;outline:none;width:100%;box-sizing:border-box;
}
.flv-input:focus,.flv-select:focus{border-color:var(--orange);}
.flv-hint{font-size:12.5px;color:var(--warmgrau);}
.flv-btn{
  font-family:inherit;font-weight:700;font-size:15px;cursor:pointer;
  border:1px solid transparent;border-radius:var(--r-pill);padding:13px 22px;
  transition:background .15s,transform .15s,opacity .15s;
}
.flv-btn--primary{background:var(--orange);color:#fff;}
.flv-btn--primary:hover{background:#e64500;}
.flv-btn--ink{background:var(--ink);color:var(--creme);}
.flv-btn--ghost{background:transparent;color:var(--ink);border-color:var(--sand);}
.flv-btn:disabled{opacity:.4;cursor:not-allowed;}
.flv-btnrow{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px;}
.flv-linkbox{background:var(--ink);color:var(--creme);border-radius:14px;padding:14px 16px;font-size:13.5px;word-break:break-all;margin:6px 0 0;}
.flv-linkbox .u{color:var(--orange);}

.flv-parties{display:flex;flex-wrap:wrap;gap:18px;margin-bottom:18px;}
.flv-party{flex:1 1 200px;background:var(--creme);border:1px solid var(--sand);border-radius:14px;padding:14px 16px;}
.flv-party h4{margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:var(--orange);}
.flv-party p{margin:0;font-size:14px;line-height:1.45;}

.flv-scrollnote{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;margin:0 0 8px;color:var(--soft);}
.flv-scrollnote.done{color:#2f7d32;}
.flv-doc{
  max-height:360px;overflow-y:auto;border:1px solid var(--sand);border-radius:16px;
  padding:20px 22px;background:var(--creme);position:relative;
}
.flv-doc h3{font-size:16px;margin:20px 0 8px;letter-spacing:-.01em;}
.flv-doc h3:first-child{margin-top:0;}
.flv-doc h4{font-size:14px;margin:14px 0 4px;}
.flv-doc p,.flv-doc li{font-size:13.5px;line-height:1.62;color:#2c2a27;margin:0 0 9px;}
.flv-doc ul{margin:0 0 9px;padding-left:18px;}
.flv-doc .small{font-size:12px;color:var(--soft);}
.flv-fade{position:sticky;bottom:-20px;height:26px;margin:0 -22px -20px;background:linear-gradient(transparent,var(--creme));pointer-events:none;}

.flv-consent{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--sand);border-radius:14px;padding:15px 16px;margin:20px 0;background:#fff;}
.flv-consent input{margin-top:3px;width:20px;height:20px;accent-color:var(--orange);flex:0 0 auto;cursor:pointer;}
.flv-consent .ch-title{font-weight:700;font-size:14.5px;margin:0 0 5px;}
.flv-consent .ch-legal{font-size:11.5px;line-height:1.5;color:var(--soft);margin:0;}

.flv-afterdoc{transition:opacity .45s ease;}
.flv-afterdoc.flv-locked{opacity:.38;}
.flv-sigwrap{margin-top:20px;}
.flv-sigcanvas{width:100%;height:150px;background:#fff;border:1px dashed var(--warmgrau);border-radius:14px;touch-action:none;display:block;cursor:crosshair;}
.flv-sigrow{display:flex;justify-content:space-between;align-items:center;margin-top:8px;}
.flv-sigrow small{color:var(--warmgrau);font-size:12.5px;}
.flv-clear{background:none;border:none;color:var(--orange);font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;}

.flv-done-check{width:56px;height:56px;border-radius:50%;background:var(--orange);color:#fff;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 16px;}
`;

export default function Vertrag() {
  usePageMeta("Mentoring-Vertrag | Florian Lingner");

  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === ADMIN_KEY;
  const d = params.get("d");
  let data = null;
  let invalid = false;
  if (d) {
    try {
      data = expand(decodeData(d));
    } catch {
      invalid = true;
    }
  }

  return (
    <div className="flv-root">
      <style>{CSS}</style>
      <div className="flv-wrap">
        {isAdmin ? <AdminMask /> : data ? <SignFlow form={data} /> : <Invalid invalid={invalid} />}
      </div>
    </div>
  );
}

// ---------- Ungueltiger / fehlender Link ---------------------
function Invalid({ invalid }) {
  return (
    <div className="flv-card" style={{ textAlign: "center" }}>
      <p className="flv-eyebrow">Mentoring-Vertrag</p>
      <h1 className="flv-h1" style={{ fontSize: 26 }}>
        {invalid ? "Link nicht lesbar" : "Kein gueltiger Vertragslink"}
      </h1>
      <p className="flv-lead" style={{ marginBottom: 0 }}>
        Bitte oeffne den persoenlichen Link, den dir Florian Lingner geschickt hat.
        Bei Fragen: Kontakt@florian-lingner.ch
      </p>
    </div>
  );
}

// ---------- 1) Eingabemaske (nur Florian) --------------------
function AdminMask() {
  const [form, setForm] = useState({
    vorname: "",
    nachname: "",
    email: "",
    paket: "Starter-Paket",
    sessions: 6,
    dauer: 60,
    zeitrahmen: 3,
    preis: 1111,
    zahlweise: "komplett",
    monate: 3,
  });
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Monatsrate automatisch aus Gesamtpreis / Anzahl Monate.
  const monatsbetrag =
    form.zahlweise === "monatlich" && Number(form.monate) > 0
      ? Math.round((Number(form.preis) / Number(form.monate)) * 100) / 100
      : "";

  function generate() {
    const compact = {
      v: form.vorname, n: form.nachname, e: form.email, p: form.paket,
      pr: form.preis, s: form.sessions, d: form.dauer, z: form.zeitrahmen,
      zw: form.zahlweise, m: form.monate, mb: monatsbetrag,
    };
    setLink(`${window.location.origin}/vertrag?d=${encodeData(compact)}`);
    setCopied(false);
  }
  function copy() {
    navigator.clipboard.writeText(link).then(() => setCopied(true)).catch(() => {});
  }

  return (
    <>
      <p className="flv-eyebrow">Nur fuer dich</p>
      <h1 className="flv-h1">Auftrag vorbereiten</h1>
      <div className="flv-card">
        <div className="flv-grid">
          <div className="flv-field"><span className="flv-label">Vorname</span><input className="flv-input" value={form.vorname} onChange={set("vorname")} /></div>
          <div className="flv-field"><span className="flv-label">Nachname</span><input className="flv-input" value={form.nachname} onChange={set("nachname")} /></div>
          <div className="flv-field full"><span className="flv-label">E-Mail des Kunden</span><input className="flv-input" value={form.email} onChange={set("email")} /></div>
          <div className="flv-field">
            <span className="flv-label">Paket</span>
            <select className="flv-select" value={form.paket} onChange={set("paket")}>
              <option>Starter-Paket</option>
              <option>Einzelstunde</option>
            </select>
          </div>
          <div className="flv-field"><span className="flv-label">Gesamtpreis (EUR)</span><input className="flv-input" type="number" value={form.preis} onChange={set("preis")} /></div>
          <div className="flv-field"><span className="flv-label">Anzahl Sessions</span><input className="flv-input" type="number" value={form.sessions} onChange={set("sessions")} /></div>
          <div className="flv-field"><span className="flv-label">Dauer je Session (Min.)</span><input className="flv-input" type="number" value={form.dauer} onChange={set("dauer")} /></div>
          <div className="flv-field"><span className="flv-label">Zeitrahmen (Monate, Richtwert)</span><input className="flv-input" type="number" value={form.zeitrahmen} onChange={set("zeitrahmen")} /></div>
          <div className="flv-field">
            <span className="flv-label">Zahlweise</span>
            <select className="flv-select" value={form.zahlweise} onChange={set("zahlweise")}>
              <option value="komplett">Komplett im Voraus</option>
              <option value="monatlich">Monatlich im Voraus</option>
            </select>
          </div>
          {form.zahlweise === "monatlich" && (
            <>
              <div className="flv-field"><span className="flv-label">Anzahl Monate (Raten)</span><input className="flv-input" type="number" value={form.monate} onChange={set("monate")} /></div>
              <div className="flv-field">
                <span className="flv-label">Monatsbetrag (automatisch)</span>
                <input className="flv-input" value={monatsbetrag === "" ? "" : monatsbetrag + " EUR"} readOnly style={{ background: "#EDE8DF", color: "#595854" }} />
              </div>
            </>
          )}
        </div>

        <div className="flv-btnrow">
          <button className="flv-btn flv-btn--ink" onClick={generate}>Kundenlink erzeugen</button>
        </div>

        {link && (
          <>
            <p className="flv-hint" style={{ marginTop: 18 }}>Diesen Link dem Kunden schicken:</p>
            <div className="flv-linkbox">{link}</div>
            <div className="flv-btnrow">
              <button className="flv-btn flv-btn--primary" onClick={copy}>{copied ? "Kopiert ✓" : "Link kopieren"}</button>
              <a className="flv-btn flv-btn--ghost" href={link} target="_blank" rel="noreferrer">Vorschau als Kunde →</a>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ---------- Kundenansicht: lesen, unterschreiben, senden ------
function SignFlow({ form }) {
  const [scrolled, setScrolled] = useState(false);
  const [early, setEarly] = useState(false);
  const [signer, setSigner] = useState(`${form.vorname || ""} ${form.nachname || ""}`.trim());
  const [hasSig, setHasSig] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(null);
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * ratio;
    c.height = rect.height * ratio;
    const ctx = c.getContext("2d");
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1C1C1C";
  }, []);

  function point(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function down(e) {
    drawing.current = true;
    const { x, y } = point(e);
    const ctx = canvasRef.current.getContext("2d");
    // Punkt sofort setzen, damit auch ein einzelner Tipp (ohne Ziehen) sichtbar ist.
    ctx.beginPath();
    ctx.fillStyle = "#1C1C1C";
    ctx.arc(x, y, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (!hasSig) setHasSig(true);
  }
  function moveP(e) { if (!drawing.current) return; const { x, y } = point(e); const ctx = canvasRef.current.getContext("2d"); ctx.lineTo(x, y); ctx.stroke(); if (!hasSig) setHasSig(true); }
  function up() { drawing.current = false; }
  function clearSig() { const c = canvasRef.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); setHasSig(false); }

  function onScroll(e) {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12) setScrolled(true);
  }

  const canSign = scrolled && signer.trim().length > 2 && hasSig && !sending;

  async function submit() {
    const record = {
      kunde: `${form.vorname || ""} ${form.nachname || ""}`.trim(),
      vorname: form.vorname || "",
      nachname: form.nachname || "",
      unterschrift_name: signer,
      email: form.email || "",
      paket: form.paket || "",
      preis: form.preis || "",
      sessions: form.sessions || "",
      dauer: form.dauer || "",
      zeitrahmen: form.zeitrahmen || "",
      zahlweise: form.zahlweise || "",
      monate: form.zahlweise === "monatlich" ? form.monate || "" : "",
      monatsbetrag: form.zahlweise === "monatlich" ? form.monatsbetrag || "" : "",
      frueher_beginn: early ? "ja" : "nein",
      zahltext:
        form.zahlweise === "komplett"
          ? `${form.preis || ""} EUR, komplett im Voraus (fällig vor der ersten Session).`
          : `${form.monate || ""} Monatsbeträge à ${form.monatsbetrag || ""} EUR, jeweils im Voraus zu Monatsbeginn.`,
      unterschrift_bild: canvasRef.current.toDataURL("image/png"),
      zeitstempel: new Date().toLocaleString("de-CH"),
      version: CONTRACT_VERSION,
    };
    setSending(true);
    setError(false);
    try {
      const body = new URLSearchParams();
      Object.entries(record).forEach(([k, v]) => body.append(k, v == null ? "" : String(v)));
      await fetch(WEBHOOK_URL, { method: "POST", mode: "no-cors", body });
      setDone(record);
    } catch (e) {
      setError(true);
      setSending(false);
    }
  }

  if (done) return <DoneView form={form} record={done} />;

  const zahlText =
    form.zahlweise === "komplett"
      ? `${form.preis} EUR, komplett im Voraus (faellig vor der ersten Session).`
      : `${form.monate} Monatsbetraege à ${form.monatsbetrag} EUR, jeweils im Voraus zu Monatsbeginn.`;

  return (
    <>
      <p className="flv-eyebrow">Mentoring-Vertrag</p>
      <h1 className="flv-h1">Dein Mentoring-Auftrag</h1>
      <p className="flv-lead">Bitte einmal komplett durchlesen und unten unterschreiben.</p>

      <div className="flv-card">
        <div className="flv-parties">
          <div className="flv-party">
            <h4>Anbieter</h4>
            <p>Florian Lingner<br />Bahnhofstrasse 14a, 4133 Pratteln, Schweiz<br />+41 76 623 26 07<br />Kontakt@florian-lingner.ch</p>
          </div>
          <div className="flv-party">
            <h4>Kunde</h4>
            <p>{form.vorname} {form.nachname}<br />{form.email}</p>
          </div>
        </div>

        <div className={"flv-scrollnote" + (scrolled ? " done" : "")}>
          {scrolled ? "✓ Vollstaendig gelesen" : "↓ Bitte bis zum Ende scrollen, um zu unterschreiben"}
        </div>

        <div className="flv-doc" onScroll={onScroll}>
          <h3>1. Leistung</h3>
          <p>{form.paket}: {form.sessions} Einzel-Sessions à {form.dauer} Minuten, nach gemeinsamer Terminvereinbarung. Mentoring, also persoenliche Begleitung - kein garantierter Erfolg, keine Therapie.</p>

          <h3>2. Preis und Zahlung</h3>
          <p>{zahlText} Als Schweizer Kleinunternehmer wird keine Umsatzsteuer ausgewiesen.</p>

          <h3>3. Zeitrahmen und nicht genutzte Sessions</h3>
          <p>Im Mittelpunkt steht die Anzahl der Sessions. Als Richtwert sind ca. {form.zeitrahmen} Monate vorgesehen; der Rahmen ist flexibel und in Absprache verlaengerbar. Nimmt der Kunde Sessions nicht in Anspruch - freiwillig oder wegen verhindernder Umstaende ohne eigenen Einfluss -, behaelt sich der Anbieter vor, diese nach Ablauf des Zeitrahmens als verfallen zu behandeln; eine anteilige Rueckerstattung erfolgt nicht.</p>
          <p>Termine koennen kostenlos bis 24 Stunden vorher verschoben werden.</p>

          <h3>4. Pflichtangaben</h3>
          <p className="small">Anbieter, Leistung, Gesamtpreis in EUR, Zahlungs- und Leistungsbedingungen, Zeitrahmen und das Widerrufsrecht sind in diesem Dokument aufgefuehrt. Kontakt fuer Beanstandungen: Kontakt@florian-lingner.ch.</p>

          <h3>5. Widerrufsbelehrung</h3>
          <h4>Widerrufsrecht</h4>
          <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gruenden diesen Vertrag zu widerrufen. Die Widerrufsfrist betraegt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
          <p>Um Ihr Widerrufsrecht auszuueben, muessen Sie uns (Florian Lingner, Bahnhofstrasse 14a, 4133 Pratteln, Schweiz, Telefon: +41 76 623 26 07, E-Mail: Kontakt@florian-lingner.ch) mittels einer eindeutigen Erklaerung (z. B. ein mit der Post versandter Brief oder eine E-Mail) ueber Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie koennen dafuer das beigefuegte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
          <p>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung ueber die Ausuebung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>
          <h4>Folgen des Widerrufs</h4>
          <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschliesslich der Lieferkosten (mit Ausnahme der zusaetzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, guenstigste Standardlieferung gewaehlt haben), unverzueglich und spaetestens binnen vierzehn Tagen ab dem Tag zurueckzuzahlen, an dem die Mitteilung ueber Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Fuer diese Rueckzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der urspruenglichen Transaktion eingesetzt haben; in keinem Fall werden Ihnen wegen dieser Rueckzahlung Entgelte berechnet.</p>
          <p>Haben Sie verlangt, dass die Dienstleistungen waehrend der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausuebung des Widerrufsrechts unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.</p>

          <h3>6. Muster-Widerrufsformular</h3>
          <p className="small">(Wenn Sie den Vertrag widerrufen wollen, dann fuellen Sie bitte dieses Formular aus und senden Sie es zurueck.)</p>
          <ul className="small">
            <li>An Florian Lingner, Bahnhofstrasse 14a, 4133 Pratteln, Schweiz, Kontakt@florian-lingner.ch:</li>
            <li>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag ueber die Erbringung der folgenden Dienstleistung (*)</li>
            <li>Bestellt am (*)/erhalten am (*)</li>
            <li>Name / Anschrift des/der Verbraucher(s)</li>
            <li>Unterschrift (nur bei Mitteilung auf Papier) / Datum</li>
          </ul>
          <p className="small">(*) Unzutreffendes streichen.</p>

          <div className="flv-fade" />
        </div>

        <div className={"flv-afterdoc" + (scrolled ? "" : " flv-locked")}>
        {/* Zustimmung vorzeitiger Beginn - optional, nicht vorausgewaehlt */}
        <label className="flv-consent">
          <input type="checkbox" checked={early} onChange={(e) => setEarly(e.target.checked)} />
          <span>
            <p className="ch-title">Beginn des Mentoring innerhalb von 14 Tagen nach Vertragsabschluss gewuenscht</p>
            <p className="ch-legal">Ich verlange ausdruecklich, dass Florian Lingner mit der Leistung (der ersten Session) bereits vor Ablauf der 14-taegigen Widerrufsfrist beginnt. Mir ist bewusst: Widerrufe ich spaeter, muss ich fuer die bis dahin erbrachten Leistungen einen anteiligen Betrag zahlen. Mein Widerrufsrecht erlischt vollstaendig, sobald die vertragliche Leistung vollstaendig erbracht ist und ich das zur Kenntnis genommen habe.</p>
          </span>
        </label>

        <div className="flv-sigwrap">
          <div className="flv-field" style={{ marginBottom: 12 }}>
            <span className="flv-label">Vollstaendiger Name</span>
            <input className="flv-input" value={signer} onChange={(e) => setSigner(e.target.value)} />
          </div>
          <span className="flv-label">Unterschrift</span>
          <canvas
            ref={canvasRef}
            className="flv-sigcanvas"
            onPointerDown={down}
            onPointerMove={moveP}
            onPointerUp={up}
            onPointerLeave={up}
          />
          <div className="flv-sigrow">
            <small>Mit Maus oder Finger im Feld unterschreiben.</small>
            <button className="flv-clear" onClick={clearSig}>Loeschen</button>
          </div>
        </div>

        <div className="flv-btnrow">
          <button className="flv-btn flv-btn--primary" disabled={!canSign} onClick={submit}>
            {sending ? "Wird gesendet..." : "Rechtsverbindlich unterschreiben"}
          </button>
        </div>
        {error && (
          <p className="flv-hint" style={{ marginTop: 10, color: "#b3261e" }}>
            Senden hat nicht geklappt. Bitte pruefe deine Verbindung und versuche es erneut.
          </p>
        )}
        {!canSign && !sending && (
          <p className="flv-hint" style={{ marginTop: 10 }}>
            Aktiv, sobald du das Dokument bis zum Ende gelesen, deinen Namen eingetragen und unterschrieben hast.
          </p>
        )}
        </div>
      </div>
    </>
  );
}

// ---------- Bestaetigung (Kundensicht) -----------------------
function DoneView({ form, record }) {
  return (
    <div className="flv-card" style={{ textAlign: "center" }}>
      <div className="flv-done-check">✓</div>
      <h1 className="flv-h1" style={{ fontSize: 26 }}>Danke, {form.vorname || "und willkommen"}!</h1>
      <p className="flv-lead">
        Dein Mentoring-Auftrag ist unterschrieben. Deine Kopie mit allen Unterlagen
        (Widerrufsbelehrung und Muster-Widerrufsformular) geht gleich per E-Mail an {form.email}.
      </p>
      <p className="flv-hint" style={{ marginBottom: 0 }}>Unterzeichnet am {record.zeitstempel}.</p>
    </div>
  );
}
