import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

/**
 * MEINE PHILOSOPHIE / ÜBER MICH - Florian Lingner
 * Eigenständige Router-Seite (/philosophie). Single-File, eigenes <style>,
 * CI wie Startseite (Creme/Sand/Ink, ein Orange-Akzent, Inter Tight).
 * Aufbau: persönliche Geschichte (Auftakt) -> 5 Kerne der Philosophie -> sanfter CTA.
 *
 * NAV: geteilter <Header/> (components/Header.jsx + .css) - auf allen Seiten gleich.
 *
 * BILDER: kommen live aus public/images/ via raw.githubusercontent.com.
 *   ueber-florian-lingner-1.jpg  -> Feature im Story-Teil (Hochformat ~4:5 passt gut)
 *   ueber-florian-lingner-2.jpg  -> breites Band vor den Kernen (~16:9 / 21:9)
 *   Solange die Dateien nicht im Repo liegen, blendet sich das jeweilige Bild
 *   einfach nicht ein (kein kaputtes Bild-Icon).
 */

const TEST_URL = "https://test.florian-lingner.ch/";

const IMG_1 = "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/ueber-florian-lingner-1.jpg";
const IMG_2 = "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/ueber-florian-lingner-2.jpg";
const SAND_BG = "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/endcta-sand.jpg";

