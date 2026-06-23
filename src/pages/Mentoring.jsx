import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

/**
 * MENTORING - Florian Lingner
 * Eigenstaendige Router-Seite (/mentoring). Single-File, eigenes <style>,
 * CI wie Startseite (Creme/Sand/Ink, ein Orange-Akzent, Inter Tight).
 * Verkaufsseite, bewusst "epischer" als die Philosophie-Seite, ohne vom Wesentlichen abzulenken.
 *
 * Aufbau: Hero -> Fuer wen/nicht -> Wie es laeuft -> Angebot -> Stimmen ->
 *         persoenliches Crescendo (dunkel) -> FAQ -> Anfrage (Kit-Formular).
 *
 * NAV: geteilter <Header/> (components/Header.jsx + .css) - auf allen Seiten gleich.
 *
 * ----------------------------------------------------------------------------
 * BILDER: kommen live aus public/images/ via raw.githubusercontent.com.
 *   Solange eine Datei nicht im Repo liegt, blendet sich das Bild einfach nicht
 *   ein (kein kaputtes Icon). Dateinamen sind SEO-sprechend - bitte so benennen.
 *
 *   mentoring-florian-lingner-hero.jpg      -> Hero-Band, Querformat ~21:9
 *   mentoring-starter-kit-workbook.jpg      -> Kit/Journaling im Ablauf, Hochformat ~4:5
 *   florian-lingner-mentor-portrait.jpg     -> Portrait im dunklen Crescendo, Hochformat ~4:5
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 * KIT-ANFRAGEFORMULAR (Mentoring-Anfrage):
 *   - Kit-Form "Mentoring-Anfrage" -> Form-ID 9596012 (in KIT_FORM_ID gesetzt).
 *   - Kit-Form steht auf Single-Opt-in (eine Anfrage, kein Newsletter).
 *   - Custom Fields in Kit: "anliegen" + "wunschtermin" - das Seitenformular
 *     fuellt beide getrennt. Name + E-Mail kommen als Standardfelder mit.
 *   Bei erfolgreichem Absenden (erst nach Server-OK) wird `mentoring_inquiry`
 *   in den dataLayer gepusht; das GTM-Tag dafuer (-> Meta Lead) wird separat
 *   verdrahtet, siehe Tracking-Doc.
 *
 *   Zusaetzlich geht die Anfrage in Echtzeit an einen Make-Webhook
 *   (MAKE_WEBHOOK_URL) -> Make schickt dir die Benachrichtigungs-Mail. Das ist
 *   reines Sahnehaeubchen mit eigenem Fehler-Fang: faellt Make aus, bleibt die
 *   Anfrage bei Kit und der Erfolg fuer den Nutzer unveraendert.
 * ----------------------------------------------------------------------------
 */

const TEST_URL = "https://test.florian-lingner.ch/";
const PHILO_URL = "/philosophie";

const REPO_RAW =
  "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/";
const IMG_HERO = REPO_RAW + "mentoring-florian-lingner-hero.jpg";
const IMG_HERO_MOBILE = REPO_RAW + "mentoring-florian-lingner-hero-mobile.jpg";
const IMG_KIT = REPO_RAW + "mentoring-starter-kit-workbook.jpg";
const IMG_PORTRAIT = REPO_RAW + "florian-lingner-mentor-portrait.jpg";

// --- Kit (ConvertKit) ---
const KIT_API_KEY = "ce3iKRTfk0Bz5mfbC5yCrg";
const KIT_FORM_ID = "9596012"; // Kit-Form "Mentoring-Anfrage"

// --- Make-Webhook (Benachrichtigung bei neuer Anfrage) ---
// Faengt die Anfrage in Echtzeit ab und schickt dir eine Mail. Reines
// Sahnehaeubchen: faellt Make aus, ist die Anfrage trotzdem bei Kit angekommen.
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/u9abskwali4ntc4kk9zdqcsdg3gr3zqu";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* Echte Abfolge -> Nummerierung ist hier inhaltlich gerechtfertigt. */
const STEPS = [
  { n: "01", t: "Hinschauen", d: "Bestandsaufnahme. Wo stehst du, wo sind deine Entwicklungspotenziale und was wünschst du dir? Wir schauen gemeinsam hin. Also so richtig, auch da, wo es weh tut." },
  { n: "02", t: "Aufräumen", d: "Ich gebe dir neue Perspektiven mit an die Hand, die dir helfen werden, alles, was dir bisher nicht dienlich war, loszulassen. All das muss raus. Dein Glas ist voll, wir müssen es leeren, um Platz für Neues zu schaffen." },
  { n: "03", t: "Verankern", d: "Zwischen den Sitzungen wird viel in dir passieren. Es werden neue Fragen und Erkenntnisse auftauchen. Und um all das wirklich in dein Leben zu integrieren, gebe ich dir einfache Übungen mit auf den Weg. Der wahre Fortschritt findet nämlich genau durch diese Reflektion statt. Durch das, was du am Ende draus machst. In der Stille, bei dir." },
];

