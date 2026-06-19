import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";

/**
 * STARTSEITE — Florian Lingner (Design-Prototyp · V2)
 * Single-File React. Kein Tailwind, eigenes CSS, CI-Farben als CSS-Variablen.
 * Look: grainy warmer Hintergrund mit leichtem Orange-Verlauf, dunkle/sandfarbene
 * Sektionen als schwebende, abgerundete Panels (keine geraden Kanten).
 * Effekt-Level "Mittelweg": Scroll-Reveals, Sticky-Nav, Mythos-Flip mit Anstupser,
 * Schritt-Progress, dezente Hover-Microinteractions.
 *
 * BILDPLÄTZE (Platzhalter klar benannt, Maße im data-attrib):
 * BILDER: kommen live aus dem GitHub-Repo public/images/ via raw.githubusercontent.com.
 *   Dateinamen: hero-beach-desktop.jpg, hero-beach-mobile.jpg, portrait-round.png, endcta-sand.jpg.
 *   Logo bleibt inline als SVG (klein, einfärbbar via currentColor).
 *
 * LINKS: Persönlichkeitstest -> https://test.florian-lingner.ch/ (extern).
 *        Seiten-Links (#philosophie etc.) sind Platzhalter bis Routing steht.
 */

const TEST_URL = "https://test.florian-lingner.ch/";

