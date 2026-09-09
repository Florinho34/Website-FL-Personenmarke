import { useEffect, useRef, useState } from "react";
import { ARCHETYPE_CORE, ARCHETYPE_ORDER, CORE_SCALES } from "../data/archetypeCore";

/*  ────────────────────────────────────────────────────────────────────────
    /dein-ergebnis  ·  Personalisierte Ergebnisseite (Unfuck-Typentest)
    ────────────────────────────────────────────────────────────────────────
    Liest den Token aus ?d=<base64url>, baut daraus den vollstaendigen Report.
    Der Token traegt NUR den persoenlichen Kern (Name, Archetyp, 10 Werte,
    Top-3). Alle Texte liegen hier im Code bzw. in src/data/archetypeCore.js.

    LEITPLANKE 1 - noindex.
    Die Seite ist personalisiert und darf nie in den Index. Gesetzt an zwei
    Stellen: SEO-Map in App.jsx und X-Robots-Tag in vercel.json. Nicht in der
    sitemap.xml, nirgends verlinkt.

    LEITPLANKE 2 - der Vorname darf nicht ins Analytics.
    Im Token steckt der Vorname. Base64 ist keine Verschluesselung. GA4, Meta
    und Clarity melden die volle Seiten-URL inklusive Query-String.
    Loesung: stripUrlToken() liest ?d= aus, legt den Token in den
    sessionStorage und entfernt ihn per history.replaceState SOFORT aus der
    Adresszeile - noch bevor GTM ueberhaupt laedt (GTM laedt erst nach einem
    Klick im Consent-Banner). Ab dann sehen alle Tools nur "/dein-ergebnis".
    Deshalb darf dieser Pfad NICHT (mehr) in NO_TRACKING stehen: hier soll
    gemessen werden.

    LEITPLANKE 3 - Clarity bleibt hier aus.
    URL-Stripping hilft gegen Clarity nicht: Clarity zeichnet den BILDSCHIRM
    auf, und auf dieser Seite stehen Vorname und vollstaendiges Profil.
    stopClarity() schaltet die Aufzeichnung ab, sobald Clarity geladen ist.
    Zweite Absicherung: Ausnahme fuer diesen Pfad am Clarity-Tag in GTM.

    ZWILLINGSDATEI: Archetyp-Name, Tagline, unbequeme Wahrheit und Falle
    kommen aus src/data/archetypeCore.js. Dieselbe Datei liegt im Test-Repo.
    Aenderungen dort immer in beiden Repos.
    ──────────────────────────────────────────────────────────────────────── */

// Rendert **fett**-Marker als <strong>. Content ist unser eigener, kein XSS-Risiko.
function RichText({ text }) {
  const parts = String(text).split(/\*\*([^*]+)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

// Schlanke Outline-Icons je Dimension (Tusche-/Linien-Stil, currentColor).
const DIM_ICONS = {
  REF: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/></>,
  SL: <><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></>,
  ML: <><path d="M9.5 17.5h5M10.5 20.5h3"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 .9 1 1.6h5c0-.7.4-1.2 1-1.6A6 6 0 0 0 12 3z"/></>,
  OL: <><path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/></>,
  ETH: <path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z"/>,
  WS: <path d="M12 20s-7-4.4-7-9.4A3.6 3.6 0 0 1 12 8a3.6 3.6 0 0 1 7 2.6C19 15.6 12 20 12 20z"/>,
  NAT: <><path d="M3 9c2 0 2 1.8 4 1.8S9 9 11 9s2 1.8 4 1.8S17 9 19 9"/><path d="M3 14c2 0 2 1.8 4 1.8S9 14 11 14s2 1.8 4 1.8S17 14 19 14"/></>,
  EX: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></>,
  EF: <><circle cx="8" cy="12" r="3.6"/><path d="M11.6 12H21M18 12v3M15 12v2.2"/></>,
  HA: <path d="M13 3L5 13.5h5.5L9.5 21l8.5-11H12z"/>,
};
function DimIcon({ k }) {
  return (
    <svg className="erg-dim-ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {DIM_ICONS[k]}
    </svg>
  );
}

// Viraler Teil: der Test wird geteilt, nicht das persoenliche Ergebnis.
const TEST_URL = "https://test.florian-lingner.ch";
const SHARE_MSG = "Ich habe grade diesen Persönlichkeitstest gemacht und war echt beeindruckt! Kann ihn nur empfehlen, wenn man mal genauer hinsehen möchte!";

/* ─── TRACKING ─────────────────────────────────────────────────────────────
   Schreibt nur in den dataLayer. Ob daraus ein Tag feuert, entscheidet GTM
   und damit die Einwilligung - hier bewusst KEIN eigener Consent-Check.
   Ohne Einwilligung laedt GTM gar nicht, dann liegt der Push folgenlos rum. */
function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}

/* ─── VORNAMEN-SCHUTZ: Token aus der Adresszeile entfernen ─────────────────
   Laeuft beim allerersten Render, lange bevor GTM geladen ist. Danach steht
   in der Adresszeile nur noch "/dein-ergebnis" - GA4 und Meta bekommen nie
   einen Vornamen zu sehen.

   Der Token wandert in den sessionStorage, damit ein Reload die Seite nicht
   leer laesst. Ein neuer Browser-Tab hat ihn nicht mehr; dann greift der
   Fallback-Screen mit dem Hinweis auf die Ergebnis-Mail. Das ist gewollt:
   lieber ein klarer Hinweis als ein Vorname im Analytics. */
const TOKEN_STORAGE_KEY = "fl-ergebnis-token";

function stripUrlToken() {
  if (typeof window === "undefined") return null;
  let fromUrl = null;
  try {
    fromUrl = new URLSearchParams(window.location.search).get("d");
  } catch { /* kaputte Query-Syntax - wie kein Token behandeln */ }

  if (fromUrl) {
    try { sessionStorage.setItem(TOKEN_STORAGE_KEY, fromUrl); } catch { /* Privatmodus */ }
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("d");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    } catch { /* replaceState nicht verfuegbar - Anzeige laeuft trotzdem */ }
    return fromUrl;
  }

  try { return sessionStorage.getItem(TOKEN_STORAGE_KEY); } catch { return null; }
}

/* ─── CLARITY AUF DIESER SEITE ABSCHALTEN ──────────────────────────────────
   Clarity zeichnet den Bildschirm auf. Hier stehen Vorname und komplettes
   Profil - das gehoert in keine Sitzungsaufzeichnung. Heatmaps braeuchte man
   hier ohnehin nicht, weil jeder Besucher etwas anderes sieht.
   Clarity laedt erst nach der Consent-Entscheidung ueber GTM, kann beim Mount
   also noch fehlen. Deshalb wird bis zu 15 Sekunden nachgefasst. */
function stopClarity() {
  try {
    if (typeof window !== "undefined" && typeof window.clarity === "function") {
      window.clarity("stop");
      return true;
    }
  } catch { /* Clarity meldet sich nicht - nichts zu stoppen */ }
  return false;
}

// ARCHETYPE_ORDER und CORE_SCALES kommen aus der Zwillingsdatei (oben importiert).

// Idealprofile fuer das Radar (identisch zum Test, TYPE_PROFILES)
const TYPE_PROFILES = {
  zuschauer:     { REF: 90, SL: 25, ML: 90, OL: 15, ETH: 45, WS: 25, NAT: 15, EX: 10, EF: 15, HA: 10 },
  getriebener:   { REF: 15, SL: 40, ML: 25, OL: 10, ETH: 15, WS: 10, NAT: 10, EX: 10, EF: 80, HA: 75 },
  idealist:      { REF: 45, SL: 30, ML: 50, OL: 15, ETH: 90, WS: 85, NAT: 75, EX: 80, EF: 10, HA: 40 },
  suchender:     { REF: 30, SL: 20, ML: 35, OL: 85, ETH: 25, WS: 15, NAT: 20, EX: 15, EF: 25, HA: 35 },
  klarsichtiger: { REF: 80, SL: 85, ML: 10, OL: 5,  ETH: 65, WS: 20, NAT: 50, EX: 5,  EF: 5,  HA: 85 },
};