const FAQ = [
  {
    q: "Kann dieser Ansatz bei jedem funktionieren?",
    a: "Nein, absolut nicht. Ich möchte zwar helfen, doch ist mir bewusst, dass sich ein Mensch in einem gewissen Stadium seiner Entwicklung befinden muss, damit wahre Transformation stattfinden kann. Wer nur gern das Gefühl hat, an sich zu arbeiten, aber die wirklich harte Arbeit außerhalb der Komfortzone scheut, der ist bei mir nicht richtig. Ich möchte deine Weltanschauung ins Wanken bringen - denn wo hat sie dich hingeführt? Ich will, dass du ALLES hinterfragst und loslässt, was dir nicht dienlich ist. Wir reißen ab und bauen neu auf. Das geht nur, wenn du bereit bist für diesen Prozess - oder anders gesagt: Wenn du einfach keinen Bock mehr hast auf Durchschnitt.",
  },
  {
    q: "Kann ich mir sicher sein, dass das Geld sinnvoll investiert ist?",
    a: "Das Thema Geld, würden die meisten hier gar nicht ansprechen… Ich schon, denn ich möchte dir etwas mitgeben: Wenn eine Sache auf der Welt es wert ist, in sie zu investieren, dann ist es Gesundheit und Wohlbefinden. Auch dein mentales Wohlbefinden. Ganz ehrlich, scheiß mal auf das neueste iPhone oder das 5-Sterne Hotel. Was wir wirklich brauchen ist Freude, Erfüllung und Echtheit. Denn ohne mit sich selbst im Reinen zu sein und zu wissen, wer man in dieser Welt wirklich sein will, macht auch all der Komfort und Reichtum nur halb so viel Spaß. Die eigentliche Frage ist: Bist du es dir wert? Und ganz ehrlich, ich hoffe von ganzem Herzen, dass die Antwort JA lautet.",
  },
  {
    q: "Wann kann ich erste Veränderung spüren?",
    a: "Klar stellt man sich diese Frage. Wenn es um eine funkelnde Belohnung am Horizont geht, möchte man sie natürlich lieber jetzt als gleich. Doch hier muss ich einmal intervenieren. Genau wie beim Thema Erfolg, gibt es keinen Weg, der „leicht und schnell reich macht“. Jeder, der das verspricht, ist schlichtweg unseriöser. Die Wahrheit ist: Kontinuität ist der Schlüssel. Jede Woche ein Prozent mehr. Jeder noch so kleine Gedanke summiert sich irgendwann zu jenem Moment, in dem es wirklich „Klick“ macht. Natürlich werden dir gewisse neue Perspektiven bei einigen Sachen direkt die Augen öffnen. Anderes wirst du erst verstehen, wenn du es immer und immer wieder beobachtet und reflektiert hast. All das ist eine Reise - ohne Fortschrittsbalken. Du wirst nie 70% vom Weg „geschafft“ haben, denn es gibt keine endgültige Erleuchtung. Das Ziel ist die Veränderung selbst und dies passiert mit jedem deiner Gedanken in dir. Und auf dieser Reise begleite ich dich als Partner, der dich unterstützt, wenn es einmal etwas holprig wird. Das wird ein Fest! Ich freue mich wahnsinnig auf deine Fortschritte!",
  },
  {
    q: "Warum sind es direkt 6 Sitzungen?",
    a: "Ganz einfach: Weil Veränderung nicht über Nacht geschieht. Selbst der Zeitraum von 3 Monaten ist schon knapp bemessen, aber irgendwo muss man ja starten ;) Am Ende wäre mein Wunsch, dass wir über einen langen Zeitraum zusammenarbeiten, ohne diesen zu benennen. Du pausierst oder stoppst, wenn du es nicht mehr fühlst und nimmst es auf, wenn du denkst, du bräuchtest wieder mehr Begleitung auf deinem Weg. Ganz unkompliziert und menschlich.",
  },
  {
    q: "Ist das jetzt eher Coaching oder Therapie?",
    a: "Weder noch. Ich biete kein Coaching an, weil ich dich nicht coache. Ich habe keinen strikten Trainingsplan. Ich will dich nicht formen, denn ich bin nicht für dein Glück verantwortlich. DU bist dafür verantwortlich. Mein Part ist, dir zur Seite zu stehen bei DEINER Entwicklung. Klar, ich gebe Impulse und biete neue Perspektiven, die dir helfen können. Manchmal werde ich auch vehement unbequeme Wahrheit aussprechen. Ich bin dein Sparringspartner für deine Entwicklung, egal wie weit es aus der Komfortzone rausgehen muss, damit wirklich was passiert. Und Therapie ist nun wirklich ein ganz anderes Thema. Ich selbst habe Psychotherapie in Anspruch genommen und meiner Meinung nach gibt es psychologische Themen, die nichts mit Willen, Einstellung und Weltanschauung zu tun haben. Wenn es um tiefer liegende Themen geht, die möglicherweise durch Traumata tief verwurzelt sind, maße ich mir nicht an, hier die Rolle eines Psychiaters zu übernehmen, nur um Geld zu verdienen. Wenn ich feststelle, dass dies über meinen Verantwortungsbereich hinausgeht, bin ich so ehrlich und verweise dich an entsprechende Experten.",
  },
  {
    q: "Was, wenn wir nicht zusammenpassen?",
    a: "Genau hierfür gibt es den Kennenlern-Call. Wenn wir merken, es passt nicht, dann ist auch das ein gutes Ergebnis.",
  },
];