const HERO_DESKTOP = "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/hero-beach-desktop.jpg";
const HERO_MOBILE = "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/hero-beach-mobile.jpg";
const PORTRAIT_ROUND = "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/portrait-round.png";
const LOGO_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 533.93 60.95\"><g><g><path fill=\"currentColor\" d=\"M37.07.51v59.92h-9.33V24.48c0-2.31-1.8-4.11-4.11-4.11h-9.33v40.06H4.88V23.03c0-1.45-1.2-2.65-2.65-2.65H0v-4.88h4.88C4.88,8.3,9.16.51,20.12.51h16.95ZM27.74,15.49v-5.99c0-2.31-1.8-4.11-4.11-4.11h-2.48c-4.96,0-6.85,3.25-6.85,7.36,0,1.54,1.2,2.74,2.65,2.74h10.79Z\"/><path fill=\"currentColor\" d=\"M93.99,38.01c0,11.47-8.3,22.94-25.08,22.94s-25.08-11.47-25.08-22.94,8.39-23.03,25.08-23.03,25.08,11.47,25.08,23.03ZM84.32,37.92c0-9.07-5.14-18.15-15.41-18.15s-15.41,9.07-15.41,18.15,5.14,18.23,15.41,18.23,15.41-9.07,15.41-18.23Z\"/><path fill=\"currentColor\" d=\"M128.66,14.98v9.59c-11.47-4.88-18.58,1.28-18.58,13.35v22.51h-9.33V15.49h9.33v3.25c0,1.54,1.8,2.4,3,1.37,3.85-3.34,9.25-5.14,15.58-5.14Z\"/><path fill=\"currentColor\" d=\"M132.69,5.65c0-3.08,2.57-5.65,5.74-5.65s5.65,2.57,5.65,5.65-2.57,5.74-5.65,5.74-5.74-2.57-5.74-5.74ZM133.71,60.44V15.49h9.33v44.94h-9.33Z\"/><path fill=\"currentColor\" d=\"M189.78,30.48v29.96h-9.33v-2.65c0-1.63-1.97-2.57-3.17-1.46-3.6,3-8.13,4.62-13.01,4.62-9.25,0-14.55-5.05-14.55-12.07,0-9.25,8.82-18.58,29.45-18.92.68,0,1.28-.6,1.28-1.28,0-4.88-1.63-8.9-8.9-8.9-9.07,0-16.01,5.05-16.09,5.05l-3.08-3.68c.26-.26,7.1-6.16,19.18-6.16,13.18,0,18.23,5.39,18.23,15.49ZM180.45,38.01c0-1.8-1.46-3.25-3.25-3.08-12.84.77-18.06,6.59-18.06,12.84,0,4.2,3.08,7.28,8.13,7.28,7.19,0,13.18-6.42,13.18-17.04Z\"/><path fill=\"currentColor\" d=\"M239.52,29.45v30.99h-9.42v-31.07c0-5.74-3.85-8.47-9.07-8.47-7.28,0-13.27,6.42-13.27,17.04v22.51h-9.33V15.49h9.33v2.48c0,1.71,2.05,2.65,3.34,1.54,3.51-2.91,7.96-4.54,12.84-4.54,9.25,0,15.58,5.22,15.58,14.47Z\"/><path fill=\"currentColor\" d=\"M287.29,60.44V15.49h9.33v44.94h-9.33Z\"/><path fill=\"currentColor\" d=\"M346.69,29.45v30.99h-9.42v-31.07c0-5.74-3.85-8.47-9.07-8.47-7.28,0-13.27,6.42-13.27,17.04v22.51h-9.33V15.49h9.33v2.48c0,1.71,2.05,2.65,3.34,1.54,3.51-2.91,7.96-4.54,12.84-4.54,9.25,0,15.58,5.22,15.58,14.47Z\"/><path fill=\"currentColor\" d=\"M446.62,29.45v30.99h-9.42v-31.07c0-5.74-3.85-8.47-9.07-8.47-7.28,0-13.27,6.42-13.27,17.04v22.51h-9.33V15.49h9.33v2.48c0,1.71,2.05,2.65,3.34,1.54,3.51-2.91,7.96-4.54,12.84-4.54,9.25,0,15.58,5.22,15.58,14.47Z\"/><path fill=\"currentColor\" d=\"M495.07,49.99l3.08,3.77s-7.45,7.19-20.89,7.19c-16.27,0-24.31-11.47-24.31-23.03,0-15.32,11.64-22.94,23.28-22.94s23.29,7.62,23.29,22.94h-33.47c-1.97,0-3.42,1.71-3.17,3.6,1.11,7.62,5.99,14.04,14.98,14.04,10.53,0,17.21-5.56,17.21-5.56ZM462.97,33.13h23.03c2.14,0,3.68-2.14,3-4.2-2.31-6.68-7.45-9.16-12.5-9.16-5.99,0-12.07,3.42-13.52,13.35Z\"/><path fill=\"currentColor\" d=\"M533.93,14.98v9.59c-11.47-4.88-18.58,1.28-18.58,13.35v22.51h-9.33V15.49h9.33v3.25c0,1.54,1.8,2.4,3,1.37,3.85-3.34,9.25-5.14,15.58-5.14Z\"/><path fill=\"currentColor\" d=\"M287.29,51.97c-.25,2.05-1.92,3.59-4.06,3.59h-2.48c-4.96,0-6.85-3.25-6.85-7.36,0-.07.02-.14.02-.22h-.02V.51h-9.42v24.63h0v20.41c.04,7.17,4.32,14.89,15.24,14.89h7.57v-8.47Z\"/><path fill=\"currentColor\" d=\"M394.43,57.87c-.77-.59-1.73-.91-2.69-.91-.66,0-1.28.15-1.86.43-3.47,1.73-7.39,2.65-11.35,2.65-16.62,0-24.06-11.32-24.06-22.53s7.44-22.53,24.06-22.53c10.78,0,17.17,6.62,17.43,6.9l.48.51-3.38,3.56-.53-.53c-.23-.23-5.68-5.54-13.99-5.54-11.3,0-15.31,9.5-15.31,17.63s4.01,17.63,15.31,17.63c4.7,0,8.44-1.7,10.84-3.22v-9.21c0-1.52-1.21-2.75-2.69-2.75h-15.06v-5.46h26.14v24.57c0,.56-.64.87-1.08.53l-2.24-1.73Z\"/><circle fill=\"#FF4D00\" cx=\"291.95\" cy=\"5.69\" r=\"5.69\"/></g></g></svg>";
const SAND_BG = "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/endcta-sand.jpg";
const CANDID_JUNGLE = "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/candid-jungle.jpg";
const BAND_LIFE = "https://raw.githubusercontent.com/Florinho34/Website-FL-Personenmarke/main/public/images/band-lifestyle.jpg";
function LogoMark() {
  return <span className="fl-logo-svg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />;
}
const POS = [
  { left: "0%", top: "50%", tx: -20, ty: -14 },
  { left: "20%", top: "0%", tx: -10, ty: -22 },
  { left: "50%", top: "0%", tx: 2, ty: -24 },
  { left: "80%", top: "0%", tx: 12, ty: -20 },
  { right: "0%", top: "50%", tx: 20, ty: -10 },
  { left: "15%", bottom: "0%", tx: -14, ty: 18 },
  { left: "55%", bottom: "0%", tx: 6, ty: 22 },
  { left: "85%", bottom: "0%", tx: 16, ty: 16 },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CSS = `
/* Vite-Defaults neutralisieren: Full-Width, dunkle Schrift, linksbündig. Font kommt aus index.html. */
:root{color-scheme:light;}
html,body,#root{margin:0; padding:0; max-width:none; width:auto; min-height:0; background:#F4F1EB; color:#1C1C1C; display:block; place-items:normal; text-align:left; font-family:'Inter Tight',system-ui,-apple-system,Segoe UI,sans-serif;}
html{scroll-behavior:smooth; scroll-padding-top:90px;}

.fl-root {
  --creme:#F4F1EB; --sand:#D6CBBF; --warmgrau:#AFA79D;
  --ink:#1C1C1C; --orange:#FF4D00;
  --maxw:1180px;
  position:relative;
  overflow-x:hidden;
  font-family:'Inter Tight',system-ui,-apple-system,Segoe UI,sans-serif;
  color:var(--ink);
  -webkit-font-smoothing:antialiased; line-height:1.55;
  background-color:var(--creme);
  background-image:
    radial-gradient(115% 80% at 6% -12%, rgba(255,77,0,.17), rgba(255,122,51,.05) 30%, rgba(244,241,235,0) 58%),
    radial-gradient(90% 60% at 100% 4%, rgba(255,77,0,.07), transparent 50%);
  background-repeat:no-repeat; background-attachment:fixed;
}
.fl-root *{box-sizing:border-box; margin:0; padding:0;}
.fl-root ::selection{background:var(--orange); color:var(--creme);}
.fl-wrap{max-width:var(--maxw); margin:0 auto; padding:0 28px; position:relative; z-index:2;}
.fl-em{color:var(--orange); font-style:italic;}

/* Film-Korn über allem */
.fl-grain{position:fixed; inset:0; z-index:9; pointer-events:none; opacity:.10; mix-blend-mode:multiply; background-image:${GRAIN};}

/* reveal */
.reveal{opacity:0; transform:translateY(22px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1);}
.reveal.in{opacity:1; transform:none;}
.reveal.d1{transition-delay:.08s}.reveal.d2{transition-delay:.16s}
.reveal.d3{transition-delay:.24s}.reveal.d4{transition-delay:.32s}

/* nav */
.fl-nav{position:fixed; top:0; left:0; right:0; z-index:50; transition:background .35s ease, box-shadow .35s ease, padding .35s ease; padding:22px 0;}
.fl-nav.scrolled{background:rgba(244,241,235,.82); backdrop-filter:saturate(140%) blur(12px); box-shadow:0 1px 0 rgba(28,28,28,.07); padding:14px 0;}
.fl-nav .fl-wrap{display:flex; align-items:center; justify-content:space-between;}
.fl-logo{font-weight:800; letter-spacing:-.02em; font-size:20px; text-transform:lowercase; text-decoration:none; color:var(--ink); display:inline-flex; align-items:center;}
.fl-logo .dot{color:var(--orange);}
.fl-logo-svg{display:inline-flex;}
.fl-logo-svg svg{height:19px; width:auto; display:block;}
.fl-menu{display:flex; gap:30px; align-items:center;}
.fl-menu a{position:relative; text-decoration:none; color:var(--ink); font-weight:500; font-size:15px; padding:4px 0;}
.fl-menu a::after{content:""; position:absolute; left:0; bottom:-2px; height:2px; width:0; background:var(--orange); transition:width .28s ease;}
.fl-menu a:hover::after, .fl-menu a:focus-visible::after{width:100%;}
.fl-navcta{background:var(--orange); color:var(--creme)!important; padding:10px 18px!important; border-radius:100px; font-weight:600;}
.fl-navcta::after{display:none;}
.fl-navcta:hover{background:var(--ink);}
.fl-burger{display:none; background:none; border:0; cursor:pointer; width:38px; height:38px;}
.fl-burger span{display:block; width:24px; height:2px; background:var(--ink); margin:5px auto; transition:.3s;}

/* hero */
.fl-hero{position:relative; min-height:clamp(560px,90vh,840px); display:flex; align-items:center; overflow:hidden; isolation:isolate;}
.fl-hero-bg{position:absolute; inset:0; z-index:-2;}
.fl-hero-bg img{width:100%; height:100%; object-fit:cover; object-position:72% 44%;}
.fl-hero-overlay{position:absolute; inset:0; z-index:-1; background:linear-gradient(96deg, var(--creme) 6%, rgba(244,241,235,.74) 28%, rgba(244,241,235,.18) 50%, rgba(244,241,235,0) 66%);}
.fl-hero-inner{width:100%; padding-top:120px; padding-bottom:110px;}
.fl-hero-text{max-width:600px;}
.fl-eyebrow{display:inline-block; font-size:13px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--warmgrau); margin-bottom:26px;}
.fl-h1{font-weight:800; letter-spacing:-.035em; line-height:.96; font-size:clamp(44px,6.4vw,82px); text-transform:uppercase; color:var(--ink);}
.fl-h1 .fl-em{background:linear-gradient(100deg,#FF4D00 0%,#FF7A33 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; padding-right:.14em; -webkit-box-decoration-break:clone; box-decoration-break:clone;}
.fl-rotator{display:inline-block; color:var(--orange); font-style:italic; padding-right:.12em; animation:rotIn .5s ease;}
.fl-h1-q{font-size:67px;}
@keyframes rotIn{from{opacity:0; transform:translateY(.22em);}to{opacity:1; transform:none;}}
.fl-sub{margin-top:28px; font-size:18px; max-width:46ch; color:#595854;}
.fl-cta-row{display:flex; gap:14px; flex-wrap:wrap; margin-top:38px;}
.btn{display:inline-flex; align-items:center; gap:9px; text-decoration:none; font-weight:600; font-size:16px; border-radius:100px; padding:15px 26px; cursor:pointer; border:0; transition:transform .2s ease, background .25s ease, color .25s ease;}
.btn-primary{background:var(--orange); color:var(--creme);}
.btn-primary:hover{transform:translateY(-2px);}
.btn-ghost{background:transparent; color:var(--ink); border:1.5px solid var(--ink);}
.btn-ghost:hover{background:var(--ink); color:var(--creme);}
.btn .arr{transition:transform .25s ease;}
.btn:hover .arr{transform:translateX(4px);}
.cta-wrap{position:relative; display:inline-block; overflow:visible; vertical-align:top;}
.cta-ring{position:absolute; pointer-events:none; z-index:0; border:2px solid var(--orange); border-radius:100px; opacity:0; transition:all .4s cubic-bezier(.34,1.56,.64,1);}
.cta-particles{position:absolute; inset:-30px; pointer-events:none; z-index:3;}
.cta-dot{position:absolute; width:5px; height:5px; border-radius:50%; opacity:0; will-change:transform,opacity;}
.btn-primary.cta{position:relative; z-index:2;}
@media (hover:hover) and (pointer:fine){.btn-primary.cta:hover{background:var(--ink); transform:scale(1.04);}}
.btn-primary.cta:active{transform:scale(.97);}
.about-portrait{width:100%; max-width:360px; height:auto; display:block; margin:0 auto;}

.imgph{position:relative; border:1.5px dashed var(--warmgrau); border-radius:20px; background:
  repeating-linear-gradient(45deg, transparent, transparent 11px, rgba(175,167,157,.10) 11px, rgba(175,167,157,.10) 22px);
  display:flex; align-items:center; justify-content:center; text-align:center; color:var(--warmgrau); font-weight:600; font-size:13px; letter-spacing:.04em; padding:18px;}
.imgph small{display:block; font-weight:500; opacity:.8; margin-top:6px; letter-spacing:.02em;}
.imgph.hero{aspect-ratio:4/5;}
.imgph.about{aspect-ratio:1/1;}

/* generic section / panels */
.sec{padding:54px 0; position:relative;}
.panel{border-radius:clamp(26px,3.5vw,46px); padding:clamp(40px,5.5vw,82px); position:relative; overflow:hidden;}
.panel-dark{background-color:#1C1C1C; color:var(--creme); box-shadow:0 44px 100px -55px rgba(28,28,28,.65);
  background-image:
    radial-gradient(70% 125% at -8% 50%, rgba(255,77,0,.30), rgba(255,77,0,0) 56%),
    radial-gradient(62% 120% at 108% 42%, rgba(255,77,0,.20), rgba(255,77,0,0) 54%);}
.panel-dark::after{content:""; position:absolute; inset:0; pointer-events:none; opacity:.20; mix-blend-mode:overlay; background-image:${GRAIN};}
.panel-dark > *{position:relative; z-index:1;}
.panel-sand{background:var(--sand); box-shadow:0 32px 80px -55px rgba(28,28,28,.4);}
.sec-eyebrow{font-size:13px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--orange); margin-bottom:18px;}
.h2{font-weight:800; letter-spacing:-.03em; line-height:1.02; font-size:clamp(30px,3.8vw,50px); text-transform:uppercase; color:var(--ink);}
.lead{font-size:clamp(16px,1.4vw,19px); color:#3a3833; max-width:60ch; margin-top:22px;}
.panel-dark .h2,.panel-dark .pullquote{color:var(--creme);}
.panel-dark .lead{color:#cfc9bf;}

/* philosophie */
.philo .grid{display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center;}
.sec.philo{margin-top:-84px; z-index:5;}
.pullquote{font-size:clamp(22px,2.6vw,34px); font-weight:700; line-height:1.25; letter-spacing:-.02em; max-width:21ch; margin:0;}
.qmark{color:var(--orange); font-size:64px; font-weight:800; line-height:.6; display:block; margin-bottom:18px;}

/* filter */
.filter .lead{font-size:clamp(18px,1.7vw,24px); color:var(--ink); max-width:30ch;}
.filter-no{margin-top:24px; font-weight:600; color:var(--warmgrau); max-width:44ch;}

/* mythos flip */
.flipwrap{margin-top:40px; perspective:1600px;}
.flipcard{display:grid; transition:transform .9s cubic-bezier(.6,.05,.1,1); transform-style:preserve-3d;}
.flipcard.flipped{transform:rotateX(180deg);}
.flipcard.peek{animation:peek 1.5s ease;}
@keyframes peek{0%{transform:rotateX(0)}24%{transform:rotateX(-27deg)}48%{transform:rotateX(7deg)}70%{transform:rotateX(-13deg)}100%{transform:rotateX(0)}}
.face{grid-area:1/1; position:relative; backface-visibility:hidden; -webkit-backface-visibility:hidden; -webkit-transform:translateZ(0); border-radius:18px; padding:56px clamp(24px,4vw,56px) 40px; display:flex; flex-direction:column; justify-content:center;}
.face-front{background:var(--creme); border:1px solid rgba(28,28,28,.10);}
.face-back{background:var(--ink); color:var(--creme); transform:rotateX(180deg);}
.face h3{font-size:13px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--warmgrau); margin-bottom:24px;}
.face-back h3{color:var(--orange);}
.myth-list{display:flex; flex-direction:column; gap:14px;}
.myth-head{font-size:clamp(20px,2.4vw,28px); font-weight:800; letter-spacing:-.02em; color:var(--ink); margin-bottom:16px;}
.myth-list li{list-style:none; font-size:clamp(17px,1.8vw,22px); font-weight:600; transition:opacity .4s;}
.flipcard.flipped .myth-list li{opacity:.5; text-decoration:line-through; text-decoration-color:var(--orange);}
.truth{font-size:clamp(22px,2.6vw,32px); font-weight:700; line-height:1.3; letter-spacing:-.01em; max-width:24ch;}
.flipbtn{align-self:flex-start; margin-top:30px; background:none; border:1.5px solid currentColor; color:inherit; border-radius:100px; padding:11px 22px; font-family:inherit; font-weight:600; font-size:15px; cursor:pointer; display:inline-flex; align-items:center; gap:9px; transition:.25s;}
.face-front .flipbtn:hover{background:var(--ink); color:var(--creme);}
.face-back .flipbtn:hover{background:var(--orange); border-color:var(--orange);}
.flipbtn .ic{transition:transform .4s;}
.flipcard.flipped .flipbtn .ic{transform:rotate(180deg);}
.flipcue{position:absolute; top:18px; right:20px; display:inline-flex; align-items:center; gap:7px; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--orange); background:rgba(255,77,0,.10); padding:7px 13px; border-radius:100px; animation:cuepulse 2s ease-in-out infinite;}
@keyframes cuepulse{0%,100%{opacity:.5; transform:translateY(0)}50%{opacity:1; transform:translateY(-2px)}}
.flipcard.flipped .flipcue{opacity:0; pointer-events:none;}

/* schritte */
.steps-grid{display:grid; grid-template-columns:auto 1fr; gap:0 40px; margin-top:50px;}
.steps-line{position:relative; width:2px; background:var(--sand); border-radius:2px;}
.fl-sub--m{display:none;}
.steps-line span{position:absolute; top:0; left:0; width:100%; background:var(--orange); height:0; transition:height 1.4s ease;}
.steps-line.in span{height:100%;}
.steps-list{display:flex; flex-direction:column; gap:46px;}
.step{display:grid; grid-template-columns:auto 1fr; gap:26px; align-items:start;}
.step .num{font-size:clamp(34px,4.6vw,58px); font-weight:800; letter-spacing:-.04em; color:transparent; -webkit-text-stroke:1.5px var(--warmgrau); line-height:.78; min-width:1.6em;}
.step.in .num{color:var(--ink); -webkit-text-stroke:0; transition:color .5s ease;}
.step h3{font-size:clamp(20px,2vw,26px); font-weight:800; letter-spacing:-.02em; line-height:1.12; margin-bottom:8px;}
.step p{color:#3a3833; max-width:54ch;}

/* angebot */
.offer .sec-eyebrow{color:var(--orange);}
.cards{display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin-top:50px;}
.card{background:#262524; border:1px solid rgba(255,255,255,.08); border-radius:18px; padding:34px 30px; display:flex; flex-direction:column; transition:transform .3s ease, border-color .3s ease;}
.card:hover{transform:translateY(-6px); border-color:var(--orange);}
.card .tag{font-size:12px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:var(--orange); margin-bottom:18px;}
.card h3{font-size:23px; font-weight:800; letter-spacing:-.02em; margin-bottom:14px; color:var(--creme);}
.card p{color:#bdb7ad; font-size:15.5px; flex:1;}
.card a{margin-top:26px; align-self:flex-start; color:var(--creme); text-decoration:none; font-weight:600; font-size:15px; display:inline-flex; align-items:center; gap:8px;}
.card a .arr{color:var(--orange); transition:transform .25s;}
.card a:hover .arr{transform:translateX(5px);}
.card.feat{background:linear-gradient(160deg,#33200f,#262524); border-color:rgba(255,77,0,.35);}

/* about */
.about .grid{display:grid; grid-template-columns:.8fr 1.1fr; gap:56px; align-items:center;}
.about p{color:#3a3833; margin-top:16px; max-width:58ch;}
.about p:first-of-type{margin-top:22px;}

/* faq */
.faq-list{margin-top:40px; border-top:1px solid rgba(28,28,28,.16);}
.faq-item{border-bottom:1px solid rgba(28,28,28,.16);}
.faq-q{width:100%; text-align:left; background:none; border:0; cursor:pointer; font-family:inherit; padding:26px 50px 26px 0; font-size:clamp(18px,1.9vw,22px); font-weight:700; letter-spacing:-.01em; color:var(--ink); position:relative; display:block;}
.faq-q .pm{position:absolute; right:6px; top:50%; transform:translateY(-50%); width:22px; height:22px;}
.faq-q .pm::before,.faq-q .pm::after{content:""; position:absolute; background:var(--orange); border-radius:2px;}
.faq-q .pm::before{left:0; top:10px; width:22px; height:2px;}
.faq-q .pm::after{left:10px; top:0; width:2px; height:22px; transition:transform .3s ease;}
.faq-item.open .pm::after{transform:rotate(90deg) scaleX(0);}
.faq-a{max-height:0; overflow:hidden; transition:max-height .4s ease;}
.faq-a-inner{padding:0 60px 28px 0; color:#3a3833; max-width:70ch;}

/* endcta */
.endcta{position:relative; overflow:hidden; isolation:isolate; text-align:left; padding:96px 0 200px; min-height:clamp(600px,84vh,800px); display:flex; align-items:center;}
.endcta-bg{position:absolute; inset:0; z-index:-2;}
.endcta-bg img{width:100%; height:100%; object-fit:cover; object-position:center 50%;}
.endcta-overlay{position:absolute; inset:0; z-index:-1; background:linear-gradient(96deg, var(--creme) 8%, rgba(244,241,235,.72) 32%, rgba(244,241,235,.12) 56%, rgba(244,241,235,0) 72%);}
.endcta .h2{font-size:clamp(34px,5vw,62px);}
.endcta .lead{margin-top:22px; max-width:42ch;}
.endcta .fl-cta-row{justify-content:flex-start; margin-top:40px;}
.about-sign{font-family:'Caveat',cursive; font-weight:600; font-size:clamp(36px,4.4vw,56px); color:var(--orange); line-height:1; margin-top:28px; transform:rotate(-3deg); transform-origin:left center;}
.filter-grid{display:grid; grid-template-columns:1.05fr .95fr; gap:54px; align-items:center;}
.candid-img{width:100%; aspect-ratio:4/5; object-fit:cover; border-radius:18px; display:block;}
.band-img{width:100%; aspect-ratio:21/9; object-fit:cover; display:block; -webkit-mask-image:linear-gradient(to bottom, transparent 0, #000 24%); mask-image:linear-gradient(to bottom, transparent 0, #000 24%);}
.sec.band{padding-bottom:0;}
.sec.offer{margin-top:-95px; z-index:4;}

a:focus-visible,button:focus-visible{outline:2px solid var(--orange); outline-offset:3px; border-radius:4px;}

@media (max-width:880px){
  .fl-nav.menu-open{background:transparent!important; backdrop-filter:none!important; -webkit-backdrop-filter:none!important; box-shadow:none!important;}
  .fl-menu{position:fixed; inset:0; width:100%; height:100%; background:var(--creme); flex-direction:column; align-items:center; justify-content:center; gap:30px; padding:0 36px; opacity:0; visibility:hidden; transform:translateY(-6px); transition:opacity .3s ease, transform .3s ease, visibility .3s; z-index:45; box-shadow:none;}
  .fl-menu.open{opacity:1; visibility:visible; transform:none;}
  .fl-menu a{font-size:24px;}
  .fl-burger{display:block; z-index:60; position:relative;}
  .fl-hero .grid,.philo .grid,.about .grid,.filter-grid{grid-template-columns:1fr; gap:32px;}
  .fl-hero{min-height:192vw; max-height:920px; align-items:flex-start;}
  .fl-eyebrow{display:none;}
  .fl-hero-inner{padding-top:94px; padding-bottom:84px;}
  .fl-hero-text{max-width:none; text-align:center;}
  .fl-h1-q{font-size:clamp(26px,7vw,38px);}
  .fl-sub--d{display:none;}
  .fl-sub--m{display:block;}
  .pullquote{font-style:italic; font-size:clamp(19px,5.3vw,23px);}
  .fl-hero-overlay{display:block; background:linear-gradient(to bottom, var(--creme) 4%, rgba(244,241,235,.9) 26%, rgba(244,241,235,.36) 42%, rgba(244,241,235,0) 56%);}
  .fl-hero-bg{position:absolute; inset:0;}
  .fl-hero-bg img{height:100%; object-fit:cover; object-position:center top; transform:none;}
  .fl-h1{font-size:clamp(34px,9vw,48px);}
  .fl-sub{font-size:15px; margin:16px auto 0; max-width:40ch;}
  .fl-cta-row{margin-top:24px;}
  .fl-hero .fl-cta-row{justify-content:center;}
  .imgph.hero{max-width:420px;}
  .cards{grid-template-columns:1fr;}
  .card{border-color:rgba(255,77,0,.55); box-shadow:0 0 0 1px rgba(255,77,0,.16), 0 16px 38px -22px rgba(255,77,0,.55);}
  .card.feat{border-color:rgba(255,77,0,.7);}
  .fl-hero{padding:0;}
  .sec{padding:34px 0;}
  .endcta{padding:88px 0; min-height:96svh; align-items:flex-start; text-align:center;}
  .endcta .fl-cta-row{justify-content:center;}
  .endcta .lead{margin-left:auto; margin-right:auto;}
  .endcta-overlay{background:linear-gradient(to bottom, var(--creme) 5%, rgba(244,241,235,.94) 30%, rgba(244,241,235,.48) 46%, rgba(244,241,235,0) 60%);}
  .endcta-bg img{object-position:center 55%;}
  .endcta .lead{font-size:15.5px;}
  .imgph.band{aspect-ratio:4/3;}
  .panel{padding:34px 22px;}
  .philo .panel{padding-top:5px;}
  .sec.offer{margin-top:-54px;}
  .steps-line span{height:var(--steps-fill,0%)!important; transition:height .12s linear;}
  .flipwrap{margin-top:26px;}
  /* Flip ohne 3D auf schmalen Screens: saubere Überblendung, kein Durchbluten */
  .flipcard{transform:none!important; transition:none;}
  .flipcard.peek{animation:none;}
  .face{backface-visibility:visible; -webkit-backface-visibility:visible; transition:opacity .35s ease;}
  .face-back{transform:none; opacity:0; pointer-events:none;}
  .flipcard.flipped .face-front{opacity:0; pointer-events:none;}
  .flipcard.flipped .face-back{opacity:1; pointer-events:auto;}
}
@media (prefers-reduced-motion:reduce){
  .reveal,.fl-underline path,.flipcard,.steps-line span,.btn,.card,.flipcard.peek{transition:none!important; animation:none!important;}
  .reveal{opacity:1; transform:none;}
  .flipcue{animation:none;}
}
`;

function useScrolled() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(window.scrollY > 30);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return s;
}