// 10 Dimensionen: Name, Richtung (positive), Staerken- und Potenzialtext.
// positive stammt 1:1 aus dem Test (getStrengthsAndPotentials), damit die
// Balken-Richtung exakt zur Auswahl passt.
const DIMENSIONS = {
  REF: {
    name: "Reflexionsfähigkeit", positive: true,
    staerke: "Du **hinterfragst dich selbst ehrlicher als die meisten**. Wo andere auf Autopilot durchs Leben gehen, nimmst du dir die Zeit, hinzuschauen und zu verstehen.",
    potenzial: "Du handelst oft, ohne vorher innezuhalten. Das gibt dir Tempo, aber es führt auch dazu, dass du Muster wiederholst, die dir nicht guttun. Mehr Reflexion würde dir helfen, **bessere Entscheidungen zu treffen**.",
  },
  SL: {
    name: "Selbstführung", positive: true,
    staerke: "Du triffst Entscheidungen **aus dir selbst heraus**, statt dich nach den Erwartungen anderer zu richten. Das ist seltener, als du denkst, und ein echtes Fundament für ein selbstbestimmtes Leben.",
    potenzial: "Du orientierst dich stark an den Erwartungen anderer oder an dem, was sich bewährt hat. Das gibt Sicherheit, aber es kann dazu führen, dass du ein Leben lebst, **das sich nicht wirklich wie deins anfühlt**.",
  },
  ML: {
    name: "Mentale Klarheit", positive: false,
    staerke: "Du schaffst es, deinen Kopf ruhig zu halten, wenn es darauf ankommt. Während andere in Gedankenspiralen feststecken, **bleibst du meist klar**. Das ist eine unterschätzte Stärke, die dir in schwierigen Momenten einen echten Vorteil gibt.",
    potenzial: "Dein Kopf arbeitet oft auf Hochtouren, auch wenn du es dir nicht anmerken lässt. Grübeln, Überdenken, Gedankenkreise. Deine mentale Last ist hoch, und **hier hast du klar Luft nach oben**. Mit weniger Last lebt es sich leichter, und du kannst deine mentale Energie gezielter einsetzen, statt sie im Kreis zu verbrennen.",
  },
  OL: {
    name: "Innere Orientierung", positive: false,
    staerke: "Du weißt dich in dieser komplizierten Welt gut zurechtzufinden. Während andere orientierungslos durchs Leben treiben, hast du **eine Richtung und einen inneren Anker**. Das geht den wenigsten so, und es gibt dir eine Stabilität, die andere bei dir spüren und schätzen.",
    potenzial: "Du spürst, dass etwas fehlt, aber es fällt dir schwer zu benennen, was genau. **Die Richtung ist unklar**, und das führt dazu, dass du entweder gar nicht losgehst oder ständig die Spur wechselst.",
  },
  ETH: {
    name: "Ethische Integrität", positive: true,
    staerke: "Du hast einen klaren inneren Kompass **und lebst auch danach**. Deine Werte bleiben keine Theorie. Sie zeigen sich darin, wie du dich verhältst und welche Entscheidungen du triffst.",
    potenzial: "Du passt dich häufig an, statt für das einzustehen, was dir wirklich wichtig ist. An Werten mangelt es dir nicht, wohl aber an der Konsequenz, **auch dann danach zu handeln, wenn es unbequem wird**. Ein Leben im Einklang mit deinen innersten Werten fühlt sich unglaublich echt an.",
  },
  WS: {
    name: "Emotionale Balance", positive: false,
    staerke: "Du lässt dich von den großen Problemen der Welt nicht lähmen. Das heißt nicht, dass dir alles egal wäre. Du hast wahrscheinlich **einen gesünderen Umgang damit gefunden** als viele andere und kannst Informationen aufnehmen, ohne dich davon auffressen zu lassen.",
    potenzial: "Die Probleme der Welt gehen dir nahe, manchmal zu nahe. Dein Gerechtigkeitssinn ist echt, aber er kann dich auch lähmen. Bedenke: **Nur ein handlungsfähiges Du kann etwas verändern**. Hier liegt Potenzial, deine Energie dorthin zu lenken, wo du wirklich etwas bewegen kannst: bei dir selbst. Der Rest kommt danach.",
  },
  NAT: {
    name: "Zugang zu Tiefe", positive: true,
    staerke: "Du hast einen **natürlichen Zugang zu den tieferen Ebenen des Lebens**. Ob durch Natur, Stille oder Reflexion: Du spürst, dass hinter der Oberfläche mehr ist, und du nimmst dir auch den Raum dafür.",
    potenzial: "Du lebst stark an der Oberfläche und kommst selten in Kontakt mit dem, was unter dem Alltag liegt. Das ist nicht schlimm, aber **es fehlt dir ein Ventil für die tieferen Fragen**, die irgendwann so oder so kommen werden.",
  },
  EX: {
    name: "Eigenverantwortung", positive: false,
    staerke: "Du suchst die **Verantwortung zuerst bei dir selbst**, bevor du mit dem Finger auf andere zeigst. Das ist eine reife Haltung, die dir ermöglicht, an den Dingen zu arbeiten, die tatsächlich in deiner Kontrolle liegen.",
    potenzial: "Du neigst dazu, die Ursachen für das, was nicht läuft, eher im Außen zu suchen als bei dir. Das ist menschlich, aber **es nimmt dir die Handlungsmacht**. Dein Potenzial liegt darin, den Blick öfter nach innen zu richten. Diese Fähigkeit zur Reflexion lässt sich lernen und kann der Turbo für deine Entwicklung sein.",
  },
  EF: {
    name: "Selbstbestimmung", positive: false,
    staerke: "Du lebst nach deinen eigenen Maßstäben statt nach den Erwartungen anderer. Wo viele sich anpassen und funktionieren, **gehst du deinen eigenen Weg**. Diese Eigenständigkeit ist selten und gibt dir eine Freiheit, die vielen fehlt.",
    potenzial: "Du richtest dich stark danach aus, was andere von dir erwarten oder was sich bewährt hat. Das gibt Sicherheit, aber es führt dazu, dass du dich eher anpasst, als dich wirklich zu entfalten. Vieles in deinem Leben **folgt fremden Maßstäben statt deinen eigenen**.",
  },
  HA: {
    name: "Handlungsfähigkeit", positive: true,
    staerke: "Du setzt um, was du dir vornimmst. Bei dir bleibt es nicht beim Reden und Planen, **du kommst ins Machen**. Das unterscheidet dich von vielen, die ewig in der Analyse-Phase stecken bleiben.",
    potenzial: "Du verstehst oft, was zu tun wäre, aber die Umsetzung fällt dir häufig schwer. **Der Graben zwischen Wissen und Handeln ist deine größte Baustelle**. Die Devise: weniger planen und grübeln, mehr trauen.",
  },
};

/*  Das PDF-Vorwort, fuer die Endposition angepasst. Nur der erste Satz ist neu -
    aus "Hi, mein Name ist Florian" wurde eine Anknuepfung ans Gelesene. Und der
    Schlusssatz spricht vom "Ergebnis" statt vom "Report", weil es kein PDF mehr
    gibt (Entscheidung 08.09.2026). */
const VORWORT = [
  "Ich bin Florian, und wenn du bis hierhin gelesen hast, sollst du auch wissen, von wem das alles kommt. Ich will ehrlich mit dir sein: **Ich hatte mein Leben nicht immer im Griff**. Über einen langen Zeitraum wurde ich immer unglücklicher. Monat für Monat.",
  "Das, was ich irgendwann nach einigen Jahren an Arbeit endlich über mich verstehen durfte, hat dann alles verändert. Doch bis dahin hat es mich viele Jahre gekostet, in denen ich längst hätte glücklich sein können. Also habe ich mich oft gefragt: **Wieso gibt es keine Abkürzung dorthin?**",
  "Und klar, Transformation passiert nicht über Nacht. Aber wie sagt man so schön: **Selbsterkenntnis ist der erste Schritt zur Besserung**. Und genau dafür, für ehrliches Hinschauen, habe ich diesen Test gebaut.",
  "Wenn du wirklich ehrlich geantwortet hast, spiegelt dir dieses Ergebnis auch unangenehme Blind Spots. Genau das macht dieses Ergebnis so wertvoll: **ein ehrlicher Spiegel deines aktuellen Selbst.** Ich hoffe, du gehst offen mit deinem Ergebnis um, denn nur dann kann es ein ähnlicher Türöffner für dich sein, wie meine Erkenntnisse es damals für mich waren.",
];

/*  Was NUR die Detailseite zeigt: Potenzial-Analyse und Reintyp-Text.
    Name, Tagline, unbequeme Wahrheit und Falle stehen in der Zwillingsdatei
    src/data/archetypeCore.js und werden unten dazugemischt.  */