/* Platzhalter-Stimmen: durch echte Zitate von Menschen ersetzen, die dich kennen. */
const QUOTES = [
  { text: "[Platzhalter: ein, zwei ehrliche Sätze einer Person, die dich kennt.]", who: "[Vorname, kurzer Kontext]" },
  { text: "[Platzhalter: ein, zwei ehrliche Sätze einer Person, die dich kennt.]", who: "[Vorname, kurzer Kontext]" },
  { text: "[Platzhalter: ein, zwei ehrliche Sätze einer Person, die dich kennt.]", who: "[Vorname, kurzer Kontext]" },
];

const CSS = `
/* Vite-Defaults neutralisieren (sonst dunkler Streifen / Linksbündigkeit / Mobile-Zoom). */
:root{color-scheme:light;}
html,body,#root{margin:0; padding:0; max-width:none; width:auto; min-height:0; background:#F4F1EB; color:#1C1C1C; display:block; place-items:normal; text-align:left; font-family:'Inter Tight',system-ui,-apple-system,Segoe UI,sans-serif;}
html{scroll-behavior:smooth; scroll-padding-top:90px;}

.fl-ment{
  --creme:#F4F1EB; --sand:#D6CBBF; --warmgrau:#AFA79D;
  --ink:#1C1C1C; --orange:#FF4D00;
  --maxw:1040px;
  position:relative; overflow-x:hidden;
  font-family:'Inter Tight',system-ui,-apple-system,Segoe UI,sans-serif;
  color:var(--ink); -webkit-font-smoothing:antialiased; line-height:1.6;
  background-color:var(--creme);
  background-image:
    radial-gradient(120% 78% at 4% -10%, rgba(255,77,0,.18), rgba(255,122,51,.06) 32%, rgba(244,241,235,0) 60%),
    radial-gradient(80% 55% at 102% 4%, rgba(255,77,0,.08), transparent 52%),
    radial-gradient(90% 60% at 96% 102%, rgba(255,77,0,.05), transparent 55%);
  background-repeat:no-repeat; background-attachment:fixed;
}
.fl-ment *{box-sizing:border-box; margin:0; padding:0;}
.fl-ment ::selection{background:var(--orange); color:var(--creme);}
.fl-ment .wrap{max-width:var(--maxw); margin:0 auto; padding:0 28px; position:relative; z-index:2;}
.fl-ment .em{color:var(--orange); font-style:italic;}
.fl-ment .grain{position:fixed; inset:0; z-index:9; pointer-events:none; opacity:.10; mix-blend-mode:multiply; background-image:${GRAIN};}

/* gemeinsame Section-Köpfe */
.fl-ment .sec-eyebrow{font-size:13px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--orange); margin-bottom:16px;}
.fl-ment h2.sec-h{font-weight:800; letter-spacing:-.03em; line-height:1.03; font-size:clamp(30px,4.6vw,54px); text-transform:uppercase; color:var(--ink);}
.fl-ment .lead{font-size:clamp(16px,1.5vw,19px); color:#3a3833; margin-top:20px; max-width:60ch;}

/* Buttons */
.fl-ment .btn{display:inline-flex; align-items:center; gap:9px; text-decoration:none; font-weight:600; font-size:16px; border-radius:100px; padding:15px 26px; cursor:pointer; border:0; transition:transform .2s ease, background .25s ease, color .25s ease;}
.fl-ment .btn-primary{background:var(--orange); color:var(--creme);}
.fl-ment .btn-primary:hover{transform:translateY(-2px); background:var(--ink);}
.fl-ment .btn-ghost{background:transparent; color:var(--ink); border:1.5px solid var(--ink);}
.fl-ment .btn-ghost:hover{background:var(--ink); color:var(--creme);}
.fl-ment .btn-light{background:transparent; color:var(--creme); border:1.5px solid rgba(244,241,235,.5);}
.fl-ment .btn-light:hover{background:var(--creme); color:var(--ink); border-color:var(--creme);}
.fl-ment .btn[disabled]{opacity:.6; cursor:default; transform:none;}
.fl-ment .btn .arr{transition:transform .25s ease;}
.fl-ment .btn:hover .arr{transform:translateX(4px);}
.fl-ment a:focus-visible,.fl-ment button:focus-visible,.fl-ment input:focus-visible,.fl-ment textarea:focus-visible{outline:2px solid var(--orange); outline-offset:3px; border-radius:4px;}

/* ---- HERO (Bild als Hintergrund, wie Startseite; kein Wortwechsler) ---- */
.fl-ment .hero{position:relative; min-height:clamp(560px,90vh,840px); display:flex; align-items:center; overflow:hidden; isolation:isolate; padding:0;}
.fl-ment .hero-bg{position:absolute; inset:0; z-index:-2;}
.fl-ment .hero-bg img{width:100%; height:100%; object-fit:cover; object-position:74% 42%;}
.fl-ment .hero-overlay{position:absolute; inset:0; z-index:-1; background:linear-gradient(96deg, var(--creme) 6%, rgba(244,241,235,.74) 28%, rgba(244,241,235,.18) 50%, rgba(244,241,235,0) 66%);}
.fl-ment .hero-inner{width:100%; padding-top:124px; padding-bottom:104px;}
.fl-ment .hero-text{max-width:600px;}
.fl-ment .hero .eyebrow{display:inline-block; font-size:13px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--orange); margin-bottom:22px;}
.fl-ment .hero h1{font-weight:800; letter-spacing:-.03em; line-height:.98; font-size:clamp(40px,5vw,64px); text-transform:uppercase; color:var(--ink);}
.fl-ment .hero h1 .em{background:linear-gradient(100deg,#FF4D00 0%,#FF7A33 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; font-style:italic; padding-right:.12em; -webkit-box-decoration-break:clone; box-decoration-break:clone;}
.fl-ment .hero .lead{margin-top:26px; max-width:54ch; font-size:clamp(16px,1.55vw,19.5px);}
.fl-ment .cta-row{display:flex; gap:14px; flex-wrap:wrap; margin-top:38px;}

/* ---- generische Section-Abstände ---- */
.fl-ment .sec{padding:clamp(56px,8vw,100px) 0;}

/* ---- Karten (Für wen / Angebot) ---- */
.fl-ment .duo{display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:46px;}
/* Angebot: 2 kleine Kacheln links gestapelt, grosse Kachel rechts auf voller Hoehe */
.fl-ment .offer-grid{display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:46px; align-items:stretch;}
.fl-ment .offer-col{display:flex; flex-direction:column; gap:20px;}
.fl-ment .offer-col .pcard{flex:1;}
.fl-ment .offer-hot{height:100%;}
.fl-ment .card{background:#FBFAF6; border:1px solid rgba(28,28,28,.09); border-radius:22px; padding:clamp(26px,3.2vw,40px); box-shadow:0 30px 70px -58px rgba(28,28,28,.5); position:relative; overflow:hidden;}
.fl-ment .card::after{content:""; position:absolute; inset:0; pointer-events:none; opacity:.04; mix-blend-mode:multiply; background-image:${GRAIN};}
.fl-ment .card > *{position:relative; z-index:1;}
.fl-ment .card .label{font-size:12px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; color:var(--orange); margin-bottom:20px;}
.fl-ment .card.neg .label{color:var(--warmgrau);}
.fl-ment .ql{list-style:none;}
.fl-ment .ql li{font-size:clamp(15.5px,1.4vw,17px); color:#34322d; line-height:1.45; padding-left:26px; position:relative; margin-bottom:14px;}
.fl-ment .ql li:last-child{margin-bottom:0;}
.fl-ment .ql li::before{content:""; position:absolute; left:0; top:11px; width:13px; height:2px; background:var(--ink); border-radius:2px;}
.fl-ment .card.neg .ql li::before{background:var(--warmgrau);}
/* "Für dich, wenn" (positive Karte): Häkchen statt Minus-Strich */
.fl-ment .card:not(.neg) .ql li::before{left:2px; top:3px; width:6px; height:11px; background:none; border:solid var(--orange); border-width:0 2.5px 2.5px 0; border-radius:0; transform:rotate(45deg);}

/* ---- Wie es läuft ---- */
.fl-ment .flow-grid{display:grid; grid-template-columns:1.08fr .92fr; gap:clamp(26px,4.4vw,58px); align-items:center; margin-top:44px;}
.fl-ment .flow-grid .intro{font-size:clamp(16px,1.45vw,18px); color:#3a3833;}
.fl-ment .chips{display:flex; flex-wrap:wrap; gap:10px; margin:24px 0 10px;}
.fl-ment .chip{display:inline-flex; align-items:center; font-size:13px; font-weight:700; letter-spacing:.02em; color:var(--ink); background:rgba(28,28,28,.06); border:1px solid rgba(28,28,28,.10); padding:8px 15px; border-radius:100px;}
.fl-ment .steps{list-style:none; margin-top:26px; display:flex; flex-direction:column; gap:18px;}
.fl-ment .steps li{display:grid; grid-template-columns:auto 1fr; gap:16px; align-items:start;}
.fl-ment .steps .sn{font-size:12px; font-weight:800; letter-spacing:.16em; color:var(--orange); padding-top:4px; min-width:26px;}
.fl-ment .steps .st{display:block; font-weight:800; font-size:17px; letter-spacing:-.01em; color:var(--ink); margin-bottom:3px;}
.fl-ment .steps .sd{font-size:15px; color:#3a3833; line-height:1.45;}
.fl-ment .flow-img img{width:100%; aspect-ratio:4/5; object-fit:cover; border-radius:22px; display:block; box-shadow:0 40px 80px -52px rgba(28,28,28,.6);}

.fl-ment .callout{margin-top:clamp(34px,5vw,54px); background:rgba(255,77,0,.06); border:1px solid rgba(255,77,0,.22); border-radius:22px; padding:clamp(24px,3.4vw,38px); font-size:clamp(16px,1.5vw,18.5px); color:#2c2a26; line-height:1.5;}
.fl-ment .callout strong{font-weight:800; color:var(--ink);}

/* ---- Angebot ---- */
.fl-ment .pcard .label{margin-bottom:14px;}
.fl-ment .price{font-weight:800; font-size:clamp(34px,4.6vw,46px); letter-spacing:-.02em; color:var(--ink); line-height:1;}
.fl-ment .pcard .meta{font-size:15px; color:#4a4842; line-height:1.5; margin-top:14px;}
.fl-ment .pcard--hot{border:1.6px solid var(--orange); box-shadow:0 40px 84px -50px rgba(255,77,0,.5);}
.fl-ment .pill{display:inline-block; background:var(--orange); color:var(--creme); font-weight:800; font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; padding:6px 14px; border-radius:100px; margin-bottom:16px;}
.fl-ment .pcard .incl{list-style:none; margin-top:20px;}
.fl-ment .pcard .incl li{font-size:15.5px; color:#34322d; line-height:1.4; padding-left:26px; position:relative; margin-bottom:13px;}
.fl-ment .pcard .incl li::before{content:""; position:absolute; left:0; top:10px; width:13px; height:2px; background:var(--orange); border-radius:2px;}
.fl-ment .pcard .foot{margin-top:22px; font-size:13.5px; color:var(--warmgrau);}

/* ---- Stimmen ---- */
.fl-ment .quotes{display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-top:44px;}
.fl-ment .quote{background:#FBFAF6; border:1px solid rgba(28,28,28,.09); border-radius:20px; padding:clamp(22px,2.6vw,30px); box-shadow:0 30px 70px -60px rgba(28,28,28,.5);}
.fl-ment .quote .mark{font-family:Georgia,serif; font-size:42px; line-height:.6; color:var(--orange); display:block; margin-bottom:10px;}
.fl-ment .quote p{font-size:16px; color:#2f2d29; line-height:1.5;}
.fl-ment .quote cite{display:block; margin-top:16px; font-style:normal; font-size:13.5px; font-weight:700; color:var(--warmgrau);}

/* ---- dunkles Crescendo (persönlich) ---- */
.fl-ment .peak-sec{padding:clamp(40px,6vw,80px) 0;}
.fl-ment .peak{position:relative; overflow:hidden; border-radius:clamp(22px,3vw,34px); padding:clamp(30px,5vw,64px); background:#1C1C1C; color:var(--creme);
  background-image:
    radial-gradient(72% 130% at -6% 50%, rgba(255,77,0,.30), rgba(255,77,0,0) 56%),
    radial-gradient(60% 120% at 106% 40%, rgba(255,77,0,.18), rgba(255,77,0,0) 54%);}
.fl-ment .peak::after{content:""; position:absolute; inset:0; pointer-events:none; opacity:.16; mix-blend-mode:overlay; background-image:${GRAIN};}
.fl-ment .peak-grid{position:relative; z-index:1; display:grid; grid-template-columns:.82fr 1.18fr; gap:clamp(26px,4vw,52px); align-items:center;}
.fl-ment .peak-grid .pimg img{width:100%; aspect-ratio:4/5; object-fit:cover; border-radius:20px; display:block;}
.fl-ment .peak .sec-eyebrow{color:#ff8a5c;}
.fl-ment .peak h2{font-weight:800; letter-spacing:-.025em; line-height:1.06; font-size:clamp(28px,3.6vw,44px); color:var(--creme);}
.fl-ment .peak p{font-size:clamp(16px,1.5vw,18.5px); color:#cfc9bf; margin-top:20px; max-width:52ch;}
.fl-ment .peak .sig{font-family:'Caveat',cursive; font-weight:600; font-size:38px; line-height:.9; color:var(--creme); margin-top:26px;}
.fl-ment .peak .peak-cta{margin-top:24px;}

/* ---- FAQ ---- */
.fl-ment .faq-wrap{max-width:780px;}
.fl-ment details{border-bottom:1px solid rgba(28,28,28,.14); padding:6px 0;}
.fl-ment details summary{list-style:none; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:18px; padding:20px 2px; font-weight:800; font-size:clamp(17px,1.8vw,20px); letter-spacing:-.01em; color:var(--ink);}
.fl-ment details summary::-webkit-details-marker{display:none;}
.fl-ment details summary .ic{flex:0 0 auto; width:26px; height:26px; border-radius:50%; border:1.5px solid var(--ink); position:relative; transition:transform .25s ease, background .25s ease, border-color .25s ease;}
.fl-ment details summary .ic::before,.fl-ment details summary .ic::after{content:""; position:absolute; background:var(--ink); border-radius:2px; transition:opacity .2s ease, background .25s ease;}
.fl-ment details summary .ic::before{left:7px; right:7px; top:11.5px; height:2px;}
.fl-ment details summary .ic::after{top:7px; bottom:7px; left:11.5px; width:2px;}
.fl-ment details[open] summary .ic{background:var(--orange); border-color:var(--orange);}
.fl-ment details[open] summary .ic::before{background:var(--creme);}
.fl-ment details[open] summary .ic::after{opacity:0;}
.fl-ment details .ans{padding:0 2px 22px; font-size:clamp(15.5px,1.4vw,17.5px); color:#3a3833; line-height:1.55; max-width:64ch;}

/* ---- Anfrage / Formular ---- */
.fl-ment .inquiry{padding:clamp(56px,8vw,104px) 0 clamp(70px,9vw,120px);}
.fl-ment .formcard{margin-top:42px; max-width:640px; background:#FBFAF6; border:1px solid rgba(28,28,28,.10); border-radius:24px; padding:clamp(26px,3.6vw,44px); box-shadow:0 44px 90px -56px rgba(28,28,28,.55);}
.fl-ment .field{margin-bottom:20px;}
.fl-ment .field label{display:block; font-size:13.5px; font-weight:700; letter-spacing:.01em; color:var(--ink); margin-bottom:9px;}
.fl-ment .field input,.fl-ment .field textarea{width:100%; font-family:inherit; font-size:16px; color:var(--ink); background:var(--creme); border:1.5px solid rgba(28,28,28,.16); border-radius:14px; padding:14px 16px; transition:border-color .2s ease, box-shadow .2s ease;}
.fl-ment .field textarea{resize:vertical; min-height:128px; line-height:1.5;}
.fl-ment .field input::placeholder,.fl-ment .field textarea::placeholder{color:#a8a299;}
.fl-ment .field input:focus,.fl-ment .field textarea:focus{outline:none; border-color:var(--orange); box-shadow:0 0 0 3px rgba(255,77,0,.14);}
.fl-ment .formcard .btn-primary{width:100%; justify-content:center; margin-top:4px;}
.fl-ment .formnote{margin-top:16px; font-size:13px; color:var(--warmgrau); text-align:center;}
.fl-ment .formerr{margin-top:16px; font-size:14.5px; color:var(--orange); font-weight:600;}
.fl-ment .formdone{text-align:center; padding:14px 0;}
.fl-ment .formdone h3{font-size:clamp(22px,2.6vw,28px); font-weight:800; letter-spacing:-.02em; color:var(--ink);}
.fl-ment .formdone p{margin-top:14px; font-size:16px; color:#3a3833;}

/* ---- Reveal ---- */
.fl-ment .reveal{opacity:0; transform:translateY(20px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1);}
.fl-ment .reveal.in{opacity:1; transform:none;}

/* ---- Mobile ---- */
@media (max-width:880px){
  .fl-ment .hero{min-height:clamp(520px,135vw,720px); align-items:flex-start;}
  .fl-ment .hero h1{font-size:34px;}
  .fl-ment .hero-inner{padding-top:96px; padding-bottom:clamp(176px,49vw,256px);}
  .fl-ment .hero-text{max-width:none;}
  .fl-ment .hero-bg img{object-position:center bottom;}
  .fl-ment .hero-overlay{background:linear-gradient(to bottom, var(--creme) 6%, rgba(244,241,235,.9) 30%, rgba(244,241,235,.42) 48%, rgba(244,241,235,0) 64%);}
  .fl-ment .duo{grid-template-columns:1fr;}
  .fl-ment .offer-grid{grid-template-columns:1fr;}
  .fl-ment .flow-grid{grid-template-columns:1fr; gap:30px;}
  .fl-ment .flow-img{order:-1;}
  .fl-ment .quotes{grid-template-columns:1fr;}
  .fl-ment .peak-grid{grid-template-columns:1fr; gap:26px;}
  .fl-ment .peak-grid .pimg{max-width:300px;}
  .fl-ment .card{padding:26px 22px;}
}
@media (prefers-reduced-motion:reduce){
  .fl-ment .reveal{transition:none!important; opacity:1; transform:none;}
  html{scroll-behavior:auto;}
}
`;