function useRevealAll(deps) {
  useEffect(() => {
    const els = document.querySelectorAll(".fl-root .reveal, .fl-root .steps-line, .fl-root .step, .fl-root .fl-hero");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps);
}

function CtaButton({ href, external, children }) {
  const wrap = useRef(null), ring = useRef(null), pc = useRef(null), btn = useRef(null);
  const positionRing = (expand) => {
    const r = ring.current, b = btn.current, w = wrap.current;
    if (!r || !b || !w) return;
    const gap = expand ? 9 : 4;
    const br = b.getBoundingClientRect(), wr = w.getBoundingClientRect();
    r.style.top = (br.top - wr.top - gap) + "px";
    r.style.left = (br.left - wr.left - gap) + "px";
    r.style.width = (br.width + gap * 2) + "px";
    r.style.height = (br.height + gap * 2) + "px";
    r.style.opacity = expand ? "1" : "0";
  };
  const fire = () => {
    const c = pc.current; if (!c) return;
    const dots = c.children;
    for (let k = 0; k < dots.length; k++) {
      const dot = dots[k], ps = POS[k];
      dot.style.transition = "none";
      dot.style.opacity = "0";
      dot.style.transform = "translate(0,0) scale(0)";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        dot.style.transition = "all .8s cubic-bezier(.34,1.56,.64,1)";
        dot.style.opacity = "1";
        dot.style.transform = "translate(" + ps.tx + "px," + ps.ty + "px) scale(1)";
        setTimeout(() => {
          dot.style.opacity = "0";
          dot.style.transform = "translate(" + ps.tx * 2 + "px," + ps.ty * 2 + "px) scale(0)";
        }, 400);
      }));
    }
  };
  useEffect(() => {
    positionRing(false);
    const on = () => positionRing(false);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const enter = () => { if (reduce) return; positionRing(true); fire(); };
  const leave = () => positionRing(false);
  return (
    <span className="cta-wrap" ref={wrap}>
      <span className="cta-ring" ref={ring} aria-hidden="true" />
      <a className="btn btn-primary cta" ref={btn} href={href}
        target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
        onMouseEnter={enter} onMouseLeave={leave}
        onTouchStart={enter} onTouchEnd={() => setTimeout(leave, 320)}>
        {children}
      </a>
      <span className="cta-particles" ref={pc} aria-hidden="true">
        {POS.map((p, i) => (
          <span key={i} className="cta-dot" style={{ left: p.left, right: p.right, top: p.top, bottom: p.bottom, background: i % 2 ? "#FFCF33" : "#FF4D00" }} />
        ))}
      </span>
    </span>
  );
}

const Arrow = () => (
  <svg className="arr" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const Rot = ({ cls }) => (
  <svg className={cls} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" /></svg>
);

const FAQS = [
  { q: "Ist mein Ansatz für jeden geeignet?", a: "Nein, absolut nicht. Mein Ansatz ist nur für die, die NICHT von jemandem oder etwas gerettet werden wollen. Du musst bereit sein, Kraft aufzubringen, Emotionen zuzulassen und zu verstehen: Retten kann dich niemand außer dir selbst, dann funktioniert meine Methode für dich." },
  { q: "Wieso sollte genau dieser Weg bei dir funktionieren?", a: "Weil es nicht darum geht, jemand anderes zu werden oder dein Leben komplett umzukrempeln. Mein Ansatz beginnt viel früher: bei der Art, wie du denkst, bewertest und mit dem umgehst, was dir im Alltag begegnet. Veränderung entsteht nicht durch Motivation, sondern durch Klarheit, und genau dort beginnt dieser Weg." },
  { q: "Wann kann ich erste Veränderungen spüren?", a: "Oft früher als erwartet, nicht als plötzliches Glück, sondern als das Gefühl, endlich klar zu sehen. Viele spüren schon nach kurzer Zeit, warum sich ihr Leben so anfühlt, wie es sich anfühlt. Das ist kein Sprint und keine Diät, sondern nachhaltige Veränderung ohne Jojo-Effekt." },
];

const STEPS = [
  { n: "01", t: "Den Überlebensmodus wahrnehmen", d: "Du lernst zu erkennen, wann du funktionierst statt bewusst zu handeln, und was das in dir auslöst." },
  { n: "02", t: "Die inneren Mechanismen verstehen", d: "Du verstehst, wie automatische Gedanken und Bewertungen entstehen, und warum sie dein Erleben bestimmen." },
  { n: "03", t: "Deine Gedanken-Leitplanken erkennen", d: "Du lernst, den mentalen Autopiloten rechtzeitig zu stoppen, bevor er Druck, Sorgen oder Angst verursacht." },
  { n: "04", t: "Zurück ins echte Leben", d: "Indem du die versteckten Glücksräuber im Alltag erkennst und anders mit ihnen umgehst, erschaffst du dir nachhaltig ein glückliches Leben." },
];

const MYTHS = ["…sich die Umstände ändern.", "…man endlich angekommen ist.", "…man noch etwas optimiert.", "…man weniger Probleme hat."];

const ROTATOR = ["Mutter", "Banker", "Erzieherin", "Arzt", "Ehefrau", "Lehrerin"];
function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % ROTATOR.length), 2100);
    return () => clearInterval(t);
  }, []);
  return <span className="fl-rotator" key={i}>{ROTATOR[i]},</span>;
}