const ARCHETYPE_EXTRA = {
  zuschauer: {
    potenzial: [
      "Stell dir einen Zuschauer vor, der **von der Tribüne aufs Feld gegangen** ist. Sein scharfer Blick ist geblieben, aber er schaut nicht mehr nur zu.",
      "Deine Analyse ist dann kein Versteck mehr, sondern ein Werkzeug. Du denkst immer noch gründlich, aber du merkst inzwischen, **wann du fertig gedacht hast**. Und an genau dieser Stelle machst du den Schritt, statt eine weitere Runde zu drehen. Was du erkennst, landet in deinem Leben, nicht nur in deinem Kopf.",
      "Das verändert mehr, als du ahnst. Deine Klarheit hatte immer schon Substanz, ihr fehlte nur die Wirkung. Menschen erleben dich nicht mehr als jemanden, der Dinge durchschaut, sondern **als jemanden, der Dinge bewegt**. Und dieses zermürbende Gefühl, dass dein Leben ohne dich weiterläuft, verschwindet. Du lebst es wieder mit.",
      "Das ist keine Fantasie, du bist näher dran, als du glaubst. Deine Erkenntnis war nie das Problem, du hast alles längst durchschaut. Und stehst trotzdem an derselben Stelle wie vor einem Jahr. Wenn der Weg so klar vor dir liegt: **Was hält dich eigentlich davon ab, ihn endlich zu gehen?**",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar. Kein zweiter Archetyp mischt sich merklich ein, du bist Zuschauer in Reinform. Das ist keine schlechte Nachricht, im Gegenteil: Bei dir liegt kein zweites Muster über dem eigentlichen Hebel. Es gibt genau einen Punkt, an dem du ansetzen musst, und alles darüber zeigt ihn dir schwarz auf weiß. Klarer als bei den meisten. **Das macht deinen nächsten Schritt einfacher, nicht schwerer**.",
  },
  getriebener: {
    potenzial: [
      "Stell dir einen Getriebenen vor, der immer noch mit voller Kraft läuft, aber **endlich in seine eigene Richtung**.",
      "Deine Power ist geblieben, sie hat jetzt nur ein Ziel, das wirklich deins ist. Du lieferst weiterhin ab, aber du fragst dich vorher, wofür. Und wenn die Antwort nicht trägt, dann lässt du es. Diese Fähigkeit, etwas nicht zu tun, **wird deine größte Freiheit**.",
      "Der Sonntagabend fühlt sich anders an. Die Unruhe, die dich in stillen Momenten überfällt, meldet sich seltener, weil du ihr nicht mehr ausweichen musst. Stillstand ist keine Bedrohung mehr, sondern eine Pause, die du dir erlaubst. Und wenn du abends erschöpft bist, dann ist es **die gute Erschöpfung** von etwas, das dir wirklich etwas bedeutet.",
      "Das ist keine Fantasie, du bist näher dran, als du glaubst. An deiner Kraft hat es nie gelegen, du hast mehr davon als die meisten. Die Frage, die bleibt, ist unbequem: Wenn du so viel bewegen kannst, warum bewegst du dich dann seit Jahren in eine Richtung, **die sich nicht nach dir anfühlt?**",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar. Kein zweiter Archetyp mischt sich merklich ein, du bist der Getriebene in Reinform. Das erklärt vieles: Dein Antrieb kennt keine Gegenstimme, die ihn mal ausbremst. Genau das macht dich so leistungsfähig, und genau das macht es **so schwer, den Fuß vom Gas zu nehmen**.",
  },
  idealist: {
    potenzial: [
      "Stell dir einen Idealisten vor, der die Welt immer noch verändern will und **dem es dabei richtig gut geht**.",
      "Dein Mitgefühl ist geblieben, es frisst dich nur nicht mehr auf. Du nimmst weiterhin wahr, was schiefläuft, aber du trägst es nicht mehr allein auf deinen Schultern. Du hast gelernt, deine Energie dorthin zu lenken, **wo sie tatsächlich ankommt**, statt sie über alles Ungerechte dieser Welt zu verteilen.",
      "Und plötzlich wirkst du. Du bist nicht mehr der Mensch, der frustriert am Rand steht und weiß, wie es besser ginge. Du bist der, der es vormacht. Dein eigenes Leben wird zum ersten Beweis, dass es geht. Menschen spüren das und folgen dir, **weil du strahlst statt zu kämpfen**. Und dabei fühlst du dich zum ersten Mal seit Langem nicht schuldig, wenn es dir gut geht.",
      "Das ist keine Fantasie, du bist näher dran, als du glaubst. Dein Herz war nie das Problem, es ist dein Antrieb. Für andere machst du längst Dinge möglich, die niemand sonst anpackt. Wenn du das kannst: **Warum tust du es nicht auch für dich?**",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar. Kein zweiter Archetyp mischt sich merklich ein, du bist der Idealist in Reinform. Dein Wertekompass bestimmt dich ohne Gegengewicht. Das ist eine seltene Kraft und zugleich der Grund, **warum du dich selbst so leicht aus dem Blick verlierst**.",
  },
  suchender: {
    potenzial: [
      "Stell dir einen Suchenden vor, der aufgehört hat zu suchen. Kein Aufgeben, keine Resignation. **Er ist angekommen**.",
      "Deine Neugier ist dann keine Fluchtbewegung mehr, **sondern echte Vertiefung**. Du liest und lernst immer noch, aber nicht mehr auf der Jagd nach dem einen fehlenden Teil. Du tust es, weil es dich nährt. Das eine ist ein Loch, das du zu stopfen versuchst. Das andere ist ein Garten, den du pflegst.",
      "Du triffst Entscheidungen, ohne vorher fünf Podcasts zu hören. Du weißt zwar nicht plötzlich alles, aber du traust deiner eigenen inneren Stimme wieder. Der, die du gerade noch mit dem nächsten Impuls übertönst. Die Ruhelosigkeit, dieses „irgendwas fehlt noch“, wird leiser. An ihre Stelle tritt etwas Unspektakuläres, aber Seltenes: **das Gefühl, am richtigen Ort zu sein**.",
      "Das ist keine Fantasie, du bist näher dran, als du glaubst. Alles, was du brauchst, hast du längst gesammelt. Und trotzdem suchst du weiter. Wenn es doch schon in dir liegt: **Worauf genau wartest du eigentlich noch?**",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar. Kein zweiter Archetyp mischt sich merklich ein, du bist der Suchende in Reinform. Deine Suche hat keinen inneren Gegenpol, der sie mal zur Ruhe bringt. Das erklärt, warum sie sich so endlos anfühlt, und **warum der Ausstieg für dich umso mehr verändert**.",
  },
  klarsichtiger: {
    potenzial: [
      "Stell dir einen Klarsichtigen vor, der das, was er längst versteht, **jeden einzelnen Tag auch lebt**.",
      "Es sieht von außen unspektakulär aus. Keine Erleuchtung, kein großer Umbruch. Nur **eine stille Konsequenz, die vorher nicht da war**. Du weißt weiterhin genau, wie es ginge, aber du tust es jetzt auch dann, wenn niemand hinschaut und wenn es unbequem wird.",
      "Und diese kleine Verschiebung verändert alles. Die letzten Prozent, die dich immer genagt haben, hören auf zu nagen. Dieses leise Wissen, dass du hinter deinen eigenen Möglichkeiten zurückbleibst, verschwindet. An seine Stelle tritt etwas, das kaum jemand kennt: die Ruhe eines Menschen, bei dem Erkenntnis und Alltag dasselbe geworden sind. Du erklärst anderen nicht mehr ihre Muster. **Du lebst deins einfach**.",
      "Das ist keine Fantasie, du bist näher dran als fast alle anderen. Dir fehlt kein Wissen mehr, du weißt genug für zwei Leben. Und genau deshalb ist die Frage so unangenehm: Wenn dir wirklich nur noch die letzten Meter fehlen, **warum gehst du sie dann nicht?**",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar, was bei deinem Typ fast schon poetisch ist. Kein zweiter Archetyp mischt sich merklich ein, du bist der Klarsichtige in Reinform. Deine Klarheit ist ungetrübt von anderen Mustern. Das bringt dich weit, und es macht den letzten blinden Fleck umso hartnäckiger, **weil nichts ihn dir spiegelt**.",
  },
};

/*  Zusammenfuehrung: gemeinsame Kerntexte + seitenspezifische Ergaenzungen.
    Der Bildpfad wird hier gesetzt - die Zwillingsdatei kennt nur den
    Dateinamen, weil das Test-Repo seine Bilder direkt unter "/" ablegt. */
const ARCHETYPES = Object.fromEntries(
  Object.entries(ARCHETYPE_CORE).map(([key, core]) => [
    key,
    { ...core, ...ARCHETYPE_EXTRA[key], avatar: `/images/${core.avatarFile}` },
  ])
);

// ④ Mischtyp: 20 Kombinationen, Key = "haupttyp+zweittyp"
const MISCHTYP = {
  "zuschauer+getriebener": "Wahrscheinlich ist **dein Kalender genauso voll wie dein Kopf**. Du bist fast ständig in Bewegung und kommst selten zur Ruhe. Dein analytischer Zuschauer-Anteil erkennt bereits vieles, doch du bist „zu beschäftigt“, um auch wirklich aktiv in der Praxis Vorteile aus deinen theoretischen Erkenntnissen zu ziehen und mit ihnen zu arbeiten.",
  "zuschauer+idealist": "Du grübelst wahrscheinlich nicht nur über dich selbst, sondern auch über Dinge, die du nicht kontrollieren kannst. Die Welt, die Ungerechtigkeit, das große Ganze. Das eine füttert das andere. Und beides zusammen erzeugt eine Art Weltschmerz. Eine Art Lähmung. Und diese macht es dir schwerer, **überhaupt bei dir selbst anzufangen**.",
  "zuschauer+suchender": "Statt ins Handeln zu kommen, suchst du vermutlich eher weiter: das nächste Buch, den nächsten Podcast, die nächste Erkenntnis. Du hoffst, dass irgendwann der entscheidende Impuls kommt. Aber vielleicht ist mehr Wissen gar nicht die Lösung, sondern der Moment, in dem du **mit dem anfängst, was du schon weißt**.",
  "zuschauer+klarsichtiger": "Du bist wahrscheinlich näher dran, als du denkst. Dein Verständnis für dich selbst ist weiter als bei den meisten. Aber vielleicht kennst du das: Zwischen „Ich könnte“ und „Ich tue es“ liegt bei dir noch **eine Lücke, die du lieber nicht zu genau anschaust**.",
  "getriebener+zuschauer": "Vielleicht kennst du das: In ruhigen Momenten taucht ein subtiles Gefühl auf, dass hinter deinem hohen Pensum etwas wartet, dem du dich nicht so gerne stellst. Und statt hinzuschauen, drehst du die Geschwindigkeit meist dann doch wieder hoch. Dein analytischer Verstand erkennt das vermutlich sogar. Aber **das Erkennen allein ändert noch nichts**.",
  "getriebener+idealist": "Du gibst wahrscheinlich viel Energie für andere und für eine „gute Sache“, während deine eigenen Bedürfnisse oft hinten anstehen. Vielleicht tust du sie sogar als egoistisch ab. Du funktionierst und kämpfst gleichzeitig und wunderst dich manchmal, **warum du dich trotzdem noch nicht angekommen oder erfüllt fühlst**.",
  "getriebener+suchender": "Du gibst Vollgas und bist irgendwie auch stolz drauf. Doch dann kommen, nicht ständig, doch immer wieder, Zweifel ob du eigentlich in die richtige Richtung rennst. Mal funktionierst du wie eine Maschine, dann fragst du dich plötzlich: „Wofür eigentlich?“ Aber bevor du wirklich auf die Suche nach der Antwort gehst, **stürzt du dich schon in den nächsten Sprint**.",
  "getriebener+klarsichtiger": "Entweder du bist bereits voll im Selbstoptimierungswahn, denn du siehst deine Potenziale und Schwächen genau so klar wie die anderer, oder du nutzt dieses Wissen durch Selbstreflektion manchmal, um dein Funktionieren zu rechtfertigen. „Ich weiß ja, warum ich so bin.“ Und dann machst du so weiter. Nicht blind für deine Muster, aber ziemlich gut darin, sie zu rationalisieren und dir selbst vorzumachen, weshalb **die wirklich unangenehme Veränderung gerade nicht nötig ist**.",
  "idealist+zuschauer": "Vielleicht merkst du, dass sich dein Weltschmerz manchmal mit Selbstanalyse vermischt. Du wünschst dir tief in deinem Inneren eine utopische Optimallösung für die Welt, doch erkennst in deinem Leben, aber auch in deinem Umfeld zu viel, das diesem Wunsch entgegenwirkt. Das führt zu Frustration und Lähmung. Du verurteilst dich selbst, Teil des Problems zu sein, doch es fühlt sich an, **als wären dir die Hände gebunden** dein Leben entsprechend zu verändern.",
  "idealist+getriebener": "Dein Idealismus gibt dir vermutlich eine Richtung. Einen moralischen Kompass. Dein Getriebener-Anteil gibt dir zusätzlich Antrieb. Das kann produktiv sein. Aber vielleicht verwechselst du manchmal Aktivismus mit echtem Fortschritt und bist so beschäftigt, gegen das Falsche zu kämpfen, dass für den Aufbau von etwas Eigenem wenig Raum und Energie bleibt. Vielleicht lohnt es sich ja mehr, langfristig zu denken und zu handeln, um am Ende wahre Veränderung zu bewirken. Verbrenne dich nicht selbst im Namen der Sache, **die Welt braucht Menschen wie dich**.",
  "idealist+suchender": "Du suchst nicht nur nach Möglichkeiten die Welt besser zu machen, sondern auch nach der richtigen Richtung für dich. Du willst ein guter Mensch sein. Ein hoher Anspruch. Und vielleicht führt genau das dazu, dass nichts wirklich genügt. Jede Methode, jeder Ansatz fällt irgendwann durch dein Raster. Vielleicht liegt es nicht am Raster der Welt, sondern daran, dass deins etwas zu eng ist. Zu eng dir auch mal selbst zu verzeihen. Zu eng, **auch mal die 80-20-Lösung als Erfolg zu sehen**. Manchmal ist auch kleiner Fortschritt besser als eine theoretische Optimallösung, die nie Realität wird.",
  "idealist+klarsichtiger": "Du hast echte Reflexionsfähigkeit und einen klaren Blick auf vieles. Aber vielleicht ist für deinen Idealisten-Anteil diese Klarheit eher Treibstoff für Frustration statt für Veränderung. Du erkennst ziemlich scharf, was falsch läuft, und vergisst dabei manchmal, dass **Klarheit ohne Selbstfürsorge auf Dauer nicht trägt**.",
  "suchender+zuschauer": "Vielleicht kennst du das: Du merkst, dass du springst, und du ahnst sogar warum. Aber dieses Meta-Wissen hilft dir nicht unbedingt, es zu ändern. Im Gegenteil: Es gibt dir das Gefühl von Neugier, Horizont-Erweitern und Fortschritt. Doch **in Wahrheit drehst du dich im Kreis**, da du nicht wirklich weißt, wohin es für dich gehen soll.",
  "suchender+getriebener": "Während andere Suchende eher grübeln, springst du vermutlich immer wieder zum nächsten Ding. Neues Projekt, neues Hobby, neuer Ansatz. Von außen sieht das nach Energie, Neugier, Entwicklung aus. Doch wenn du mal genau hinschaust, fühlt es sich vielleicht eher an, als würdest du vor etwas davonlaufen, das dich einholt, sobald du stehen bleibst. Ein Zeichen, weniger im Außen nach neuen Wahrheiten zu suchen und **stattdessen in dein Inneres zu schauen**.",
  "suchender+idealist": "Du willst wahrscheinlich nicht nur dich selbst finden, sondern auch den Sinn im großen Ganzen. Klingt tiefgründig, fühlt sich aber für viele häufig schnell erschöpfend an. Vielleicht liegt es nicht am Raster der Welt, sondern daran, dass der Anspruch, beides gleichzeitig und optimal zu lösen, **dich eher blockiert als beflügelt**.",
  "suchender+klarsichtiger": "Vielleicht kennst du den Moment: Du bist einen Schritt weiter, und dann kommt die Frage: „Aber was, wenn das noch nicht das Richtige ist?“ Gesunde Neugier und Sprunghaftigkeit liegen manchmal nah beieinander. Vielleicht ist es manchmal besser erstmal bei Themen mit denen du in Resonanz gehst oder du profitierst zu bleiben und **auf deine Entwicklung zu vertrauen**, statt ständig in einer Art Selbstoptimierungswahn von einem zu nächsten zu springen.",
  "klarsichtiger+zuschauer": "Vielleicht genießt du die Erkenntnis manchmal fast zu sehr. Du durchschaust vieles, bei dir und bei anderen. Aber vielleicht nutzt du diese Klarheit gelegentlich als Ausrede zur Bequemlichkeit? Eine Ausrede, um nichts verändern zu müssen, weil „Ich hab's ja durchschaut“ **sich anfühlt wie Fortschritt, es aber nicht immer ist**.",
  "klarsichtiger+getriebener": "Du erkennst vieles und dazu gehört wahrscheinlich auch, wo du langsamer machen solltest. Aber dein innerer Getriebener kann das nicht so gut aushalten. Vielleicht reflektierst du abends, was du tagsüber eigentlich schon wusstest, und am nächsten Morgen funktionierst du trotzdem wieder gleich. Die Frage ist weniger, ob du es siehst. Sondern **ob du es dir erlaubst, danach zu leben**.",
  "klarsichtiger+idealist": "Statt dein Wissen für dein eigenes Leben zu nutzen, fließt deine Energie vielleicht oft eher in irgendeine Art der Kompensation deines Weltschmerzes. Vielleicht verstehst du nicht nur wie du, sondern auch die Welt tickt. Oder besser ticken sollte. Und diese Diskrepanz zwischen Wunschvorstellung und Realität frustriert dich. Verständlich. Als Klarsichtiger mit einem gut ausgerichteten Wertekompass bist du schon auf einem guten Weg, doch achte darauf, **dich nicht zu sehr von deinem Wunsch nach einer Ideallösung ausbremsen zu lassen**.",
  "klarsichtiger+suchender": "Vielleicht kennst du die Frage: „Was, wenn das noch nicht alles war?“ Das kann gesund sein, solange es nicht zur Dauerschleife wird. Es gibt viele interessante Theorien, hörenswerte Reden, lesenswerte Bücher. Doch verliere dich nicht in der Vielfalt deiner Möglichkeiten. Du lebst bereits reflektierter als die meisten, also **lass deinen Erkenntnissen Taten folgen**. Bringt die eine Richtung nach einem ordentlichen Stück auf diesem Weg noch keinen Erfolg, kannst du ihn immer noch jederzeit wechseln.",
};


/* ─── TOKEN DEKODIEREN ─────────────────────────────────────────────────────
   Kehrt utf8ToBase64Url aus dem Test um. Bei jedem Fehler -> null (Fallback). */
function base64UrlToUtf8(token) {
  let b64 = token.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/*  Hoechste Token-Version, die diese Seite lesen kann. Wird der Token-Aufbau im
    Test je erweitert, zaehlt der Test dort hoch - und diese Seite erkennt einen
    zu neuen Link, statt ihn falsch anzuzeigen. Falsch anzeigen waere schlimmer
    als gar nicht anzeigen: Niemand merkt es, und der Leser bekommt ein fremdes
    Profil praesentiert. */
const TOKEN_VERSION = 1;

/*  Rueckgabe immer { status, data }:
      "ok"       - alles gelesen
      "empty"    - gar kein Token da (Direktaufruf, neuer Tab)
      "broken"   - Token da, aber nicht lesbar (abgeschnittener Link)
      "outdated" - Token aus einer neueren Test-Version
    Drei getrennte Faelle, weil der Mensch davor drei verschiedene Dinge tun
    muss. Ein gemeinsames "geht nicht" waere hier Faulheit. */
function decodeToken(raw) {
  if (!raw) return { status: "empty", data: null };
  try {
    const p = JSON.parse(base64UrlToUtf8(raw));
    if (typeof p.v === "number" && p.v > TOKEN_VERSION) {
      return { status: "outdated", data: null };
    }
    const primaryKey = ARCHETYPE_ORDER[p.p];
    if (!primaryKey || !ARCHETYPES[primaryKey]) return { status: "broken", data: null };
    if (!Array.isArray(p.d) || p.d.length !== CORE_SCALES.length) return { status: "broken", data: null };
    if (!Array.isArray(p.st) || !Array.isArray(p.pt)) return { status: "broken", data: null };
    const secondaryKey = p.s >= 0 ? ARCHETYPE_ORDER[p.s] : null;
    return {
      status: "ok",
      data: {
        name: (p.n || "").trim(),
        primaryKey,
        secondaryKey,
        isReintyp: p.r === 1,
        date: p.t || "",
        values: CORE_SCALES.reduce((acc, k, i) => { acc[k] = p.d[i]; return acc; }, {}),
        strengths: p.st.filter((k) => DIMENSIONS[k]),
        potentials: p.pt.filter((k) => DIMENSIONS[k]),
      },
    };
  } catch {
    return { status: "broken", data: null };
  }
}

/* ─── DIE LÜCKE ────────────────────────────────────────────────────────────
   Keine neue Messung, sondern eine Verdichtung von vier Werten, die ohnehin
   erhoben werden - zugespitzt auf zwei Zahlen und den Abstand dazwischen.

   Erkenntnis = (REF + ETH) / 2   ← wie klar jemand sieht
   Umsetzung  = (HA  + SL)  / 2   ← wie konsequent er danach lebt

   Alle vier Dimensionen sind positiv gerichtet (positive: true), deshalb wird
   hier direkt mit den normalisierten Werten gerechnet und NICHT mit
   strengthScore. Wer das je aendert, muss hier nachziehen. */
function computeLuecke(values) {
  const erkenntnis = Math.round(((values.REF ?? 50) + (values.ETH ?? 50)) / 2);
  const umsetzung = Math.round(((values.HA ?? 50) + (values.SL ?? 50)) / 2);
  return { erkenntnis, umsetzung, luecke: erkenntnis - umsetzung };
}

/*  Reihenfolge ist bindend: Die beiden Sonderfaelle MUESSEN zuerst greifen.
    Sonst liest jemand mit 28/28 ein "ausgeglichen" als Lob, obwohl bei ihm
    schlicht beides niedrig ist. Das ist der einzige echte Fallstrick hier. */
function lueckeText({ erkenntnis, umsetzung, luecke }) {
  if (erkenntnis < 35 && umsetzung < 35) {
    return "Beides ist bei dir noch nicht ausgeprägt. Das sieht auf den Balken nach Gleichgewicht aus, ist aber keins. Weder die Klarheit noch die Umsetzung trägt dich gerade. Das klingt hart, ist aber die ehrlichste Ausgangslage von allen: **Du hast dich noch nicht festgefahren**.";
  }
  if (erkenntnis > 70 && umsetzung > 70) {
    return "Beides ist bei dir stark ausgeprägt, und das ist selten. Du siehst klar und du handelst danach. Genau deshalb sitzt dein blinder Fleck nicht zwischen diesen beiden Werten, sondern **an einer Stelle, die dir von außen niemand mehr spiegelt**.";
  }
  if (luecke >= 30) {
    return "Du siehst deutlich mehr, als du lebst. Zwischen dem, was dir klar ist, und dem, was davon in deinem Alltag ankommt, liegt ein breiter Streifen. Das ist keine Faulheit und kein Charakterfehler. Es ist der häufigste Befund überhaupt, und der unbequemste, **weil du ihn selbst am besten kennst**.";
  }
  if (luecke >= 10) {
    return "Deine Erkenntnis liegt vor deiner Umsetzung. Nicht dramatisch, aber spürbar. Du weißt in den meisten Fällen, was dran wäre. **Ein Teil davon bleibt trotzdem regelmäßig liegen**.";
  }
  if (luecke >= -9) {
    return "Erkenntnis und Umsetzung liegen bei dir fast gleichauf. Was du siehst, lebst du auch. Das ist selten, und es heißt nicht, dass du fertig bist. Es heißt, **dass dein Thema woanders liegt**.";
  }
  if (luecke >= -29) {
    return "Du handelst schneller, als du prüfst. Das bringt dich in Bewegung, und Bewegung ist mehr, als die meisten hinbekommen. Die Frage ist nur, **ob die Richtung deine ist oder eine übernommene**.";
  }
  return "Du bewegst dich viel und hinterfragst wenig. Deine Umsetzungskraft ist deutlich stärker ausgeprägt als dein Blick darauf, wofür du sie einsetzt. **Solange du in Bewegung bleibst, musst du diese Frage nicht stellen**.";
}

const strengthScore = (key, val) => (DIMENSIONS[key].positive ? val : 100 - val);

function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}

/* ─── RADAR (SVG, handgezeichnet, animiert, mit Wert-Tooltip) ──────────── */
function Radar({ values, ideal }) {
  const c = 170, maxR = 118, n = CORE_SCALES.length;
  const [active, setActive] = useState(null);
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i, v) => {
    const r = (Math.max(0, Math.min(100, v)) / 100) * maxR;
    return [c + r * Math.cos(angle(i)), c + r * Math.sin(angle(i))];
  };
  const poly = (obj) => CORE_SCALES.map((k, i) => point(i, obj[k]).join(",")).join(" ");
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg className="erg-radar" viewBox="-72 -8 484 356" role="img" aria-label="Dein Profil im Vergleich zum Idealprofil deines Archetyps">
      {rings.map((fac, i) => (
        <polygon key={i} className="erg-radar-ring"
          points={CORE_SCALES.map((_, idx) => [c + maxR * fac * Math.cos(angle(idx)), c + maxR * fac * Math.sin(angle(idx))].join(",")).join(" ")} />
      ))}
      {CORE_SCALES.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} className="erg-radar-spoke" x1={c} y1={c} x2={x} y2={y} />;
      })}
      {/* Idealprofil */}
      <polygon className="erg-radar-ideal" points={poly(ideal)} />
      {/* Nutzerprofil (animiert) */}
      <g className="erg-radar-userwrap">
        <polygon className="erg-radar-user" points={poly(values)} />
        {CORE_SCALES.map((k, i) => {
          const [x, y] = point(i, values[k]);
          return (
            <g key={k} style={{ cursor: "pointer" }}
               onMouseEnter={() => setActive(i)}
               onMouseLeave={() => setActive((a) => (a === i ? null : a))}
               onClick={() => setActive((a) => (a === i ? null : i))}>
              <circle cx={x} cy={y} r="16" fill="transparent" />
              <circle className="erg-radar-dot" cx={x} cy={y} r="4.5" />
            </g>
          );
        })}
      </g>
      {/* Achsenbeschriftung */}
      {CORE_SCALES.map((k, i) => {
        const [x, y] = [c + (maxR + 16) * Math.cos(angle(i)), c + (maxR + 16) * Math.sin(angle(i))];
        const cos = Math.cos(angle(i));
        const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
        return (
          <text key={k} className="erg-radar-label" x={x} y={y} textAnchor={anchor} dominantBaseline="middle">
            {DIMENSIONS[k].name}
          </text>
        );
      })}
      {/* Wert-Tooltip bei Hover/Tap */}
      {active !== null && (() => {
        const k = CORE_SCALES[active];
        const [px, py] = point(active, values[k]);
        return (
          <g className="erg-radar-tip" pointerEvents="none">
            <rect x={px - 17} y={py - 35} width="34" height="22" rx="6" />
            <text x={px} y={py - 23.5} textAnchor="middle" dominantBaseline="middle">{values[k]}</text>
          </g>
        );
      })()}
    </svg>
  );
}