const LOGO_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 533.93 60.95\"><g><g><path fill=\"currentColor\" d=\"M37.07.51v59.92h-9.33V24.48c0-2.31-1.8-4.11-4.11-4.11h-9.33v40.06H4.88V23.03c0-1.45-1.2-2.65-2.65-2.65H0v-4.88h4.88C4.88,8.3,9.16.51,20.12.51h16.95ZM27.74,15.49v-5.99c0-2.31-1.8-4.11-4.11-4.11h-2.48c-4.96,0-6.85,3.25-6.85,7.36,0,1.54,1.2,2.74,2.65,2.74h10.79Z\"/><path fill=\"currentColor\" d=\"M93.99,38.01c0,11.47-8.3,22.94-25.08,22.94s-25.08-11.47-25.08-22.94,8.39-23.03,25.08-23.03,25.08,11.47,25.08,23.03ZM84.32,37.92c0-9.07-5.14-18.15-15.41-18.15s-15.41,9.07-15.41,18.15,5.14,18.23,15.41,18.23,15.41-9.07,15.41-18.23Z\"/><path fill=\"currentColor\" d=\"M128.66,14.98v9.59c-11.47-4.88-18.58,1.28-18.58,13.35v22.51h-9.33V15.49h9.33v3.25c0,1.54,1.8,2.4,3,1.37,3.85-3.34,9.25-5.14,15.58-5.14Z\"/><path fill=\"currentColor\" d=\"M132.69,5.65c0-3.08,2.57-5.65,5.74-5.65s5.65,2.57,5.65,5.65-2.57,5.74-5.65,5.74-5.74-2.57-5.74-5.74ZM133.71,60.44V15.49h9.33v44.94h-9.33Z\"/><path fill=\"currentColor\" d=\"M189.78,30.48v29.96h-9.33v-2.65c0-1.63-1.97-2.57-3.17-1.46-3.6,3-8.13,4.62-13.01,4.62-9.25,0-14.55-5.05-14.55-12.07,0-9.25,8.82-18.58,29.45-18.92.68,0,1.28-.6,1.28-1.28,0-4.88-1.63-8.9-8.9-8.9-9.07,0-16.01,5.05-16.09,5.05l-3.08-3.68c.26-.26,7.1-6.16,19.18-6.16,13.18,0,18.23,5.39,18.23,15.49ZM180.45,38.01c0-1.8-1.46-3.25-3.25-3.08-12.84.77-18.06,6.59-18.06,12.84,0,4.2,3.08,7.28,8.13,7.28,7.19,0,13.18-6.42,13.18-17.04Z\"/><path fill=\"currentColor\" d=\"M239.52,29.45v30.99h-9.42v-31.07c0-5.74-3.85-8.47-9.07-8.47-7.28,0-13.27,6.42-13.27,17.04v22.51h-9.33V15.49h9.33v2.48c0,1.71,2.05,2.65,3.34,1.54,3.51-2.91,7.96-4.54,12.84-4.54,9.25,0,15.58,5.22,15.58,14.47Z\"/><path fill=\"currentColor\" d=\"M287.29,60.44V15.49h9.33v44.94h-9.33Z\"/><path fill=\"currentColor\" d=\"M346.69,29.45v30.99h-9.42v-31.07c0-5.74-3.85-8.47-9.07-8.47-7.28,0-13.27,6.42-13.27,17.04v22.51h-9.33V15.49h9.33v2.48c0,1.71,2.05,2.65,3.34,1.54,3.51-2.91,7.96-4.54,12.84-4.54,9.25,0,15.58,5.22,15.58,14.47Z\"/><path fill=\"currentColor\" d=\"M446.62,29.45v30.99h-9.42v-31.07c0-5.74-3.85-8.47-9.07-8.47-7.28,0-13.27,6.42-13.27,17.04v22.51h-9.33V15.49h9.33v2.48c0,1.71,2.05,2.65,3.34,1.54,3.51-2.91,7.96-4.54,12.84-4.54,9.25,0,15.58,5.22,15.58,14.47Z\"/><path fill=\"currentColor\" d=\"M495.07,49.99l3.08,3.77s-7.45,7.19-20.89,7.19c-16.27,0-24.31-11.47-24.31-23.03,0-15.32,11.64-22.94,23.28-22.94s23.29,7.62,23.29,22.94h-33.47c-1.97,0-3.42,1.71-3.17,3.6,1.11,7.62,5.99,14.04,14.98,14.04,10.53,0,17.21-5.56,17.21-5.56ZM462.97,33.13h23.03c2.14,0,3.68-2.14,3-4.2-2.31-6.68-7.45-9.16-12.5-9.16-5.99,0-12.07,3.42-13.52,13.35Z\"/><path fill=\"currentColor\" d=\"M533.93,14.98v9.59c-11.47-4.88-18.58,1.28-18.58,13.35v22.51h-9.33V15.49h9.33v3.25c0,1.54,1.8,2.4,3,1.37,3.85-3.34,9.25-5.14,15.58-5.14Z\"/><path fill=\"currentColor\" d=\"M287.29,51.97c-.25,2.05-1.92,3.59-4.06,3.59h-2.48c-4.96,0-6.85-3.25-6.85-7.36,0-.07.02-.14.02-.22h-.02V.51h-9.42v24.63h0v20.41c.04,7.17,4.32,14.89,15.24,14.89h7.57v-8.47Z\"/><path fill=\"currentColor\" d=\"M394.43,57.87c-.77-.59-1.73-.91-2.69-.91-.66,0-1.28.15-1.86.43-3.47,1.73-7.39,2.65-11.35,2.65-16.62,0-24.06-11.32-24.06-22.53s7.44-22.53,24.06-22.53c10.78,0,17.17,6.62,17.43,6.9l.48.51-3.38,3.56-.53-.53c-.23-.23-5.68-5.54-13.99-5.54-11.3,0-15.31,9.5-15.31,17.63s4.01,17.63,15.31,17.63c4.7,0,8.44-1.7,10.84-3.22v-9.21c0-1.52-1.21-2.75-2.69-2.75h-15.06v-5.46h26.14v24.57c0,.56-.64.87-1.08.53l-2.24-1.73Z\"/><circle fill=\"#FF4D00\" cx=\"291.95\" cy=\"5.69\" r=\"5.69\"/></g></g></svg>";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CORES = [
  {
    n: "01",
    t: "Funktionieren ist nicht leben.",
    body: (
      <>
        <p>Du stehst auf, leistest und erfüllst die Erwartungen. Von außen sieht es so aus, als würde alles laufen, doch innerlich läuft Tag für Tag ein Programm ab, das dich grade noch so lebendig hält, dass du weitermachen kannst wie bisher. <strong>Den wahren Unterschied zwischen funktionieren und leben spürst du oft erst, wenn dich etwas zwingt, hinzusehen.</strong></p>
        <p>Dieses Muster bei sich selbst zu erkennen und zu lernen, bewusster mit sich selbst umzugehen, ist der Anfang von allem.</p>
      </>
    ),
  },
  {
    n: "02",
    t: "Niemand hat uns eine Art zu denken beigebracht, die glücklich macht.",
    body: (
      <>
        <p>Von klein auf gibt es Menschen (Eltern, Lehrer, Politiker), die uns sagen, welche Richtung für uns die beste wäre. Uns wird unverblümt gesagt, was von uns erwartet wird. Mit Druck werden wir in ein System gepresst, das nur zu den wenigsten passt. Bis zum Erwachsenenalter lernen wir sooo viel, damit wir uns am Ende perfekt einfügen.</p>
        <p><strong>Aber die wirklich wichtigen Dinge bringt uns niemand bei.</strong> Und nein, ich meine nicht die Steuererklärung, sondern wie wir mit unserem Verstand und uns selbst klarkommen oder sogar lernen, damit so umzugehen, dass es uns glücklich statt depressiv macht. Genau deshalb sollten wir lernen, zu verstehen, wie wir, der Mensch generell und die Welt tickt. Ungeschönt und ehrlich. Einen klaren Blick auf die Welt zu erlangen, ist unfassbar wertvoll.</p>
      </>
    ),
  },
  {
    n: "03",
    t: "Etwas Neues lernen und jemand Neues werden sind zwei unterschiedliche Dinge.",
    body: (
      <>
        <p>Wer sich schon etwas mit persönlicher Entwicklung auseinandergesetzt hat, kennt das: Man liest ein neues Buch oder hört einen inspirierenden Vortrag und hat das Gefühl, danach auf einmal etwas verstanden zu haben. Weiter zu sein als vorher. Doch irgendwie stellt sich selbst Wochen danach noch keine Veränderung im Leben ein. Dabei war diese Erkenntnis doch soooo toll.</p>
        <p>Dass sich nichts WIRKLICH ändert, liegt daran, dass wir Schwierigkeiten haben, neue Dinge wirklich emotional zu integrieren und anschließend auch nach diesen Leitmotiven zu leben. Es kann gar nicht klappen, weil unser Glas bereits voll ist. Wir kippen oben immer mehr rein, doch es bleibt nur wenig hängen. <strong>Vielleicht geht es bei Veränderung viel mehr darum, etwas Altes zu vergessen, als etwas Neues zu lernen.</strong></p>
        <p>Ich möchte aufräumen in den Köpfen der Menschen, denn wir halten unbewusst so verzweifelt an all unserem Wissen fest, dass da gar kein Platz für die wirklich wertvollen Erkenntnisse ist. Mein Ansatz hilft Menschen dabei, sich erstmals wieder für neue Perspektiven zu öffnen und endlich Überzeugungen wahrhaftig zu verankern, sodass sie im alltäglichen Leben davon profitieren.</p>
      </>
    ),
  },
  {
    n: "04",
    t: "Niemand wird kommen, dich zu retten.",
    body: (
      <>
        <p>Ich biete dir weder eine Formel noch eine 5-Schritte-Methode, die dein Leben positiv verändern wird. Das klingt für viele hart, aber wir müssen verstehen, dass wir für unser Glück selbst verantwortlich sind. Und wer diese Verantwortung nicht annimmt und sich lieber hinter fremdbestimmenden Konzepten wie Schicksal, Astrologie, Zufall und Glück versteckt, wird das Ruder nie wirklich rumreißen können. Egal wie stark man dran zieht. Ja, Glaube kann mächtig sein, aber wir müssen uns unserer eigenen Verantwortung bewusst werden.</p>
        <p>Wie ich dir helfen kann? Ich habe abstrakte Ideen, disruptive Fragen, ehrliches Feedback, unkonventionelle Perspektiven und ein offenes Ohr für dich. Was du davon am Ende mitnimmst, entscheidest du. <strong>Ich begleite, ich rette nicht.</strong></p>
      </>
    ),
  },
  {
    n: "05",
    t: "Ich weiß, dass ich nichts weiß. Und das hat mich befreit.",
    body: (
      <>
        <p>Wissensarroganz. Eine Arroganz, die ganz viele von uns unbewusst angenommen haben, grade vom logischen / rationalen Verstand geprägte Menschen. Wird ihr Wissen in Frage gestellt, ist das so, als triggert man die Verlustangst eines liebenden Menschen. Viele halten sich so verkrampft an diesem Wissen fest, dass diese Ansammlung an Informationen ihr Leben immer mehr bestimmt.</p>
        <p>Der Schlüssel meiner eigenen Lebensphilosophie ist es, dies loszulassen - <strong>ALLES zu hinterfragen und mit Demut und Akzeptanz auf das Leben und das Menschsein zu blicken.</strong> Wer das schafft, wird freier leben als je zuvor.</p>
        <p>Ich lade dich ein, mit mir auf diese Reise zu gehen und vom rationalen, ängstlichen Zweifler endlich zur lebensfrohsten und glücklichsten Version deiner selbst zu werden.</p>
      </>
    ),
  },
];