function SideImg({ src, alt, className }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <div className={className}>
      <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />
    </div>
  );
}

export default function Mentoring() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wunschtermin, setWunschtermin] = useState("");
  const [anliegen, setAnliegen] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [heroImgOk, setHeroImgOk] = useState(true);

  useEffect(() => {
    document.title = "Mentoring | Florian Lingner";
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".fl-ment .reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.16 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch(
        "https://api.convertkit.com/v3/forms/" + KIT_FORM_ID + "/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: KIT_API_KEY,
            email: email,
            first_name: name,
            fields: { anliegen: anliegen, wunschtermin: wunschtermin },
          }),
        }
      );
      if (!res.ok) throw new Error("kit");

      // Kit hat die Anfrage angenommen -> Erfolg steht fest.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "mentoring_inquiry" });
      setStatus("ok");

      // Benachrichtigung an Make. Eigener try/catch, damit ein Make-Ausfall
      // den bereits bestaetigten Erfolg niemals kippt. Als Formular-Daten
      // gesendet -> kein CORS-Preflight, kommt zuverlaessig durch.
      try {
        await fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          body: new URLSearchParams({
            name: name,
            email: email,
            wunschtermin: wunschtermin,
            anliegen: anliegen,
          }),
        });
      } catch (notifyErr) {
        // Make nicht erreichbar: egal, die Anfrage liegt sicher bei Kit.
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="fl-ment">
      <style>{CSS}</style>

      {/* NAV - geteilter Header */}
      <Header />

      {/* HERO - Bild als Hintergrund (wie Startseite), kein Wortwechsler */}
      <header className="hero">
        <div className="hero-bg" aria-hidden="true">
          {heroImgOk && (
            <picture>
              <source media="(max-width:880px)" srcSet={IMG_HERO_MOBILE} />
              <img
                src={IMG_HERO}
                alt="Florian Lingner im Mentoring-Gespräch"
                onError={() => setHeroImgOk(false)}
              />
            </picture>
          )}
        </div>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="wrap hero-inner reveal">
          <div className="hero-text">
            <span className="eyebrow">1:1 Mentoring</span>
            <h1>
              Ich kann dich nicht glücklich machen.
              <br />
              Das ist <span className="em">dein Job</span>.
            </h1>
            <p className="lead">
              Gerne arbeite ich mit dir daran, wieder mehr Freude und Erfüllung in dein Leben zu
              bringen. Der Unterschied zu gewöhnlichem Coaching: Ich stülpe dir kein starres
              Gerüst über. Ich bin gegen Schubladendenken und wir alle sollten uns und das Leben
              nicht so ernst nehmen. Lass uns beide ganz individuell hinschauen, wo der Schuh
              drückt. Dann arbeiten wir kontinuierlich, menschlich und maximal ehrlich an deinen
              Themen.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#anfrage">
                Lass uns reden <span className="arr">→</span>
              </a>
              <a className="btn btn-ghost" href="#ablauf">
                So läuft&apos;s <span className="arr">→</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* FÜR WEN / NICHT */}
      <section className="sec">
        <div className="wrap">
          <div className="reveal">
            <div className="sec-eyebrow">Klartext</div>
            <h2 className="sec-h">
              Für wen das ist.
              <br />
              Und für wen <span className="em">nicht</span>.
            </h2>
          </div>
          <div className="duo">
            <div className="card reveal">
              <div className="label">Für dich, wenn</div>
              <ul className="ql">
                <li>du spürst, dass das Leben eigentlich mehr zu bieten hätte</li>
                <li>du endlich selbst die Verantwortung für dein Glück übernehmen willst</li>
                <li>du bereit bist, die harte, ehrliche Arbeit im Trade-off für ein besseres Leben auf dich zu nehmen</li>
              </ul>
            </div>
            <div className="card neg reveal">
              <div className="label">Eher nicht, wenn</div>
              <ul className="ql">
                <li>du nach einer schnellen Wundermethode suchst</li>
                <li>du erwartest, dass dein Mentor dich retten wird</li>
                <li>du eine Garantie brauchst, dass es „funktioniert“</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WIE ES LÄUFT */}
      <section className="sec" id="ablauf">
        <div className="wrap">
          <div className="reveal">
            <div className="sec-eyebrow">Das ist der Weg</div>
            <h2 className="sec-h">
              So läuft ein <span className="em">Mentoring</span> mit mir.
            </h2>
          </div>
          <div className="flow-grid">
            <div className="reveal">
              <p className="intro">
                Wir haben über einen Zeitraum von 3 Monaten alle 2 Wochen einen Call von einer
                Stunde. Hier erhältst du wertvolle Impulse und Perspektiven. Damit diese wirken
                können, haben wir den nächsten Call erst 2 Wochen später. Während dieser Zeit ist es
                an dir, diese neuen Impulse im Alltag zu beobachten und zu implementieren. Behilflich
                dabei wird dir dein Workbook sein, das du von mir zugesandt bekommst. Außerdem zeige
                ich dir, wenn du möchtest, Übungen, die dir die Reise erleichtern werden.
              </p>
              <div className="chips">
                <span className="chip">6 Sitzungen</span>
                <span className="chip">alle 2 Wochen</span>
                <span className="chip">~3 Monate</span>
                <span className="chip">Begleitendes Workbook inkl.</span>
              </div>
              <ul className="steps">
                {STEPS.map((s) => (
                  <li key={s.n}>
                    <span className="sn">{s.n}</span>
                    <span>
                      <span className="st">{s.t}</span>
                      <span className="sd">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <SideImg
              src={IMG_KIT}
              alt="Starter-Kit mit Workbook und Journal"
              className="flow-img reveal"
            />
          </div>
          <div className="callout reveal">
            <strong>Ich will ehrlich sein:</strong> Während Sitzung 2 bis 4 kann es unbequem werden.
            So soll das sein. Denn wir wollen wachsen und das geht nicht in der kuscheligen
            Komfortzone. Nach der Phase des Widerstands folgt das Loslassen und ab da wird es
            wunderbar leicht. Deshalb biete ich nur punktuell Einzelstunden an. Wirklich
            nachhaltige, echte Veränderung passiert nur durch kontinuierliche, ehrliche Arbeit,
            nicht durch eine Solo-Sitzung.
          </div>
        </div>
      </section>

      {/* ANGEBOT */}
      <section className="sec" id="angebot">
        <div className="wrap">
          <div className="reveal">
            <div className="sec-eyebrow">Das Angebot</div>
            <h2 className="sec-h">
              Deine Wege zu <span className="em">wahrer Veränderung</span>.
            </h2>
          </div>
          <div className="offer-grid">
            <div className="offer-col">
              <div className="card pcard reveal">
                <div className="label">Einzelstunde</div>
                <div className="price">222 €</div>
                <p className="meta">
                  Für konkrete Fragen oder den Wunsch nach Impulsen. Eine Stunde volle
                  Aufmerksamkeit, kein Beschnuppern.
                </p>
              </div>
              <div className="card pcard reveal">
                <div className="label">Schnupperstunde</div>
                <div className="price">Gratis</div>
                <p className="meta">
                  Einmalig stehe ich dir für ein gegenseitiges Kennenlernen zur Verfügung. Hier
                  finden wir heraus, ob es für uns beide ein Match ist, oder nicht.
                </p>
              </div>
            </div>
            <div className="card pcard pcard--hot reveal offer-hot">
              <span className="pill">Empfohlen</span>
              <div className="label">Starter-Paket</div>
              <div className="price">1.111 €</div>
              <ul className="incl">
                <li>6 Sitzungen über ~3 Monate, alle 2 Wochen</li>
                <li>Physisches Workbook</li>
                <li>Zugang zum Onlinekurs (Wert 199 €)</li>
                <li>Pro Stunde günstiger als die Einzelstunde</li>
                <li>Nachhaltige Veränderung über langfristige Zusammenarbeit</li>
              </ul>
              <p className="foot">Bezahlt wird erst nach unserem Kennenlerngespräch, nicht per Klick.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STIMMEN */}
      <section className="sec">
        <div className="wrap">
          <div className="reveal">
            <div className="sec-eyebrow">Stimmen</div>
            <h2 className="sec-h">
              Das sagen Menschen, die mich <span className="em">persönlich</span> kennen.
            </h2>
          </div>
          <div className="quotes">
            {QUOTES.map((qt, i) => (
              <figure className="quote reveal" key={i}>
                <span className="mark" aria-hidden="true">“</span>
                <p>{qt.text}</p>
                <cite>{qt.who}</cite>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PERSÖNLICHES CRESCENDO (dunkel) */}
      <section className="peak-sec">
        <div className="wrap">
          <div className="peak reveal">
            <div className="peak-grid">
              <SideImg
                src={IMG_PORTRAIT}
                alt="Porträt von Florian Lingner"
                className="pimg"
              />
              <div>
                <div className="sec-eyebrow">Warum ich</div>
                <h2>Ich war selbst an einem Punkt, an dem „ganz okay“ eine Lüge war.</h2>
                <p>
                  Es war unbequem und viel harte, ehrliche Arbeit, doch ich habe es geschafft, mein
                  Leben um 180 Grad zu ändern. Und ich bin mir sicher, dass sich das nicht nur viele
                  ebenfalls wünschen, sondern auch, dass jeder, der sich das wahrhaft wünscht, es
                  auch schaffen kann. Bei diesem Prozess stehe ich als Mentor zur Seite. Oder nein,
                  nicht als Mentor - als Mensch. Ehrlich, direkt, unverblümt. So wie ich eben bin.
                  Und genau das unterscheidet mich von all den Coaches, die sich selbst zu ernst und
                  wichtig nehmen. Ich freue mich auf dich!
                </p>
                <div className="sig">Dein Florian</div>
                <div className="peak-cta">
                  <a className="btn btn-light" href={PHILO_URL}>
                    Meine ganze Geschichte <span className="arr">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec">
        <div className="wrap">
          <div className="reveal">
            <div className="sec-eyebrow">Ehrlich gefragt</div>
            <h2 className="sec-h">
              Das fragst du dich jetzt <span className="em">vielleicht</span>…
            </h2>
          </div>
          <div className="faq-wrap" style={{ marginTop: "40px" }}>
            {FAQ.map((item, i) => (
              <details className="reveal" key={i}>
                <summary>
                  {item.q}
                  <span className="ic" aria-hidden="true" />
                </summary>
                <div className="ans">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ANFRAGE */}
      <section className="inquiry" id="anfrage">
        <div className="wrap reveal">
          <div className="sec-eyebrow">Bist du bereit?</div>
          <h2 className="sec-h">
            Lass uns herausfinden, ob es <span className="em">passt</span>.
          </h2>
          <p className="lead">
            Vor einer wichtigen Entscheidung, denn das ist diese intime, gemeinsame Reise, müssen
            wir uns kennenlernen. In einem gemeinsamen Schnupper-Gespräch tauschen wir uns aus und
            loten in beide Richtungen aus, ob es ein Match ist, oder nicht.
          </p>

          <div className="formcard">
            {status === "ok" ? (
              <div className="formdone">
                <h3>Danke. Ich melde mich persönlich bei dir.</h3>
                <p>Schau die nächsten Tage in dein Postfach, zur Sicherheit auch im Spam.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="m-name">Wie heißt du?</label>
                  <input
                    id="m-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vorname"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="m-mail">Deine E-Mail</label>
                  <input
                    id="m-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="du@beispiel.de"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="m-termin">Wann passt es zeitlich für dich?</label>
                  <input
                    id="m-termin"
                    type="text"
                    value={wunschtermin}
                    onChange={(e) => setWunschtermin(e.target.value)}
                    placeholder="z. B. werktags abends - oder 2-3 Wunschtermine"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="m-msg">Möchtest du noch etwas mitteilen?</label>
                  <textarea
                    id="m-msg"
                    rows={5}
                    value={anliegen}
                    onChange={(e) => setAnliegen(e.target.value)}
                    placeholder="Worum geht's bei dir? Ein paar Sätze reichen."
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                  {status === "sending" ? (
                    "Wird gesendet …"
                  ) : (
                    <>
                      Anfrage senden <span className="arr">→</span>
                    </>
                  )}
                </button>
                {status === "error" && (
                  <p className="formerr">
                    Da ist etwas schiefgelaufen. Schreib mir sonst direkt an
                    Kontakt@florian-lingner.ch.
                  </p>
                )}
                <p className="formnote">Ich antworte persönlich. Kein Newsletter, kein Spam.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <div className="grain" aria-hidden="true" />
    </div>
  );
}