/* ─── STYLES (scoped unter .erg-root) ──────────────────────────────────── */
const STYLES = `
.erg-root{--creme:#F4F1EB;--sand:#D6CBBF;--warmgrau:#AFA79D;--ink:#1C1C1C;--soft:#595854;--orange:#FF4D00;--r-pill:100px;
  box-sizing:border-box;background:var(--creme);color:var(--ink);min-height:100vh;
  font-family:'Inter Tight',system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased;}
.erg-root *{box-sizing:border-box;}
.erg-wrap{max-width:660px;margin:0 auto;padding:clamp(20px,5vw,44px) clamp(16px,5vw,28px) 80px;}
.erg-root p{margin:0 0 1rem;color:var(--soft);font-size:1rem;}
.erg-root p:last-child{margin-bottom:0;}
.erg-eyebrow{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--warmgrau);font-weight:600;margin-bottom:.5rem;display:flex;align-items:center;gap:.5rem;}
.erg-eyebrow .num{color:var(--orange);font-size:1rem;}
.erg-section{margin-top:clamp(30px,6vw,52px);}
.erg-section h2{font-size:clamp(1.4rem,4.5vw,1.9rem);font-weight:900;letter-spacing:-.02em;line-height:1.15;color:var(--ink);margin:0 0 1rem;}

/* Karten */
.erg-card{background:#fff;border-radius:26px;padding:clamp(22px,5vw,38px);box-shadow:0 18px 50px -28px rgba(28,28,28,.32);}
.erg-card + .erg-card{margin-top:16px;}

/* Kopf */
.erg-header{text-align:center;}
.erg-avatar{height:clamp(150px,40vw,210px);width:auto;margin:0 auto .4rem;display:block;}
.erg-type{font-size:clamp(2rem,8vw,3.1rem);font-weight:900;letter-spacing:-.03em;line-height:1.05;margin:.2rem 0 .6rem;}
.erg-tagline{font-style:italic;color:var(--orange);font-size:clamp(1rem,3vw,1.15rem);max-width:34ch;margin:0 auto;line-height:1.5;}
.erg-greeting{margin-top:1.4rem;font-size:1.05rem;color:var(--ink);font-weight:600;}
.erg-meta{font-size:.74rem;letter-spacing:.06em;color:var(--warmgrau);margin-top:.4rem;text-transform:uppercase;}

/* Vorwort */
.erg-vorwort{background:linear-gradient(180deg,#fff, #fbf9f5);}
.erg-portrait{width:144px;height:144px;border-radius:50%;object-fit:cover;display:block;margin:0 auto 1.2rem;box-shadow:0 8px 22px -12px rgba(28,28,28,.4);}
.erg-signature{font-family:'Caveat',cursive;font-size:1.7rem;color:var(--orange);line-height:1;margin-top:.4rem;}

/* Falle */
.erg-falle{margin-top:16px;background:rgba(255,77,0,.06);border-radius:16px;padding:18px 22px;}
.erg-falle .lbl{display:flex;align-items:center;gap:.5rem;font-weight:800;color:var(--orange);font-size:.86rem;letter-spacing:.04em;text-transform:uppercase;margin-bottom:.5rem;}
.erg-falle p{color:var(--ink);margin:0;}

/* Radar */
.erg-radar-box{display:flex;flex-direction:column;align-items:center;}
.erg-radar{width:100%;max-width:420px;height:auto;overflow:visible;}
.erg-radar-ring{fill:none;stroke:var(--sand);stroke-width:1;opacity:.5;}
.erg-radar-spoke{stroke:var(--sand);stroke-width:1;opacity:.45;}
.erg-radar-ideal{fill:rgba(175,167,157,.14);stroke:var(--warmgrau);stroke-width:1.5;stroke-dasharray:4 4;}
.erg-radar-user{fill:rgba(255,77,0,.16);stroke:var(--orange);stroke-width:2.5;stroke-linejoin:round;}
.erg-radar-dot{fill:var(--orange);stroke:#fff;stroke-width:1.5;}
.erg-radar-userwrap{opacity:0;transform:scale(.4);transform-box:view-box;transform-origin:center;transition:opacity .7s ease,transform .9s cubic-bezier(.2,.8,.2,1);}
.erg-reveal.in .erg-radar-userwrap{opacity:1;transform:scale(1);}
.erg-radar-label{font-size:9.5px;font-weight:600;fill:var(--soft);font-family:'Inter Tight',sans-serif;}
.erg-radar-legend{display:flex;gap:1.4rem;margin-top:1rem;font-size:.78rem;color:var(--soft);flex-wrap:wrap;justify-content:center;}
.erg-radar-legend span{display:inline-flex;align-items:center;gap:.4rem;}
.erg-radar-legend i{width:16px;height:0;border-top-width:3px;border-top-style:solid;display:inline-block;}
.erg-intro-line{margin-top:calc(1.4rem + 28px);font-weight:600;color:var(--ink);font-size:1.02rem;}

/* Dimensions-Items */
.erg-dim-group{margin-top:1.2rem;}
.erg-dim-group h3{font-size:1rem;letter-spacing:.08em;text-transform:uppercase;font-weight:800;margin:0 0 1rem;}
.erg-dim-group.staerken h3{color:var(--orange);}
.erg-dim-group.potenziale h3{color:var(--soft);}
.erg-dim{padding:16px 0;border-top:1px solid rgba(175,167,157,.28);}
.erg-dim:first-of-type{border-top:none;padding-top:.2rem;}
.erg-dim-head{display:flex;align-items:center;gap:.7rem;width:100%;background:none;border:none;padding:0;margin-bottom:.6rem;cursor:pointer;font-family:inherit;color:inherit;text-align:left;}
.erg-dim-name{font-weight:800;color:var(--ink);font-size:1.02rem;}
.erg-bar{height:8px;border-radius:100px;background:rgba(175,167,157,.24);overflow:hidden;margin-bottom:.6rem;}
.erg-bar-fill{height:100%;border-radius:100px;width:0;transition:width 1s cubic-bezier(.2,.8,.2,1);}
.erg-reveal.in .erg-bar-fill{width:var(--w);}
.erg-dim.s .erg-bar-fill{background:var(--orange);}
.erg-dim.p .erg-bar-fill{background:linear-gradient(90deg,var(--warmgrau),var(--sand));}
.erg-dim p{margin:0;font-size:.95rem;}

/* Mischtyp / Reintyp */
.erg-second{display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem;}
.erg-second img{width:74px;height:auto;}
.erg-second .lbl{font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--warmgrau);font-weight:600;}
.erg-second .nm{font-size:1.3rem;font-weight:900;letter-spacing:-.02em;}

/* Ausstieg / Masterclass */
.erg-cta{background:linear-gradient(165deg,#1C1C1C,#2a2a2a);color:var(--creme);border-radius:28px;padding:clamp(26px,6vw,44px);}
.erg-cta .erg-eyebrow{color:rgba(244,241,235,.6);}
.erg-cta h2{color:#fff;}
.erg-cta p{color:rgba(244,241,235,.82);}
.erg-cta .frage{font-size:1.15rem;font-weight:700;color:#fff;font-style:italic;}
.erg-check{list-style:none;padding:0;margin:1.2rem 0;}
.erg-check li{display:flex;gap:.7rem;align-items:flex-start;margin-bottom:.7rem;color:rgba(244,241,235,.92);}
.erg-check .ic{flex:0 0 22px;width:22px;height:22px;border-radius:50%;background:var(--orange);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:900;margin-top:.15rem;}
.erg-price{font-size:1.05rem;font-weight:600;color:#fff !important;}
.erg-cta-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;background:var(--orange);color:#fff;text-decoration:none;font-weight:700;font-size:1.05rem;padding:1.1rem 2.6rem;border-radius:var(--r-pill);margin-top:1rem;box-shadow:0 16px 40px -18px rgba(255,77,0,.7);transition:transform .2s ease;}
.erg-cta-btn:hover{transform:scale(1.03);}

/* Link speichern */
.erg-save{background:#fff;border:1px dashed var(--sand);border-radius:20px;padding:20px 22px;margin-top:20px;text-align:center;}
.erg-save-row{display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;margin-bottom:.7rem;}
.erg-btn{display:inline-flex;align-items:center;gap:.5rem;border:none;cursor:pointer;font-family:inherit;font-weight:700;font-size:.95rem;padding:.85rem 1.6rem;border-radius:var(--r-pill);transition:transform .15s ease,background .2s ease,color .2s ease;}
.erg-btn-primary{background:var(--ink);color:var(--creme);}
.erg-btn-primary:hover{transform:scale(1.03);}
.erg-btn-ghost{background:transparent;color:var(--ink);border:1.5px solid var(--ink);}
.erg-btn-ghost:hover{background:var(--ink);color:var(--creme);}
.erg-save .hint{font-size:.85rem;color:var(--warmgrau);margin:0;}
.erg-save .copied{color:var(--orange);font-weight:700;}

/* Reveal */
.erg-reveal{opacity:0;transform:translateY(22px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.8,.2,1);}
.erg-reveal.in{opacity:1;transform:none;}

/* Fallback */
.erg-fallback{max-width:520px;margin:0 auto;padding:80px 24px;text-align:center;}
.erg-fallback h1{font-size:1.7rem;font-weight:900;margin-bottom:1rem;}
.erg-fallback p{color:var(--soft);}

/* Dimensions-Icons + Akkordeon */
.erg-dim-ic{flex:0 0 20px;}
.erg-dim.s .erg-dim-ic{color:var(--orange);}
.erg-dim.p .erg-dim-ic{color:var(--warmgrau);}
.erg-dim-chev{margin-left:auto;color:var(--warmgrau);font-size:.8rem;transition:transform .3s ease;flex:0 0 auto;}
.erg-dim.open .erg-dim-chev{transform:rotate(180deg);}
.erg-dim-body{max-height:0;overflow:hidden;opacity:0;transition:max-height .4s ease,opacity .3s ease;}
.erg-dim.open .erg-dim-body{max-height:680px;opacity:1;}
.erg-dim-body p{margin:.2rem 0 0;font-size:.95rem;}

/* Radar-Tooltip */
.erg-radar-tip rect{fill:var(--ink);}
.erg-radar-tip text{fill:#fff;font-size:12px;font-weight:800;font-family:'Inter Tight',sans-serif;}

/* Share (viral: der Test wird geteilt, nicht das Ergebnis) */
.erg-share{margin-top:clamp(30px,6vw,52px);text-align:center;}
.erg-share h3{font-size:1.3rem;font-weight:900;letter-spacing:-.01em;margin:0 0 .3rem;color:var(--ink);}
.erg-share .sub{font-size:.95rem;color:var(--soft);margin:0 0 1.1rem;}
.erg-share-row{display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;}
.erg-share-btn{display:inline-flex;align-items:center;gap:.5rem;border:none;cursor:pointer;font-family:inherit;font-weight:700;font-size:.95rem;padding:.8rem 1.5rem;border-radius:var(--r-pill);text-decoration:none;transition:transform .15s ease;}
.erg-share-btn:hover{transform:translateY(-1px);}
.erg-share-btn svg{width:20px;height:20px;}
.erg-share-wa{background:#25D366;color:#fff;}
.erg-share-tg{background:#2AABEE;color:#fff;}
.erg-share-cp{background:var(--ink);color:var(--creme);}
.erg-share .copied{color:var(--orange);font-weight:700;font-size:.85rem;margin-top:.8rem;}

/* Die Lücke */
.erg-luecke-intro{font-weight:600;color:var(--ink);margin-bottom:1.6rem;}
.erg-gap{position:relative;margin-bottom:1.6rem;}
.erg-gap-row{margin-bottom:1.1rem;}
.erg-gap-row:last-of-type{margin-bottom:0;}
.erg-gap-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:.45rem;}
.erg-gap-lbl{font-weight:800;color:var(--ink);font-size:1rem;}
.erg-gap-val{font-weight:900;font-size:1.05rem;font-variant-numeric:tabular-nums;}
.erg-gap-row.erk .erg-gap-val{color:var(--orange);}
.erg-gap-row.ums .erg-gap-val{color:var(--soft);}
.erg-gap-track{position:relative;height:14px;border-radius:100px;background:rgba(175,167,157,.24);overflow:hidden;}
.erg-gap-fill{height:100%;border-radius:100px;width:0;transition:width 1.1s cubic-bezier(.2,.8,.2,1);}
.erg-reveal.in .erg-gap-fill{width:var(--w);}
.erg-gap-row.erk .erg-gap-fill{background:var(--orange);}
.erg-gap-row.ums .erg-gap-fill{background:linear-gradient(90deg,var(--warmgrau),var(--sand));}
/* Der markierte Abstand zwischen den Balkenenden - das ist die eigentliche Botschaft. */
.erg-gap-delta{position:absolute;height:14px;border-radius:100px;top:0;
  background:repeating-linear-gradient(135deg,rgba(255,77,0,.5) 0 5px,rgba(255,77,0,.16) 5px 10px);
  opacity:0;transition:opacity .5s ease .9s;}
.erg-reveal.in .erg-gap-delta{opacity:1;}
.erg-gap-caption{margin-top:.9rem;font-size:.86rem;color:var(--warmgrau);text-align:center;}
.erg-gap-caption b{color:var(--orange);font-weight:800;font-variant-numeric:tabular-nums;}

/* Recognition-Slider */
.erg-slider{text-align:center;}
.erg-slider h2{margin-bottom:.6rem;}
.erg-slider .lead{max-width:42ch;margin:0 auto 1.6rem;}
.erg-slider-scale{display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;}
.erg-slider-btn{width:60px;height:60px;border:1.5px solid var(--warmgrau);border-radius:18px;background:transparent;
  font-family:inherit;font-size:1.2rem;font-weight:800;color:var(--ink);cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;transition:all .2s ease;}
@media (hover:hover){.erg-slider-btn:hover:not(.sel){border-color:var(--orange);background:rgba(255,77,0,.07);}}
.erg-slider-btn.sel{border-color:var(--orange);background:var(--orange);color:#fff;transform:scale(1.06);}
.erg-slider-labels{display:flex;justify-content:space-between;max-width:352px;margin:.7rem auto 0;
  font-size:.74rem;color:var(--warmgrau);letter-spacing:.04em;text-transform:uppercase;}
.erg-slider-thanks{margin-top:1.2rem;color:var(--orange);font-weight:700;font-size:.92rem;}

/* Schlussblock */
.erg-outro .erg-card p:last-child{margin-bottom:0;}
.erg-outro-lead{font-weight:700;color:var(--ink) !important;}

@media (max-width:420px){
  .erg-slider-btn{width:52px;height:52px;font-size:1.05rem;}
  .erg-slider-scale{gap:.5rem;}
  .erg-slider-labels{max-width:300px;}
}

@media (prefers-reduced-motion: reduce){
  .erg-reveal,.erg-bar-fill,.erg-radar-userwrap,.erg-gap-fill,.erg-gap-delta{transition:none !important;}
  .erg-reveal{opacity:1;transform:none;}
  .erg-reveal .erg-gap-delta{opacity:1;}
}
`;