const CSS = `
/* Vite-Defaults neutralisieren (sonst dunkler Streifen / Linksbündigkeit / Mobile-Zoom). */
:root{color-scheme:light;}
html,body,#root{margin:0; padding:0; max-width:none; width:auto; min-height:0; background:#F4F1EB; color:#1C1C1C; display:block; place-items:normal; text-align:left; font-family:'Inter Tight',system-ui,-apple-system,Segoe UI,sans-serif;}
html{scroll-behavior:smooth; scroll-padding-top:90px;}

.fl-philo{
  --creme:#F4F1EB; --sand:#D6CBBF; --warmgrau:#AFA79D;
  --ink:#1C1C1C; --orange:#FF4D00;
  --maxw:980px;
  position:relative; overflow-x:hidden;
  font-family:'Inter Tight',system-ui,-apple-system,Segoe UI,sans-serif;
  color:var(--ink); -webkit-font-smoothing:antialiased; line-height:1.6;
  background-color:var(--creme);
  background-image:
    radial-gradient(115% 80% at 6% -8%, rgba(255,77,0,.15), rgba(255,122,51,.05) 30%, rgba(244,241,235,0) 58%),
    radial-gradient(90% 60% at 100% 2%, rgba(255,77,0,.06), transparent 50%);
  background-repeat:no-repeat; background-attachment:fixed;
}
.fl-philo *{box-sizing:border-box; margin:0; padding:0;}
.fl-philo ::selection{background:var(--orange); color:var(--creme);}
.fl-philo .wrap{max-width:var(--maxw); margin:0 auto; padding:0 28px; position:relative; z-index:2;}
.fl-philo .em{color:var(--orange); font-style:italic;}

/* Korn */
.fl-philo .grain{position:fixed; inset:0; z-index:9; pointer-events:none; opacity:.10; mix-blend-mode:multiply; background-image:${GRAIN};}

/* ---- Nav: ausgelagert in geteilten <Header/> (components/Header.jsx + .css) ---- */

/* ---- Hero / Story ---- */
.fl-philo .hero{padding:150px 0 30px;}
.fl-philo .eyebrow{display:inline-block; font-size:13px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--orange); margin-bottom:22px;}
.fl-philo .hero h1{font-weight:800; letter-spacing:-.03em; line-height:.98; font-size:clamp(40px,6vw,72px); text-transform:uppercase; color:var(--ink);}
.fl-philo .hero h1 .em{background:linear-gradient(100deg,#FF4D00 0%,#FF7A33 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;}

.fl-philo .story{padding:24px 0 10px;}
.fl-philo .story .wrap{max-width:720px;}
.fl-philo .story p{font-size:clamp(17px,1.5vw,19px); color:#26241f; margin-top:20px;}
.fl-philo .story p:first-child{margin-top:0;}
.fl-philo .story p strong{font-weight:800; color:var(--ink);}

/* Feature-Bild im Story-Teil */
.fl-philo figure{margin:0;}
.fl-philo .feat{padding:34px 0 8px;}
.fl-philo .feat .wrap{max-width:720px;}
.fl-philo .feat img{width:100%; max-width:480px; aspect-ratio:4/5; object-fit:cover; border-radius:20px; display:block; box-shadow:0 30px 70px -45px rgba(28,28,28,.55);}

/* Breites Band-Bild vor den Kernen */
.fl-philo .band{padding:46px 0 6px;}
.fl-philo .band img{width:100%; aspect-ratio:16/7; object-fit:cover; border-radius:clamp(20px,3vw,34px); display:block;}

/* ---- Kerne ---- */
.fl-philo .cores{padding:54px 0 10px;}
.fl-philo .cores .head{max-width:720px;}
.fl-philo .cores .sec-eyebrow{font-size:13px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--orange); margin-bottom:16px;}
.fl-philo .cores h2{font-weight:800; letter-spacing:-.03em; line-height:1.04; font-size:clamp(30px,4.4vw,52px); text-transform:uppercase; color:var(--ink);}
.fl-philo .core-list{display:flex; flex-direction:column; gap:22px; margin-top:44px;}
.fl-philo .core{background:var(--creme); border:1px solid rgba(28,28,28,.10); border-radius:22px; padding:clamp(26px,3.4vw,42px); box-shadow:0 30px 70px -58px rgba(28,28,28,.5); position:relative; overflow:hidden;}
.fl-philo .core::after{content:""; position:absolute; inset:0; pointer-events:none; opacity:.05; mix-blend-mode:multiply; background-image:${GRAIN};}
.fl-philo .core > *{position:relative; z-index:1;}
.fl-philo .core .num{font-size:13px; font-weight:700; letter-spacing:.18em; color:var(--orange); margin-bottom:12px; display:block;}
.fl-philo .core h3{font-size:clamp(22px,2.6vw,30px); font-weight:800; letter-spacing:-.02em; line-height:1.15; color:var(--ink); margin-bottom:18px;}
.fl-philo .core p{font-size:clamp(16px,1.4vw,17.5px); color:#3a3833; margin-top:14px;}
.fl-philo .core p:first-of-type{margin-top:0;}
.fl-philo .core p strong{font-weight:800; color:var(--ink);}
/* Letzter Kern (Wissensarroganz) als Crescendo dunkel hervorheben */
.fl-philo .core--peak{background:#1C1C1C; border-color:transparent;
  background-image:
    radial-gradient(70% 125% at -8% 50%, rgba(255,77,0,.28), rgba(255,77,0,0) 56%),
    radial-gradient(62% 120% at 108% 42%, rgba(255,77,0,.18), rgba(255,77,0,0) 54%);}
.fl-philo .core--peak h3{color:var(--creme);}
.fl-philo .core--peak p{color:#cfc9bf;}
.fl-philo .core--peak p strong{color:var(--creme);}
.fl-philo .core--peak::after{opacity:.16; mix-blend-mode:overlay;}

/* ---- End-CTA mit Sand-Bild (wie Startseite) ---- */
.fl-philo .endcta{position:relative; overflow:hidden; isolation:isolate; text-align:left; padding:96px 0 200px; min-height:clamp(600px,84vh,800px); display:flex; align-items:center;}
.fl-philo .endcta-bg{position:absolute; inset:0; z-index:-2;}
.fl-philo .endcta-bg img{width:100%; height:100%; object-fit:cover; object-position:center 50%;}
.fl-philo .endcta-overlay{position:absolute; inset:0; z-index:-1; background:linear-gradient(96deg, var(--creme) 8%, rgba(244,241,235,.72) 32%, rgba(244,241,235,.12) 56%, rgba(244,241,235,0) 72%);}
.fl-philo .endcta h2{font-weight:800; letter-spacing:-.025em; line-height:1.06; font-size:clamp(34px,5vw,62px); color:var(--ink);}
.fl-philo .endcta p{font-size:clamp(16px,1.4vw,18px); color:#3a3833; margin-top:22px; max-width:46ch;}
.fl-philo .cta-row{display:flex; gap:14px; flex-wrap:wrap; margin-top:40px;}
.fl-philo .btn{display:inline-flex; align-items:center; gap:9px; text-decoration:none; font-weight:600; font-size:16px; border-radius:100px; padding:15px 26px; cursor:pointer; border:0; transition:transform .2s ease, background .25s ease, color .25s ease;}
.fl-philo .btn-primary{background:var(--orange); color:var(--creme);}
.fl-philo .btn-primary:hover{transform:translateY(-2px); background:var(--ink);}
.fl-philo .btn-ghost{background:transparent; color:var(--ink); border:1.5px solid var(--ink);}
.fl-philo .btn-ghost:hover{background:var(--ink); color:var(--creme);}
.fl-philo .btn .arr{transition:transform .25s ease;}
.fl-philo .btn:hover .arr{transform:translateX(4px);}

.fl-philo a:focus-visible,.fl-philo button:focus-visible{outline:2px solid var(--orange); outline-offset:3px; border-radius:4px;}

/* ---- Reveal ---- */
.fl-philo .reveal{opacity:0; transform:translateY(20px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1);}
.fl-philo .reveal.in{opacity:1; transform:none;}

/* ---- Mobile ---- */
@media (max-width:880px){
  .fl-philo .hero{padding:120px 0 20px;}
  .fl-philo .story .wrap,.fl-philo .feat .wrap,.fl-philo .cores .head{max-width:none;}
  .fl-philo .feat img{max-width:100%;}
  .fl-philo .core{padding:26px 22px;}
  .fl-philo .eyebrow{margin-bottom:12px;}
  .fl-philo .endcta{padding:88px 0; min-height:96svh; align-items:flex-start; text-align:center;}
  .fl-philo .endcta .cta-row{justify-content:center;}
  .fl-philo .endcta p{margin-left:auto; margin-right:auto; font-size:15.5px;}
  .fl-philo .endcta-overlay{background:linear-gradient(to bottom, var(--creme) 5%, rgba(244,241,235,.94) 30%, rgba(244,241,235,.48) 46%, rgba(244,241,235,0) 60%);}
  .fl-philo .endcta-bg img{object-position:center 55%;}
}
@media (prefers-reduced-motion:reduce){
  .fl-philo .reveal{transition:none!important; opacity:1; transform:none;}
}
`;