export default function Startseite() {
  const scrolled = useScrolled();
  const [menu, setMenu] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [peek, setPeek] = useState(false);
  const [open, setOpen] = useState(0);
  const flipRef = useRef(null);
  const flippedOnce = useRef(false);

  useRevealAll([]);

  // Mythos-Block: beim Reinscrollen erst "anstupsen" (Hinweis), dann einmal umdrehen
  useEffect(() => {
    const el = flipRef.current; if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !flippedOnce.current) {
        flippedOnce.current = true;
        io.unobserve(e.target);
        if (reduce) return;
        setPeek(true);
        setTimeout(() => setPeek(false), 1550);
        setTimeout(() => setFlipped(true), 1850);
      }
    }), { threshold: 0.55 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  useEffect(() => {
    const rail = document.querySelector(".fl-root .steps-line");
    if (!rail) return;
    const onScroll = () => {
      const r = rail.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      let p = (vh * 0.78 - r.top) / (r.height || 1);
      p = Math.max(0, Math.min(1, p));
      rail.style.setProperty("--steps-fill", (p * 100).toFixed(1) + "%");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  const nav = [
    { label: "Philosophie", href: "#philosophie" },
    { label: "Mentoring", href: "#mentoring" },
    { label: "Kostenloses", href: "#kostenloses" },
  ];

  return (
    <div className="fl-root">
      <style>{CSS}</style>

      {/* NAV */}
      <nav className={"fl-nav" + (scrolled ? " scrolled" : "") + (menu ? " menu-open" : "")}>
        <div className="fl-wrap">
          <a className="fl-logo" href="#top" aria-label="florian lingner"><LogoMark /></a>
          <div className={"fl-menu" + (menu ? " open" : "")}>
            {nav.map((n) => (
              <a key={n.label} href={n.href} target={n.ext ? "_blank" : undefined} rel={n.ext ? "noopener noreferrer" : undefined} onClick={() => setMenu(false)}>{n.label}</a>
            ))}
            <a className="fl-navcta" href={TEST_URL} target="_blank" rel="noopener noreferrer">Persönlichkeitstest starten</a>
          </div>
          <button className="fl-burger" aria-label="Menü" onClick={() => setMenu(!menu)}><span /><span /><span /></button>
        </div>
      </nav>

      {/* HERO */}
      <header className="fl-hero" id="top">
        <picture className="fl-hero-bg">
          <source media="(max-width:880px)" srcSet={HERO_MOBILE} />
          <img src={HERO_DESKTOP} alt="Florian Lingner am Strand bei Sonnenuntergang" />
        </picture>
        <div className="fl-hero-overlay" aria-hidden="true" />
        <div className="fl-wrap fl-hero-inner">
          <div className="fl-hero-text">
            <span className="fl-eyebrow reveal">Du hast dein Leben im Griff, aber lebst du es wirklich?</span>
            <h1 className="fl-h1 reveal d1">
              <Rotator /><br /><span className="fl-h1-q">Aber wer bist du wirklich?</span>
            </h1>
            <p className="fl-sub fl-sub--d reveal d2">Niemand hat uns beigebracht, eine Denkweise anzunehmen, die uns glücklich macht. Und auf einmal hängen wir jahrelang wie gelähmt im Alltag fest, ohne an der Entfaltung unseres wahrhaftigen Selbst zu arbeiten. Doch wenn du willst, kann sich das von jetzt auf gleich ändern. Meine Aufgabe ist es, dich bei dieser Reise zu unterstützen.</p>
            <p className="fl-sub fl-sub--m reveal d2">Niemand hat uns beigebracht, eine Denkweise anzunehmen, die uns glücklich macht. Meine Aufgabe ist es, dich bei dieser transformativen Reise zu unterstützen.</p>
            <div className="fl-cta-row reveal d3">
              <CtaButton href={TEST_URL} external>Mach den Persönlichkeitstest <Arrow /></CtaButton>
              <a className="btn btn-ghost" href="#mentoring">Mein Angebot</a>
            </div>
          </div>
        </div>
      </header>

      {/* PHILOSOPHIE */}
      <section className="sec philo" id="philosophie">
        <div className="fl-wrap">
          <div className="panel panel-dark reveal">
            <div className="grid">
              <div>
                <span className="qmark" aria-hidden="true">„</span>
                <p className="pullquote">Wir sind überzeugt, viel zu wissen. Über die Welt und uns selbst. Und vielleicht ist es genau das, was dir im Weg steht.</p>
              </div>
              <div>
                <div className="sec-eyebrow">Meine Philosophie</div>
                <h2 className="h2">Ein ehrlicher Blick auf dich, die Welt und das <span className="fl-em">Leben</span> selbst.</h2>
                <p className="lead">Irgendwann kommt bei den meisten der Punkt, an dem sie merken: Da muss noch mehr sein. Dann hast du die Wahl, auf die Suche zu gehen oder dich ins Durchschnittsleben zu fügen.</p>
                <div className="fl-cta-row" style={{ marginTop: 30 }}>
                  <CtaButton href="#philosophie">Das ist meine Philosophie <Arrow /></CtaButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="sec filter">
        <div className="fl-wrap filter-grid">
          <div className="reveal">
            <div className="sec-eyebrow">Für wen?</div>
            <h2 className="h2">Nicht für jeden gut, aber für die <span className="fl-em">Richtigen</span> perfekt.</h2>
            <p className="lead">Ich biete keine Universallösung. Mein Ansatz ist für Menschen, die spüren, dass da mehr möglich ist, und bereit sind, ihr Denken und ihre Haltung ehrlich zu hinterfragen.</p>
            <p className="filter-no">Du willst an deinem jetzigen Leben festhalten und nur „ein bisschen" verändern? Dann kann ich dir leider nicht weiterhelfen.</p>
          </div>
          <div className="reveal d1">
            <img className="candid-img" src={CANDID_JUNGLE} alt="Florian Lingner" loading="lazy" />
          </div>
        </div>
      </section>

      {/* MYTHOS-FLIP */}
      <section className="sec">
        <div className="fl-wrap">
          <div className="panel panel-sand reveal">
            <div className="sec-eyebrow">Die Brille abnehmen</div>
            <h2 className="h2">Was viele über Glück <span className="fl-em">glauben</span>.</h2>
            <p className="lead">Die meisten suchen Glück an der falschen Stelle. Dreh die Karte um.</p>
            <div className="flipwrap" ref={flipRef}>
              <div className={"flipcard" + (flipped ? " flipped" : "") + (peek ? " peek" : "")}>
                <div className="face face-front" aria-hidden={flipped}>
                  <span className="flipcue"><Rot cls="" /> umdrehen</span>
                  <h3>Was viele glauben</h3>
                  <p className="myth-head">Glück entsteht, wenn…</p>
                  <ul className="myth-list">{MYTHS.map((m) => <li key={m}>{m}</li>)}</ul>
                  <button className="flipbtn" onClick={() => setFlipped(true)}>
                    Die Wahrheit ist <Rot cls="ic" />
                  </button>
                </div>
                <div className="face face-back" aria-hidden={!flipped}>
                  <h3>Worum es hier wirklich geht</h3>
                  <p className="truth">Glück scheitert selten an der Welt, sondern daran, dass wir nie gelernt haben, wie wir innerlich richtig mit ihr umgehen.</p>
                  <button className="flipbtn" onClick={() => setFlipped(false)}>
                    Zurück <Rot cls="ic" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCHRITTE */}
      <section className="sec">
        <div className="fl-wrap">
          <div className="reveal">
            <div className="sec-eyebrow">Der Weg</div>
            <h2 className="h2">In <span className="fl-em">4 Schritten</span> zu mehr Klarheit.</h2>
          </div>
          <div className="steps-grid">
            <div className="steps-line"><span /></div>
            <div className="steps-list">
              {STEPS.map((s) => (
                <div className="step" key={s.n}>
                  <div className="num">{s.n}</div>
                  <div><h3>{s.t}</h3><p>{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIFESTYLE-BAND */}
      <section className="sec band">
        <div className="fl-wrap reveal">
          <img className="band-img" src={BAND_LIFE} alt="Florian Lingner am Strand" loading="lazy" />
        </div>
      </section>

      {/* ANGEBOT */}
      <section className="sec offer" id="mentoring">
        <div className="fl-wrap">
          <div className="panel panel-dark reveal">
            <div className="sec-eyebrow">Mein Angebot</div>
            <h2 className="h2">Drei Wege, <span className="fl-em">anzufangen</span>.</h2>
            <div className="cards">
              <div className="card feat">
                <span className="tag">Kostenlos · Start</span>
                <h3>Persönlichkeitstest</h3>
                <p>30 Fragen aus deinem Alltag, die in unter einer Viertelstunde deine unbewussten Blockaden und Coping-Mechanismen offenlegen. Der ehrlichste Einstieg.</p>
                <a href={TEST_URL} target="_blank" rel="noopener noreferrer">Test starten <span className="arr">→</span></a>
              </div>
              <div className="card" id="kostenloses">
                <span className="tag">Kostenlos</span>
                <h3>Masterclass</h3>
                <p>Ein kostenloses Video, in dem ich so einfach wie möglich erkläre, was bei den meisten der Kern der Unzufriedenheit ist. Dein erster Schritt, einfach anmelden.</p>
                <a href="#kostenloses">Zur Masterclass <span className="arr">→</span></a>
              </div>
              <div className="card">
                <span className="tag">1:1</span>
                <h3>Mentoring</h3>
                <p>Und nein, ich coache nicht. Ich sage dir nicht, was du tun sollst, ich begleite dich, rege neue Perspektiven an, und du wächst organisch.</p>
                <a href="#mentoring">Das 1:1 Mentoring <span className="arr">→</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÜBER MICH */}
      <section className="sec about">
        <div className="fl-wrap grid">
          <div className="reveal">
            <img className="about-portrait" src={PORTRAIT_ROUND} alt="Florian Lingner" />
          </div>
          <div className="reveal d1">
            <div className="sec-eyebrow">Über mich</div>
            <h2 className="h2">Hi, ich bin <span className="fl-em">Florian</span>.</h2>
            <p>Einen großen Teil meines Lebens habe ich ziemlich konsequent gegen mich selbst gelebt, Scheitern, Zweifel und innere Leere waren keine kurzen Phasen, sondern ein Dauerzustand. Nicht, weil mein Leben objektiv am Boden war, sondern weil ich nie gelernt hatte, ehrlich mit mir umzugehen.</p>
            <p>Der Wendepunkt kam nicht durch Bücher, Gurus oder neue Konzepte, sondern durch die Bereitschaft, meine eigenen Gedanken und Reaktionen wirklich wahrzunehmen. Ohne Ausreden, ohne Selbstbetrug.</p>
            <p>Heute begleite ich Menschen, die spüren, dass ihr Leben mehr Tiefe und Freude vertragen könnte, aber nicht wissen, wo sie ansetzen sollen.</p>
            <p className="about-sign" aria-hidden="true">Florian</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec">
        <div className="fl-wrap">
          <div className="panel panel-sand reveal">
            <div className="sec-eyebrow">Fragen?</div>
            <h2 className="h2">Bevor du dich <span className="fl-em">fragst</span>.</h2>
            <div className="faq-list">
              {FAQS.map((f, i) => (
                <div className={"faq-item" + (open === i ? " open" : "")} key={i}>
                  <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                    {f.q}<span className="pm" aria-hidden="true" />
                  </button>
                  <div className="faq-a" style={{ maxHeight: open === i ? "340px" : "0" }}>
                    <div className="faq-a-inner">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* END-CTA */}
      <section className="sec endcta">
        <div className="endcta-bg"><img src={SAND_BG} alt="Florian Lingner am Strand" /></div>
        <div className="endcta-overlay" aria-hidden="true" />
        <div className="fl-wrap reveal">
          <h2 className="h2">Bereit, ehrlich <span className="fl-em">hinzuschauen</span>?</h2>
          <p className="lead">Keine Formeln. Kein dogmatischer Bullshit. Nur ehrliche Impulse für ein Leben, das wirklich zu dir passt.</p>
          <div className="fl-cta-row">
            <CtaButton href={TEST_URL} external>Mach den Persönlichkeitstest <Arrow /></CtaButton>
            <a className="btn btn-ghost" href="#kostenloses">Kostenlose Masterclass</a>
          </div>
        </div>
      </section>

      <Footer />

      <div className="fl-grain" aria-hidden="true" />
    </div>
  );
}