/* ─── DIE LÜCKE: zwei Balken, ein markierter Abstand ──────────────────────
   Bewusst OHNE "/100". Mit Nenner liest es sich wie eine Schulnote, und dann
   diskutiert der Leser seine Punktzahl statt den Abstand. */
function LueckeBlock({ values }) {
  const { erkenntnis, umsetzung, luecke } = computeLuecke(values);
  const lo = Math.min(erkenntnis, umsetzung);
  const hi = Math.max(erkenntnis, umsetzung);
  const zeigeDelta = Math.abs(luecke) >= 4; // darunter waere der Streifen ein Strich

  return (
    <div className="erg-card">
      <p className="erg-luecke-intro">
        Zwei Werte aus deinen Antworten: wie klar du siehst, und wie konsequent du danach lebst.
        Der Abstand dazwischen ist der eigentliche Befund.
      </p>

      <div className="erg-gap">
        <div className="erg-gap-row erk">
          <div className="erg-gap-head">
            <span className="erg-gap-lbl">Erkenntnis</span>
            <span className="erg-gap-val">{erkenntnis}</span>
          </div>
          <div className="erg-gap-track">
            <div className="erg-gap-fill" style={{ "--w": `${erkenntnis}%` }} />
          </div>
        </div>

        <div className="erg-gap-row ums">
          <div className="erg-gap-head">
            <span className="erg-gap-lbl">Umsetzung</span>
            <span className="erg-gap-val">{umsetzung}</span>
          </div>
          <div className="erg-gap-track">
            <div className="erg-gap-fill" style={{ "--w": `${umsetzung}%` }} />
            {zeigeDelta && (
              <div className="erg-gap-delta" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />
            )}
          </div>
        </div>

        {zeigeDelta && (
          <p className="erg-gap-caption">
            Der schraffierte Bereich ist deine Lücke: <b>{Math.abs(luecke)} Punkte</b>
          </p>
        )}
      </div>

      <p><RichText text={lueckeText({ erkenntnis, umsetzung, luecke })} /></p>
    </div>
  );
}