function Foto({ src, alt, wrapClass }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null; // bevor das Bild im Repo liegt: nichts anzeigen (kein kaputtes Icon)
  return (
    <section className={wrapClass}>
      <div className="wrap reveal">
        <figure>
          <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />
        </figure>
      </div>
    </section>
  );
}

export default function Philosophie() {
  useEffect(() => {
    document.title = "Über mich & meine Philosophie | Florian Lingner";
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".fl-philo .reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.16 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="fl-philo">
      <style>{CSS}</style>

      {/* NAV - geteilter Header */}
      <Header />

      {/* HERO */}
      <header className="hero">
        <div className="wrap reveal">
          <span className="eyebrow">Über mich</span>
          <h1>Scheiß auf <span className="em">alles</span></h1>
        </div>
      </header>

      {/* STORY */}
      <section className="story">
        <div className="wrap">
          <p className="reveal">Ich bin 5-stellig verschuldet. Ich habe Angst, meiner Familie von der prekären Situation zu erzählen. Es ist alles zusammengebrochen und es überwältigt mich. <strong>Das hier ist definitiv mein Tiefpunkt.</strong> Einen Brief entfernt von der Privatinsolvenz. Ohne richtigen Job und vor allem ohne Zuversicht. Auch mein einziger Anker, meine Partnerin, kann hieran nichts ändern.</p>
          <p className="reveal">Durch diese erdrückende Existenzangst befindet sich auch mein Körper in alarmierendem Zustand. Und auch wenn die paar extra Pfunde, wegen der Ernährung, Alkohol und fehlendem Sport nicht schön sind, habe ich dennoch nicht kommen sehen, dass ich mit einer stressinduzierten Magenentzündung im Krankenhaus landen würde. Und hier liege ich nun in der Notaufnahme und <strong>erbreche mich in einen Plastikbeutel.</strong></p>
          <p className="reveal">Das war krass. Und auch wenn es nur ein paar Jahre her ist, kommt mir diese Erinnerung vor wie ein anderes Leben.</p>
        </div>
      </section>

      {/* BILD 1 */}
      <Foto src={IMG_1} alt="Florian Lingner" wrapClass="feat" />

      <section className="story">
        <div className="wrap">
          <p className="reveal"><strong>Heute bin ich unendlich dankbar für diese Phase meines Lebens.</strong> Ohne diese Erfahrung wäre ich heute nicht der, der ich bin. All das hat mich gelehrt, was im Leben wirklich zählt. Und nun, nach einigen Jahren harter, ehrlicher Arbeit an mir selbst, fühle ich mich freier, glücklicher und erfüllter als je zuvor.</p>
          <p className="reveal">Ich weiß, dass da draußen so viele Menschen, genau wie ich damals, von äußerlichen Einflüssen, negativen Gedanken und Ängsten beeinflusst werden. Die Logiker, die sich an Informationen und Fakten klammern. Die Zweifler, die das „Nein“ schon auf den Lippen haben, bevor überhaupt gefragt wurde. Oder aber auch einfach ganz normale Menschen, die sich von der Komplexität dieser Welt übermannt und orientierungslos fühlen.</p>
          <p className="reveal">Ich wünsche mir für all jene, dass sie nicht erst an einen ähnlichen Tiefpunkt gelangen müssen, um wieder zu sich zu finden. Ich habe diese Reise hinter mir. Du bist nun eingeladen, aus meinen Fehlern zu lernen, ohne sie selbst machen zu müssen.</p>
          <p className="reveal">Wer Mut mitbringt und wachsen möchte, den begleite ich heute gern auf dieser Reise. Aber Achtung! Ich begleite. Wachsen musst du selbst - denn genau hier liegt der Unterschied zu all den selbsternannten Heilsbringern und Coaches. Ich teache nicht. Ich bin nicht dein Guru, sondern ein Mensch, genau wie du. <strong>Ich biete dir keine „Formel“ oder „Methode“, lediglich ein offenes Ohr und interessante Perspektiven.</strong> Auch wenn du das vielleicht nicht hören magst: Ob sich mit der Zeit tatsächlich etwas in deinem Leben verändert, liegt in deiner Hand.</p>
        </div>
      </section>

      {/* BILD 2 */}
      <Foto src={IMG_2} alt="Florian Lingner" wrapClass="band" />

      {/* KERNE */}
      <section className="cores">
        <div className="wrap">
          <div className="head reveal">
            <div className="sec-eyebrow">Der Kern meiner Philosophie</div>
            <h2>Diese 5 Erkenntnisse haben mein Leben <span className="em">nachhaltig verändert</span>:</h2>
          </div>
          <div className="core-list">
            {CORES.map((c, i) => (
              <article className={"core reveal" + (i === CORES.length - 1 ? " core--peak" : "")} key={c.n}>
                <span className="num">{c.n}</span>
                <h3>{c.t}</h3>
                {c.body}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* END-CTA mit Sand-Bild (wie Startseite) */}
      <section className="endcta">
        <div className="endcta-bg"><img src={SAND_BG} alt="Florian Lingner am Strand" /></div>
        <div className="endcta-overlay" aria-hidden="true" />
        <div className="wrap reveal">
          <h2>Du liest das und spürst eine gewisse <span className="em">Resonanz</span> mit all dem?</h2>
          <p>Starte deine Reise direkt jetzt mit meinem eigens entwickelten Persönlichkeitstest. Es ist der ehrlichste Test auf dem Markt, wenn du bereit bist, wirklich hinzuschauen. Am Ende erhältst du kostenlos eine Analyse deines Archetypen mit persönlichem Profil. Glaub mir, diese Viertelstunde ist es wert - so einfach hast du noch nie deine blinden Flecken gespiegelt bekommen.</p>
          <div className="cta-row">
            <a className="btn btn-primary" href={TEST_URL} target="_blank" rel="noopener noreferrer">Persönlichkeitstest starten <span className="arr">→</span></a>
            <a className="btn btn-ghost" href="/mentoring">Mehr zum Mentoring <span className="arr">→</span></a>
          </div>
        </div>
      </section>

      <Footer />

      <div className="grain" aria-hidden="true" />
    </div>
  );
}