/* ─── RECOGNITION-SLIDER ───────────────────────────────────────────────────
   Skala 1-5, identisch zum bisherigen Slider im Test. Nicht auf 1-10 aendern,
   ohne den GTM-Trigger "recognition_score_min4" (Muster ^[45]$) mitzuziehen -
   sonst feuert das Meta-Event HighRecognition beim Mittelfeld.

   Das Event wird um 1,5 Sekunden verzoegert gesendet. Wer von 3 auf 5
   korrigiert, erzeugt so EIN Event mit dem Endwert statt zweier Events.
   archetype faehrt mit, weil genau daraus die interessante Auswertung
   entsteht: Welches Profil erkennt sich am staerksten wieder? */
function RecognitionSlider({ archetype }) {
  const [score, setScore] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function pick(n) {
    setScore(n);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      trackEvent("recognition_score", { score: n, archetype });
    }, 1500);
  }

  return (
    <div className="erg-card erg-slider">
      <h2>Wie genau trifft das Ergebnis auf dich zu?</h2>
      <p className="lead">
        Hat es dich getroffen, oder lag es daneben? Sei ehrlich, ich lese das wirklich.
      </p>
      <div className="erg-slider-scale" role="group" aria-label="Wie genau trifft das Ergebnis auf dich zu?">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`erg-slider-btn${score === n ? " sel" : ""}`}
            aria-pressed={score === n}
            onClick={() => pick(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="erg-slider-labels"><span>Gar nicht</span><span>Voll und ganz</span></div>
      {score !== null && <p className="erg-slider-thanks">Danke dir.</p>}
    </div>
  );
}

/* ─── HAUPTKOMPONENTE ──────────────────────────────────────────────────── */
function DimItem({ dimKey, kind, value }) {
  const [open, setOpen] = useState(false);
  const dim = DIMENSIONS[dimKey];
  const fill = kind === "s" ? strengthScore(dimKey, value) : 100 - strengthScore(dimKey, value);
  const text = kind === "s" ? dim.staerke : dim.potenzial;
  return (
    <div className={`erg-dim ${kind}${open ? " open" : ""}`}>
      <button className="erg-dim-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <DimIcon k={dimKey} />
        <span className="erg-dim-name">{dim.name}</span>
        <span className="erg-dim-chev" aria-hidden="true">▾</span>
      </button>
      <div className="erg-bar"><div className="erg-bar-fill" style={{ "--w": `${fill}%` }} /></div>
      <div className="erg-dim-body"><p><RichText text={text} /></p></div>
    </div>
  );
}

/* ─── HAUPTKOMPONENTE ──────────────────────────────────────────────────── */
export default function DeinErgebnis() {
  /*  Lazy-Initializer: laeuft beim allerersten Render, also so frueh wie
      moeglich. stripUrlToken() raeumt dabei die Adresszeile auf. React ruft
      den Initializer im StrictMode zweimal auf - beim zweiten Mal steht kein
      ?d= mehr in der URL, dann greift der sessionStorage-Fallback und liefert
      denselben Token. Deshalb ist das doppelte Ausfuehren hier harmlos. */
  const [result] = useState(() => decodeToken(stripUrlToken()));
  const { status, data } = result;

  const rootRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const trackedRef = useRef(false);

  /*  Clarity abschalten. Clarity laedt erst nach der Consent-Entscheidung ueber
      GTM, kann beim Mount also noch fehlen - deshalb wird bis zu 15 Sekunden
      nachgefasst. Laeuft auch auf den Fallback-Screens: Auch dort koennte im
      sessionStorage noch ein Ergebnis stehen. */
  useEffect(() => {
    if (stopClarity()) return;
    let versuche = 0;
    const iv = setInterval(() => {
      if (stopClarity() || ++versuche > 60) clearInterval(iv);
    }, 250);
    return () => clearInterval(iv);
  }, []);

  /*  ergebnis_abgerufen: der Beweis, dass die Ergebnis-Mail angekommen ist UND
      geklickt wurde. Genau das Funnel-Leck, das bisher niemand sehen konnte.
      Ref-Guard gegen den doppelten Effekt-Aufruf im StrictMode. */
  useEffect(() => {
    if (status !== "ok" || !data || trackedRef.current) return;
    trackedRef.current = true;
    trackEvent("ergebnis_abgerufen", {
      archetype: data.primaryKey,
      is_reintyp: data.isReintyp ? "true" : "false",
    });
  }, [status, data]);

  useEffect(() => {
    if (!rootRef.current) return;
    const els = rootRef.current.querySelectorAll(".erg-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  async function copyShare() {
    try { await navigator.clipboard.writeText(SHARE_MSG + "\n\n" + TEST_URL); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    catch { /* stille Fehlbehandlung */ }
  }

  /*  Drei Fehlerbilder, drei Texte. Jeder sagt, was jetzt konkret zu tun ist -
      "geht nicht" allein schickt Leute weg, die alles richtig gemacht haben.
      Bewusst NICHT auf die 404-Seite umleiten: Die Seite gibt es ja, nur der
      Schluessel fehlt. */
  if (status !== "ok" || !data) {
    const FALLBACKS = {
      empty: {
        h: "Hier fehlt dein persönlicher Schlüssel.",
        p: [
          "Diese Seite zeigt dein Ergebnis nur, wenn du sie über deinen persönlichen Link öffnest. Den hast du per E-Mail bekommen.",
          "Öffne die Mail mit dem Betreff „Dein Ergebnis“ und klick den Link darin noch einmal an. Wenn du sie nicht findest: Schau im Werbe- oder Spam-Ordner nach.",
        ],
      },
      broken: {
        h: "Dieser Link ist unvollständig.",
        p: [
          "Da fehlt ein Stück. Das passiert, wenn ein Link beim Kopieren abgeschnitten wird oder wenn das E-Mail-Programm ihn über zwei Zeilen umbricht.",
          "Geh zurück in deine Ergebnis-Mail und klick den Link dort direkt an, statt ihn zu kopieren. Dann kommt er vollständig an.",
        ],
      },
      outdated: {
        h: "Dieser Link stammt aus einer älteren Version.",
        p: [
          "Der Test wurde weiterentwickelt, und dein Link passt nicht mehr zur aktuellen Auswertung. Dein altes Ergebnis lässt sich damit leider nicht mehr korrekt anzeigen.",
          "Der schnellste Weg zu einem gültigen Ergebnis: den Test einmal neu machen. Er dauert rund zehn Minuten, und du bekommst danach direkt einen frischen Link.",
        ],
        cta: true,
      },
    };
    const fb = FALLBACKS[status] || FALLBACKS.broken;

    return (
      <div className="erg-root">
        <style>{STYLES}</style>
        <div className="erg-fallback">
          <h1>{fb.h}</h1>
          {fb.p.map((t, i) => <p key={i}>{t}</p>)}
          {fb.cta && (
            <p style={{ marginTop: "1.6rem" }}>
              <a className="erg-cta-btn" href={TEST_URL} style={{ marginTop: 0 }}>Zum Test →</a>
            </p>
          )}
        </div>
      </div>
    );
  }

  const meta = ARCHETYPES[data.primaryKey];
  const ideal = TYPE_PROFILES[data.primaryKey];
  const secMeta = data.secondaryKey ? ARCHETYPES[data.secondaryKey] : null;
  const showMischtyp = !data.isReintyp && secMeta && MISCHTYP[`${data.primaryKey}+${data.secondaryKey}`];
  const dateStr = formatDate(data.date);
  const waHref = `https://wa.me/?text=${encodeURIComponent(SHARE_MSG + "\n\n" + TEST_URL)}`;
  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(TEST_URL)}&text=${encodeURIComponent(SHARE_MSG)}`;

  return (
    <div className="erg-root" ref={rootRef}>
      <style>{STYLES}</style>
      <div className="erg-wrap">

        {/* ① KOPF */}
        <header className="erg-card erg-header erg-reveal">
          <img className="erg-avatar" src={meta.avatar} alt={meta.name} onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div className="erg-eyebrow" style={{ justifyContent: "center" }}><span className="num">①</span> Dein Ergebnis</div>
          <div className="erg-type">{meta.name}</div>
          <div className="erg-tagline">{meta.tagline}</div>
          {data.name && <div className="erg-greeting">Hi {data.name}, schön dass du da bist.</div>}
          {dateStr && <div className="erg-meta">Test vom {dateStr}</div>}
        </header>

        {/* ② UNBEQUEME WAHRHEIT */}
        <section className="erg-section erg-reveal">
          <div className="erg-eyebrow"><span className="num">②</span> Die unbequeme Wahrheit</div>
          <h2>Was dich ausbremst</h2>
          <div className="erg-card">
            {meta.wahrheit.map((t, i) => <p key={i}><RichText text={t} /></p>)}
            <div className="erg-falle">
              <div className="lbl">⚠ Deine Falle</div>
              <p><RichText text={meta.falle} /></p>
            </div>
          </div>
        </section>

        {/* ③ DIE LÜCKE - die staerkste Einzelaussage, deshalb weit vorne */}
        <section className="erg-section erg-reveal">
          <div className="erg-eyebrow"><span className="num">③</span> Der eigentliche Befund</div>
          <h2>Die Lücke</h2>
          <LueckeBlock values={data.values} />
        </section>

        {/* ④ DEIN PROFIL: Radar + Top-3 (Akkordeon) */}
        <section className="erg-section erg-reveal">
          <div className="erg-eyebrow"><span className="num">④</span> Das ist bei dir besonders auffällig</div>
          <h2>Dein Profil über zehn Dimensionen</h2>
          <div className="erg-card">
            <div className="erg-radar-box">
              <Radar values={data.values} ideal={ideal} />
              <div className="erg-radar-legend">
                <span><i style={{ borderColor: "var(--orange)" }} /> Dein Profil</span>
                <span><i style={{ borderColor: "var(--warmgrau)", borderTopStyle: "dashed" }} /> Idealprofil {meta.name}</span>
              </div>
            </div>
            <p className="erg-intro-line">Aus deinem Profil stechen drei Stärken und drei unausgeschöpfte Potenziale besonders hervor:</p>

            <div className="erg-dim-group staerken">
              <h3>Deine 3 größten Stärken</h3>
              {data.strengths.map((k) => <DimItem key={k} dimKey={k} kind="s" value={data.values[k]} />)}
            </div>

            <div className="erg-dim-group potenziale">
              <h3>Deine 3 größten unausgeschöpften Potenziale</h3>
              {data.potentials.map((k) => <DimItem key={k} dimKey={k} kind="p" value={data.values[k]} />)}
            </div>
          </div>
        </section>

        {/* ⑤ MISCHTYP oder REINTYP */}
        <section className="erg-section erg-reveal">
          {data.isReintyp || !showMischtyp ? (
            <>
              <div className="erg-eyebrow"><span className="num">⑤</span> Dein Profil ist eindeutig</div>
              <h2>Ein klarer Fall</h2>
              <div className="erg-card"><p><RichText text={meta.reintyp} /></p></div>
            </>
          ) : (
            <>
              <div className="erg-eyebrow"><span className="num">⑤</span> Dein zweiter Anteil</div>
              <h2>Was noch in dir steckt</h2>
              <div className="erg-card">
                <div className="erg-second">
                  <img src={secMeta.avatar} alt={secMeta.name} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <div>
                    <div className="lbl">Dein Zweitanteil</div>
                    <div className="nm">{secMeta.name}</div>
                  </div>
                </div>
                <p><RichText text={MISCHTYP[`${data.primaryKey}+${data.secondaryKey}`]} /></p>
              </div>
            </>
          )}
        </section>

        {/* ⑥ SO KÖNNTE DEIN LEBEN AUSSEHEN */}
        <section className="erg-section erg-reveal">
          <div className="erg-eyebrow"><span className="num">⑥</span> So könnte dein Leben aussehen</div>
          <h2>Deine Potenzial-Analyse</h2>
          <div className="erg-card">
            {meta.potenzial.map((t, i) => <p key={i}><RichText text={t} /></p>)}
          </div>
        </section>

        {/* SLIDER - direkt hinter dem letzten inhaltlichen Wort.
            Erst alles lesen, dann bewerten. Alles darunter ist Rahmen,
            keine Aussage ueber die Person mehr. */}
        <section className="erg-section erg-reveal">
          <div className="erg-eyebrow">Kurz nachgefragt</div>
          <RecognitionSlider archetype={data.primaryKey} />
        </section>

        {/* SCHLUSSBLOCK */}
        <section className="erg-section erg-reveal erg-outro">
          <div className="erg-eyebrow">Zum Schluss</div>
          <h2>Erkennen ist noch nicht Ändern</h2>
          <div className="erg-card">
            <p className="erg-outro-lead">Du hast jetzt ein ziemlich vollständiges Bild von dir. Und genau da fängt das eigentliche Problem an: Erkennen fühlt sich schon an wie Verändern. Ist es aber nicht.</p>
            <p>Woran das liegt und was der Schritt danach wirklich braucht, daran arbeite ich gerade. Du stehst auf der Liste und erfährst es als Erster.</p>
          </div>
        </section>

        {/* AUSBLICK - weicht zum Masterclass-Launch dem echten Pitch (⑥ aus dem
            Textdokument, 27 EUR). Das ist eingeplant, kein Rueckbau. */}
        <section className="erg-section erg-reveal">
          <div className="erg-card erg-cta">
            <div className="erg-eyebrow">Ausblick</div>
            <h2>Was als Nächstes kommt</h2>
            <p>Ich baue gerade für jeden Archetyp eine eigene Masterclass. Kein weiterer Input zum Sammeln, sondern genau der Teil, den dieses Ergebnis bewusst offen lässt: der Weg von der Erkenntnis in ein Leben, das sich wirklich anders anfühlt.</p>
            <p>Sobald es soweit ist, melde ich mich bei dir. Eintragen musst du dich nicht mehr, das hast du ja schon.</p>
          </div>
        </section>

        {/* PERSÖNLICHER ABSCHLUSS (das frühere PDF-Vorwort, ans Ende gerueckt) */}
        <section className="erg-section erg-reveal">
          <div className="erg-eyebrow">Der Mensch dahinter</div>
          <h2>Noch was Persönliches zum Schluss</h2>
          <div className="erg-card erg-vorwort">
            <img className="erg-portrait" src="/images/portrait-round.png" alt="Florian Lingner" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            {VORWORT.map((t, i) => <p key={i}><RichText text={t} /></p>)}
            <div className="erg-signature">Florian</div>
          </div>
        </section>

        {/* SHARE (allerletzter Block - der Test wird geteilt, nicht das Ergebnis) */}
        <div className="erg-share erg-reveal">
          <h3>Dir hat der Test gefallen?</h3>
          <p className="sub">Teile ihn mit deinen Freunden:</p>
          <div className="erg-share-row">
            <a className="erg-share-btn erg-share-wa" href={waHref} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a className="erg-share-btn erg-share-tg" href={tgHref} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram
            </a>
            <button className="erg-share-btn erg-share-cp" onClick={copyShare}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {copied ? "Kopiert ✓" : "Link kopieren"}
            </button>
          </div>
          {copied && <p className="copied">Text und Link liegen in deiner Zwischenablage.</p>}
        </div>

      </div>
    </div>
  );
}
