import { useEffect, useMemo, useRef, useState } from "react";

/*  ────────────────────────────────────────────────────────────────────────
    /dein-ergebnis  ·  Personalisierte Ergebnisseite (Unfuck-Typentest)
    ────────────────────────────────────────────────────────────────────────
    Liest den Token aus ?d=<base64url>, baut daraus den vollstaendigen Report.
    Der Token traegt NUR den persoenlichen Kern (Name, Archetyp, 10 Werte,
    Top-3). Alle Texte liegen hier im Code.

    WICHTIG (Leitplanke): Dieser Pfad muss in App.jsx in NO_TRACKING stehen
    und noindex sein - im Link steht ein Vorname. Siehe Uebergabe.
    ──────────────────────────────────────────────────────────────────────── */

const ARCHETYPE_ORDER = ["zuschauer", "getriebener", "idealist", "suchender", "klarsichtiger"];
const CORE_SCALES = ["REF", "SL", "ML", "OL", "ETH", "WS", "NAT", "EX", "EF", "HA"];

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
    staerke: "Du hinterfragst dich selbst ehrlicher als die meisten. Wo andere auf Autopilot durchs Leben gehen, nimmst du dir die Zeit, hinzuschauen und zu verstehen.",
    potenzial: "Du handelst oft, ohne vorher innezuhalten. Das gibt dir Tempo, aber es führt auch dazu, dass du Muster wiederholst, die dir nicht guttun. Mehr Reflexion würde dir helfen, bessere Entscheidungen zu treffen.",
  },
  SL: {
    name: "Selbstführung", positive: true,
    staerke: "Du triffst Entscheidungen aus dir selbst heraus, statt dich nach den Erwartungen anderer zu richten. Das ist seltener, als du denkst, und ein echtes Fundament für ein selbstbestimmtes Leben.",
    potenzial: "Du orientierst dich stark an den Erwartungen anderer oder an dem, was sich bewährt hat. Das gibt Sicherheit, aber es kann dazu führen, dass du ein Leben lebst, das sich nicht wirklich wie deins anfühlt.",
  },
  ML: {
    name: "Mentale Klarheit", positive: false,
    staerke: "Du schaffst es, deinen Kopf ruhig zu halten, wenn es darauf ankommt. Während andere in Gedankenspiralen feststecken, bleibst du meist klar. Das ist eine unterschätzte Stärke, die dir in schwierigen Momenten einen echten Vorteil gibt.",
    potenzial: "Dein Kopf arbeitet oft auf Hochtouren, auch wenn du es dir nicht anmerken lässt. Grübeln, Überdenken, Gedankenkreise. Deine mentale Last ist hoch, und hier hast du klar Luft nach oben. Mit weniger Last lebt es sich leichter, und du kannst deine mentale Energie gezielter einsetzen, statt sie im Kreis zu verbrennen.",
  },
  OL: {
    name: "Innere Orientierung", positive: false,
    staerke: "Du weißt dich in dieser komplizierten Welt gut zurechtzufinden. Während andere orientierungslos durchs Leben treiben, hast du eine Richtung und einen inneren Anker. Das geht den wenigsten so, und es gibt dir eine Stabilität, die andere bei dir spüren und schätzen.",
    potenzial: "Du spürst, dass etwas fehlt, aber es fällt dir schwer zu benennen, was genau. Die Richtung ist unklar, und das führt dazu, dass du entweder gar nicht losgehst oder ständig die Spur wechselst.",
  },
  ETH: {
    name: "Ethische Integrität", positive: true,
    staerke: "Du hast einen klaren inneren Kompass und lebst auch danach. Deine Werte bleiben keine Theorie. Sie zeigen sich darin, wie du dich verhältst und welche Entscheidungen du triffst.",
    potenzial: "Du passt dich häufig an, statt für das einzustehen, was dir wirklich wichtig ist. An Werten mangelt es dir nicht, wohl aber an der Konsequenz, auch dann danach zu handeln, wenn es unbequem wird. Ein Leben im Einklang mit deinen innersten Werten fühlt sich unglaublich echt an.",
  },
  WS: {
    name: "Emotionale Balance", positive: false,
    staerke: "Du lässt dich von den großen Problemen der Welt nicht lähmen. Das heißt nicht, dass dir alles egal wäre. Du hast wahrscheinlich einen gesünderen Umgang damit gefunden als viele andere und kannst Informationen aufnehmen, ohne dich davon auffressen zu lassen.",
    potenzial: "Die Probleme der Welt gehen dir nahe, manchmal zu nahe. Dein Gerechtigkeitssinn ist echt, aber er kann dich auch lähmen. Bedenke: Nur ein handlungsfähiges Du kann etwas verändern. Hier liegt Potenzial, deine Energie dorthin zu lenken, wo du wirklich etwas bewegen kannst: bei dir selbst. Der Rest kommt danach.",
  },
  NAT: {
    name: "Zugang zu Tiefe", positive: true,
    staerke: "Du hast einen natürlichen Zugang zu den tieferen Ebenen des Lebens. Ob durch Natur, Stille oder Reflexion: Du spürst, dass hinter der Oberfläche mehr ist, und du nimmst dir auch den Raum dafür.",
    potenzial: "Du lebst stark an der Oberfläche und kommst selten in Kontakt mit dem, was unter dem Alltag liegt. Das ist nicht schlimm, aber es fehlt dir ein Ventil für die tieferen Fragen, die irgendwann so oder so kommen werden.",
  },
  EX: {
    name: "Eigenverantwortung", positive: false,
    staerke: "Du suchst die Verantwortung zuerst bei dir selbst, bevor du mit dem Finger auf andere zeigst. Das ist eine reife Haltung, die dir ermöglicht, an den Dingen zu arbeiten, die tatsächlich in deiner Kontrolle liegen.",
    potenzial: "Du neigst dazu, die Ursachen für das, was nicht läuft, eher im Außen zu suchen als bei dir. Das ist menschlich, aber es nimmt dir die Handlungsmacht. Dein Potenzial liegt darin, den Blick öfter nach innen zu richten. Diese Fähigkeit zur Reflexion lässt sich lernen und kann der Turbo für deine Entwicklung sein.",
  },
  EF: {
    name: "Selbstbestimmung", positive: false,
    staerke: "Du lebst nach deinen eigenen Maßstäben statt nach den Erwartungen anderer. Wo viele sich anpassen und funktionieren, gehst du deinen eigenen Weg. Diese Eigenständigkeit ist selten und gibt dir eine Freiheit, die vielen fehlt.",
    potenzial: "Du richtest dich stark danach aus, was andere von dir erwarten oder was sich bewährt hat. Das gibt Sicherheit, aber es führt dazu, dass du dich eher anpasst, als dich wirklich zu entfalten. Vieles in deinem Leben folgt fremden Maßstäben statt deinen eigenen.",
  },
  HA: {
    name: "Handlungsfähigkeit", positive: true,
    staerke: "Du setzt um, was du dir vornimmst. Bei dir bleibt es nicht beim Reden und Planen, du kommst ins Machen. Das unterscheidet dich von vielen, die ewig in der Analyse-Phase stecken bleiben.",
    potenzial: "Du verstehst oft, was zu tun wäre, aber die Umsetzung fällt dir häufig schwer. Der Graben zwischen Wissen und Handeln ist deine größte Baustelle. Die Devise: weniger planen und grübeln, mehr trauen.",
  },
};

const VORWORT = [
  "Hi, mein Name ist Florian, und ich will ehrlich mit dir sein: Ich hatte mein Leben nicht immer im Griff. Über einen langen Zeitraum wurde ich immer unglücklicher. Monat für Monat.",
  "Das, was ich irgendwann nach einigen Jahren an Arbeit endlich über mich verstehen durfte, hat dann alles verändert. Doch bis dahin hat es mich viele Jahre gekostet, in denen ich längst hätte glücklich sein können. Also habe ich mich oft gefragt: Wieso gibt es keine Abkürzung dorthin?",
  "Und klar, Transformation passiert nicht über Nacht. Aber wie sagt man so schön: Selbsterkenntnis ist der erste Schritt zur Besserung. Und genau dafür, für ehrliches Hinschauen, habe ich diesen Test gebaut.",
  "Wenn du wirklich ehrlich geantwortet hast, spiegelt dir dieses Ergebnis auch unangenehme Blind Spots. Genau das macht dieses Ergebnis so wertvoll: ein ehrlicher Spiegel deines aktuellen Selbst. Lies den Report offen, und wenn du es zulässt, kann er vielleicht ein ähnlicher Türöffner für dich sein, wie meine Erkenntnisse es damals für mich waren.",
];

const ARCHETYPES = {
  zuschauer: {
    name: "Der Zuschauer", dativ: "Zuschauer", avatar: "/images/Archetypen-Zuschauer.png",
    tagline: "Dein scharfer Verstand ist ein Segen - und genau der steht dir im Weg.",
    wahrheit: [
      "Deine Beobachtungsgabe ist messerscharf. Du durchschaust Situationen, Menschen und Zusammenhänge, während andere noch nicht mal wissen, welche Frage sie zuerst stellen sollen. Diese Klarheit ist wertvoll und selten.",
      "Aber Erkennen ist nicht Handeln. Genau da liegt dein Haken: Du siehst Dinge, die andere übersehen, und hast dadurch einen Vorsprung, theoretisch. Denn solange die Erkenntnis nur in deinem Kopf bleibt, verändert sie in deinem Leben genau nichts.",
    ],
    falle: "Du analysierst im Kreis und verwechselst Erkenntnis mit Fortschritt. Jeder Tag, an dem du nur verstehst statt zu handeln, macht den nächsten Schritt nicht leichter, sondern schwerer.",
    potenzial: [
      "Stell dir einen Zuschauer vor, der von der Tribüne aufs Feld gegangen ist. Sein scharfer Blick ist geblieben, aber er schaut nicht mehr nur zu.",
      "Deine Analyse ist dann kein Versteck mehr, sondern ein Werkzeug. Du denkst immer noch gründlich, aber du merkst inzwischen, wann du fertig gedacht hast. Und an genau dieser Stelle machst du den Schritt, statt eine weitere Runde zu drehen. Was du erkennst, landet in deinem Leben, nicht nur in deinem Kopf.",
      "Das verändert mehr, als du ahnst. Deine Klarheit hatte immer schon Substanz, ihr fehlte nur die Wirkung. Menschen erleben dich nicht mehr als jemanden, der Dinge durchschaut, sondern als jemanden, der Dinge bewegt. Und dieses zermürbende Gefühl, dass dein Leben ohne dich weiterläuft, verschwindet. Du lebst es wieder mit.",
      "Das ist keine Fantasie, du bist näher dran, als du glaubst. Deine Erkenntnis war nie das Problem, du hast alles längst durchschaut. Und stehst trotzdem an derselben Stelle wie vor einem Jahr. Wenn der Weg so klar vor dir liegt: Was hält dich eigentlich davon ab, ihn endlich zu gehen?",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar. Kein zweiter Archetyp mischt sich merklich ein, du bist Zuschauer in Reinform. Das ist keine schlechte Nachricht, im Gegenteil: Bei dir liegt kein zweites Muster über dem eigentlichen Hebel. Es gibt genau einen Punkt, an dem du ansetzen musst, und alles darüber zeigt ihn dir schwarz auf weiß. Klarer als bei den meisten. Das macht deinen nächsten Schritt einfacher, nicht schwerer.",
  },
  getriebener: {
    name: "Der Getriebene", dativ: "Getriebenen", avatar: "/images/Archetypen-Getriebener.png",
    tagline: "Deine Power ist beeindruckend - nur setzt du sie aktuell wahrscheinlich für das Erreichen von Zielen ein, die du dir nicht wirklich unbeeinflusst selbst gesetzt hast.",
    wahrheit: [
      "Du bist ein Macher. Wo andere zögern, lieferst du. Deine Disziplin, deine Belastbarkeit, dein Durchhaltevermögen, das ist selten, und es hat dich weit gebracht. Auf dich ist Verlass.",
      "Nur: Bewegung ist nicht dasselbe wie Richtung. Du funktionierst, aber irgendwann hat sich die Frage verschoben von „Will ich das?“ zu „Wie schaffe ich das?“. Und solange du in Bewegung bleibst, musst du dir die erste Frage nicht stellen.",
    ],
    falle: "Du bist so beschäftigt mit Funktionieren, dass du gar nicht merkst, wie weit du dich von dir selbst entfernt hast. Noch mehr Leistung bringt dich diesem Punkt nicht näher, sie bringt dich weiter weg.",
    potenzial: [
      "Stell dir einen Getriebenen vor, der immer noch mit voller Kraft läuft, aber endlich in seine eigene Richtung.",
      "Deine Power ist geblieben, sie hat jetzt nur ein Ziel, das wirklich deins ist. Du lieferst weiterhin ab, aber du fragst dich vorher, wofür. Und wenn die Antwort nicht trägt, dann lässt du es. Diese Fähigkeit, etwas nicht zu tun, wird deine größte Freiheit.",
      "Der Sonntagabend fühlt sich anders an. Die Unruhe, die dich in stillen Momenten überfällt, meldet sich seltener, weil du ihr nicht mehr ausweichen musst. Stillstand ist keine Bedrohung mehr, sondern eine Pause, die du dir erlaubst. Und wenn du abends erschöpft bist, dann ist es die gute Erschöpfung von etwas, das dir wirklich etwas bedeutet.",
      "Das ist keine Fantasie, du bist näher dran, als du glaubst. An deiner Kraft hat es nie gelegen, du hast mehr davon als die meisten. Die Frage, die bleibt, ist unbequem: Wenn du so viel bewegen kannst, warum bewegst du dich dann seit Jahren in eine Richtung, die sich nicht nach dir anfühlt?",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar. Kein zweiter Archetyp mischt sich merklich ein, du bist der Getriebene in Reinform. Das erklärt vieles: Dein Antrieb kennt keine Gegenstimme, die ihn mal ausbremst. Genau das macht dich so leistungsfähig, und genau das macht es so schwer, den Fuß vom Gas zu nehmen.",
  },
  idealist: {
    name: "Der Idealist", dativ: "Idealisten", avatar: "/images/Archetypen-Idealist.png",
    tagline: "Du willst die Welt besser machen - und vergisst dabei den Einen, der dich am dringendsten braucht: dich.",
    wahrheit: [
      "Du spürst, was auf der Welt schiefläuft. Ungerechtigkeit, Oberflächlichkeit, der Zustand der Welt, das perlt an dir nicht ab, das geht dir nah. Dieser Wertekompass ist echt und tief, und ehrlich gesagt bräuchte die Welt mehr Menschen wie dich.",
      "Dein Weltschmerz erzeugt ein Gewicht auf deinen Schultern, das dich langsam auffrisst. Du gibst deine Energie nach außen, an Themen, an andere, an das große Ganze, bis für dich selbst nichts mehr übrig ist. Das Paradoxe: Du hast ein gutes Gespür dafür, wie man Umstände besser machen kann, außer bei deinem eigenen Leben.",
    ],
    falle: "Dein Gerechtigkeitssinn ist ehrenvoll, aber wenn du dich von ihm zu unbewusst antreiben lässt, kann er sich gegen dich richten. Großes ändern beginnt dennoch im Kleinen. Bei dir.",
    potenzial: [
      "Stell dir einen Idealisten vor, der die Welt immer noch verändern will und dem es dabei richtig gut geht.",
      "Dein Mitgefühl ist geblieben, es frisst dich nur nicht mehr auf. Du nimmst weiterhin wahr, was schiefläuft, aber du trägst es nicht mehr allein auf deinen Schultern. Du hast gelernt, deine Energie dorthin zu lenken, wo sie tatsächlich ankommt, statt sie über alles Ungerechte dieser Welt zu verteilen.",
      "Und plötzlich wirkst du. Du bist nicht mehr der Mensch, der frustriert am Rand steht und weiß, wie es besser ginge. Du bist der, der es vormacht. Dein eigenes Leben wird zum ersten Beweis, dass es geht. Menschen spüren das und folgen dir, weil du strahlst statt zu kämpfen. Und dabei fühlst du dich zum ersten Mal seit Langem nicht schuldig, wenn es dir gut geht.",
      "Das ist keine Fantasie, du bist näher dran, als du glaubst. Dein Herz war nie das Problem, es ist dein Antrieb. Für andere machst du längst Dinge möglich, die niemand sonst anpackt. Wenn du das kannst: Warum tust du es nicht auch für dich?",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar. Kein zweiter Archetyp mischt sich merklich ein, du bist der Idealist in Reinform. Dein Wertekompass bestimmt dich ohne Gegengewicht. Das ist eine seltene Kraft und zugleich der Grund, warum du dich selbst so leicht aus dem Blick verlierst.",
  },
  suchender: {
    name: "Der Suchende", dativ: "Suchenden", avatar: "/images/Archetypen-Suchende.png",
    tagline: "Deine Neugier ist ein Geschenk - nur suchst du im Außen, was längst in dir liegt.",
    wahrheit: [
      "Du gibst dich nicht mit der Oberfläche zufrieden. Dein Wissensdurst, deine Offenheit, dein Gespür dafür, wenn etwas nicht stimmt, das ist ein echtes Talent. Die meisten stellen die Fragen gar nicht erst, die du dir längst stellst.",
      "Nur: Zufrieden macht es dich nicht. Du hast schon vieles probiert, Bücher, Podcasts, Methoden, Ansätze. Manches hat kurz resoniert, aber nichts hat wirklich gehalten. Das liegt nicht daran, dass du sprunghaft bist. Es liegt daran, dass die Antwort, die du im nächsten Impuls suchst, dort gar nicht warten kann.",
    ],
    falle: "Du verwechselst Bewegung mit Fortschritt. Es liegt nicht an den Methoden. Es liegt daran, dass du nie lange genug an einer Stelle gräbst, um auf Gold zu stoßen. Es gibt hierfür eine Lösung, doch sie liegt nicht im Außen, sondern in dir.",
    potenzial: [
      "Stell dir einen Suchenden vor, der aufgehört hat zu suchen. Kein Aufgeben, keine Resignation. Er ist angekommen.",
      "Deine Neugier ist dann keine Fluchtbewegung mehr, sondern echte Vertiefung. Du liest und lernst immer noch, aber nicht mehr auf der Jagd nach dem einen fehlenden Teil. Du tust es, weil es dich nährt. Das eine ist ein Loch, das du zu stopfen versuchst. Das andere ist ein Garten, den du pflegst.",
      "Du triffst Entscheidungen, ohne vorher fünf Podcasts zu hören. Du weißt zwar nicht plötzlich alles, aber du traust deiner eigenen inneren Stimme wieder. Der, die du gerade noch mit dem nächsten Impuls übertönst. Die Ruhelosigkeit, dieses „irgendwas fehlt noch“, wird leiser. An ihre Stelle tritt etwas Unspektakuläres, aber Seltenes: das Gefühl, am richtigen Ort zu sein.",
      "Das ist keine Fantasie, du bist näher dran, als du glaubst. Alles, was du brauchst, hast du längst gesammelt. Und trotzdem suchst du weiter. Wenn es doch schon in dir liegt: Worauf genau wartest du eigentlich noch?",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar. Kein zweiter Archetyp mischt sich merklich ein, du bist der Suchende in Reinform. Deine Suche hat keinen inneren Gegenpol, der sie mal zur Ruhe bringt. Das erklärt, warum sie sich so endlos anfühlt, und warum der Ausstieg für dich umso mehr verändert.",
  },
  klarsichtiger: {
    name: "Der Klarsichtige", dativ: "Klarsichtigen", avatar: "/images/Archetypen-Klarsichtiger.png",
    tagline: "Du bist weiter als die meisten - und genau das ist dein blinder Fleck.",
    wahrheit: [
      "Machen wir uns nichts vor: Du hast an dir gearbeitet wie kaum jemand. Du reflektierst, du führst dich selbst, du kommst ins Handeln, und du erkennst Muster, bei dir und bei anderen, mit einer Klarheit, die beeindruckend ist. Du bist bereits weiter gekommen, als die meisten je werden.",
      "Und genau da liegt die versteckte Gefahr. Denn wer viel verstanden hat, hört irgendwann auf, sich zu hinterfragen: „das ist mir schon bewusst“. Zwischen Klarsehen und konsequent-danach-leben bleibt eine letzte Lücke. Klein, aber hartnäckig.",
    ],
    falle: "Klarsehen fühlt sich für dich an wie Ankommen. Zu wissen, wie es geht, ist nicht dasselbe, wie es zu leben, und die letzten Meter gehen die wenigsten, gerade weil sie sich schon am Ziel wähnen.",
    potenzial: [
      "Stell dir einen Klarsichtigen vor, der das, was er längst versteht, jeden einzelnen Tag auch lebt.",
      "Es sieht von außen unspektakulär aus. Keine Erleuchtung, kein großer Umbruch. Nur eine stille Konsequenz, die vorher nicht da war. Du weißt weiterhin genau, wie es ginge, aber du tust es jetzt auch dann, wenn niemand hinschaut und wenn es unbequem wird.",
      "Und diese kleine Verschiebung verändert alles. Die letzten Prozent, die dich immer genagt haben, hören auf zu nagen. Dieses leise Wissen, dass du hinter deinen eigenen Möglichkeiten zurückbleibst, verschwindet. An seine Stelle tritt etwas, das kaum jemand kennt: die Ruhe eines Menschen, bei dem Erkenntnis und Alltag dasselbe geworden sind. Du erklärst anderen nicht mehr ihre Muster. Du lebst deins einfach.",
      "Das ist keine Fantasie, du bist näher dran als fast alle anderen. Dir fehlt kein Wissen mehr, du weißt genug für zwei Leben. Und genau deshalb ist die Frage so unangenehm: Wenn dir wirklich nur noch die letzten Meter fehlen, warum gehst du sie dann nicht?",
    ],
    reintyp: "Dein Ergebnis ist ungewöhnlich klar, was bei deinem Typ fast schon poetisch ist. Kein zweiter Archetyp mischt sich merklich ein, du bist der Klarsichtige in Reinform. Deine Klarheit ist ungetrübt von anderen Mustern. Das bringt dich weit, und es macht den letzten blinden Fleck umso hartnäckiger, weil nichts ihn dir spiegelt.",
  },
};

// ④ Mischtyp: 20 Kombinationen, Key = "haupttyp+zweittyp"
const MISCHTYP = {
  "zuschauer+getriebener": "Wahrscheinlich ist dein Kalender genauso voll wie dein Kopf. Du bist fast ständig in Bewegung und kommst selten zur Ruhe. Dein analytischer Zuschauer-Anteil erkennt bereits vieles, doch du bist „zu beschäftigt“, um auch wirklich aktiv in der Praxis Vorteile aus deinen theoretischen Erkenntnissen zu ziehen und mit ihnen zu arbeiten.",
  "zuschauer+idealist": "Du grübelst wahrscheinlich nicht nur über dich selbst, sondern auch über Dinge, die du nicht kontrollieren kannst. Die Welt, die Ungerechtigkeit, das große Ganze. Das eine füttert das andere. Und beides zusammen erzeugt eine Art Weltschmerz. Eine Art Lähmung. Und diese macht es dir schwerer, überhaupt bei dir selbst anzufangen.",
  "zuschauer+suchender": "Statt ins Handeln zu kommen, suchst du vermutlich eher weiter: das nächste Buch, den nächsten Podcast, die nächste Erkenntnis. Du hoffst, dass irgendwann der entscheidende Impuls kommt. Aber vielleicht ist mehr Wissen gar nicht die Lösung, sondern der Moment, in dem du mit dem anfängst, was du schon weißt.",
  "zuschauer+klarsichtiger": "Du bist wahrscheinlich näher dran, als du denkst. Dein Verständnis für dich selbst ist weiter als bei den meisten. Aber vielleicht kennst du das: Zwischen „Ich könnte“ und „Ich tue es“ liegt bei dir noch eine Lücke, die du lieber nicht zu genau anschaust.",
  "getriebener+zuschauer": "Vielleicht kennst du das: In ruhigen Momenten taucht ein subtiles Gefühl auf, dass hinter deinem hohen Pensum etwas wartet, dem du dich nicht so gerne stellst. Und statt hinzuschauen, drehst du die Geschwindigkeit meist dann doch wieder hoch. Dein analytischer Verstand erkennt das vermutlich sogar. Aber das Erkennen allein ändert noch nichts.",
  "getriebener+idealist": "Du gibst wahrscheinlich viel Energie für andere und für eine „gute Sache“, während deine eigenen Bedürfnisse oft hinten anstehen. Vielleicht tust du sie sogar als egoistisch ab. Du funktionierst und kämpfst gleichzeitig und wunderst dich manchmal, warum du dich trotzdem noch nicht angekommen oder erfüllt fühlst.",
  "getriebener+suchender": "Du gibst Vollgas und bist irgendwie auch stolz drauf. Doch dann kommen, nicht ständig, doch immer wieder, Zweifel ob du eigentlich in die richtige Richtung rennst. Mal funktionierst du wie eine Maschine, dann fragst du dich plötzlich: „Wofür eigentlich?“ Aber bevor du wirklich auf die Suche nach der Antwort gehst, stürzt du dich schon in den nächsten Sprint.",
  "getriebener+klarsichtiger": "Entweder du bist bereits voll im Selbstoptimierungswahn, denn du siehst deine Potenziale und Schwächen genau so klar wie die anderer, oder du nutzt dieses Wissen durch Selbstreflektion manchmal, um dein Funktionieren zu rechtfertigen. „Ich weiß ja, warum ich so bin.“ Und dann machst du so weiter. Nicht blind für deine Muster, aber ziemlich gut darin, sie zu rationalisieren und dir selbst vorzumachen, weshalb die wirklich unangenehme Veränderung gerade nicht nötig ist.",
  "idealist+zuschauer": "Vielleicht merkst du, dass sich dein Weltschmerz manchmal mit Selbstanalyse vermischt. Du wünschst dir tief in deinem Inneren eine utopische Optimallösung für die Welt, doch erkennst in deinem Leben, aber auch in deinem Umfeld zu viel, das diesem Wunsch entgegenwirkt. Das führt zu Frustration und Lähmung. Du verurteilst dich selbst, Teil des Problems zu sein, doch es fühlt sich an, als wären dir die Hände gebunden dein Leben entsprechend zu verändern.",
  "idealist+getriebener": "Dein Idealismus gibt dir vermutlich eine Richtung. Einen moralischen Kompass. Dein Getriebener-Anteil gibt dir zusätzlich Antrieb. Das kann produktiv sein. Aber vielleicht verwechselst du manchmal Aktivismus mit echtem Fortschritt und bist so beschäftigt, gegen das Falsche zu kämpfen, dass für den Aufbau von etwas Eigenem wenig Raum und Energie bleibt. Vielleicht lohnt es sich ja mehr, langfristig zu denken und zu handeln, um am Ende wahre Veränderung zu bewirken. Verbrenne dich nicht selbst im Namen der Sache, die Welt braucht Menschen wie dich.",
  "idealist+suchender": "Du suchst nicht nur nach Möglichkeiten die Welt besser zu machen, sondern auch nach der richtigen Richtung für dich. Du willst ein guter Mensch sein. Ein hoher Anspruch. Und vielleicht führt genau das dazu, dass nichts wirklich genügt. Jede Methode, jeder Ansatz fällt irgendwann durch dein Raster. Vielleicht liegt es nicht am Raster der Welt, sondern daran, dass deins etwas zu eng ist. Zu eng dir auch mal selbst zu verzeihen. Zu eng, auch mal die 80-20-Lösung als Erfolg zu sehen. Manchmal ist auch kleiner Fortschritt besser als eine theoretische Optimallösung, die nie Realität wird.",
  "idealist+klarsichtiger": "Du hast echte Reflexionsfähigkeit und einen klaren Blick auf vieles. Aber vielleicht ist für deinen Idealisten-Anteil diese Klarheit eher Treibstoff für Frustration statt für Veränderung. Du erkennst ziemlich scharf, was falsch läuft, und vergisst dabei manchmal, dass Klarheit ohne Selbstfürsorge auf Dauer nicht trägt.",
  "suchender+zuschauer": "Vielleicht kennst du das: Du merkst, dass du springst, und du ahnst sogar warum. Aber dieses Meta-Wissen hilft dir nicht unbedingt, es zu ändern. Im Gegenteil: Es gibt dir das Gefühl von Neugier, Horizont-Erweitern und Fortschritt. Doch in Wahrheit drehst du dich im Kreis, da du nicht wirklich weißt, wohin es für dich gehen soll.",
  "suchender+getriebener": "Während andere Suchende eher grübeln, springst du vermutlich immer wieder zum nächsten Ding. Neues Projekt, neues Hobby, neuer Ansatz. Von außen sieht das nach Energie, Neugier, Entwicklung aus. Doch wenn du mal genau hinschaust, fühlt es sich vielleicht eher an, als würdest du vor etwas davonlaufen, das dich einholt, sobald du stehen bleibst. Ein Zeichen, weniger im Außen nach neuen Wahrheiten zu suchen und stattdessen in dein Inneres zu schauen.",
  "suchender+idealist": "Du willst wahrscheinlich nicht nur dich selbst finden, sondern auch den Sinn im großen Ganzen. Klingt tiefgründig, fühlt sich aber für viele häufig schnell erschöpfend an. Vielleicht liegt es nicht am Raster der Welt, sondern daran, dass der Anspruch, beides gleichzeitig und optimal zu lösen, dich eher blockiert als beflügelt.",
  "suchender+klarsichtiger": "Vielleicht kennst du den Moment: Du bist einen Schritt weiter, und dann kommt die Frage: „Aber was, wenn das noch nicht das Richtige ist?“ Gesunde Neugier und Sprunghaftigkeit liegen manchmal nah beieinander. Vielleicht ist es manchmal besser erstmal bei Themen mit denen du in Resonanz gehst oder du profitierst zu bleiben und auf deine Entwicklung zu vertrauen, statt ständig in einer Art Selbstoptimierungswahn von einem zu nächsten zu springen.",
  "klarsichtiger+zuschauer": "Vielleicht genießt du die Erkenntnis manchmal fast zu sehr. Du durchschaust vieles, bei dir und bei anderen. Aber vielleicht nutzt du diese Klarheit gelegentlich als Ausrede zur Bequemlichkeit? Eine Ausrede, um nichts verändern zu müssen, weil „Ich hab's ja durchschaut“ sich anfühlt wie Fortschritt, es aber nicht immer ist.",
  "klarsichtiger+getriebener": "Du erkennst vieles und dazu gehört wahrscheinlich auch, wo du langsamer machen solltest. Aber dein innerer Getriebener kann das nicht so gut aushalten. Vielleicht reflektierst du abends, was du tagsüber eigentlich schon wusstest, und am nächsten Morgen funktionierst du trotzdem wieder gleich. Die Frage ist weniger, ob du es siehst. Sondern ob du es dir erlaubst, danach zu leben.",
  "klarsichtiger+idealist": "Statt dein Wissen für dein eigenes Leben zu nutzen, fließt deine Energie vielleicht oft eher in irgendeine Art der Kompensation deines Weltschmerzes. Vielleicht verstehst du nicht nur wie du, sondern auch die Welt tickt. Oder besser ticken sollte. Und diese Diskrepanz zwischen Wunschvorstellung und Realität frustriert dich. Verständlich. Als Klarsichtiger mit einem gut ausgerichteten Wertekompass bist du schon auf einem guten Weg, doch achte darauf, dich nicht zu sehr von deinem Wunsch nach einer Ideallösung ausbremsen zu lassen.",
  "klarsichtiger+suchender": "Vielleicht kennst du die Frage: „Was, wenn das noch nicht alles war?“ Das kann gesund sein, solange es nicht zur Dauerschleife wird. Es gibt viele interessante Theorien, hörenswerte Reden, lesenswerte Bücher. Doch verliere dich nicht in der Vielfalt deiner Möglichkeiten. Du lebst bereits reflektierter als die meisten, also lass deinen Erkenntnissen Taten folgen. Bringt die eine Richtung nach einem ordentlichen Stück auf diesem Weg noch keinen Erfolg, kannst du ihn immer noch jederzeit wechseln.",
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

function decodeToken(raw) {
  if (!raw) return null;
  try {
    const p = JSON.parse(base64UrlToUtf8(raw));
    const primaryKey = ARCHETYPE_ORDER[p.p];
    if (!primaryKey || !ARCHETYPES[primaryKey]) return null;
    if (!Array.isArray(p.d) || p.d.length !== CORE_SCALES.length) return null;
    if (!Array.isArray(p.st) || !Array.isArray(p.pt)) return null;
    const secondaryKey = p.s >= 0 ? ARCHETYPE_ORDER[p.s] : null;
    return {
      name: (p.n || "").trim(),
      primaryKey,
      secondaryKey,
      isReintyp: p.r === 1,
      date: p.t || "",
      values: CORE_SCALES.reduce((acc, k, i) => { acc[k] = p.d[i]; return acc; }, {}),
      strengths: p.st.filter((k) => DIMENSIONS[k]),
      potentials: p.pt.filter((k) => DIMENSIONS[k]),
    };
  } catch {
    return null;
  }
}

const strengthScore = (key, val) => (DIMENSIONS[key].positive ? val : 100 - val);

function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}

/* ─── RADAR (SVG, handgezeichnet, animiert) ─────────────────────────────── */
function Radar({ values, ideal }) {
  const size = 340, c = size / 2, maxR = 128;
  const n = CORE_SCALES.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i, v) => {
    const r = (Math.max(0, Math.min(100, v)) / 100) * maxR;
    return [c + r * Math.cos(angle(i)), c + r * Math.sin(angle(i))];
  };
  const poly = (obj) => CORE_SCALES.map((k, i) => point(i, obj[k]).join(",")).join(" ");
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg className="erg-radar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Dein Profil im Vergleich zum Idealprofil deines Archetyps">
      {rings.map((f, i) => (
        <polygon key={i} className="erg-radar-ring"
          points={CORE_SCALES.map((_, idx) => [c + maxR * f * Math.cos(angle(idx)), c + maxR * f * Math.sin(angle(idx))].join(",")).join(" ")} />
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
          return <circle key={k} className="erg-radar-dot" cx={x} cy={y} r="4.5" />;
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
.erg-portrait{width:96px;height:96px;border-radius:50%;object-fit:cover;display:block;margin:0 auto 1.1rem;box-shadow:0 8px 22px -12px rgba(28,28,28,.4);}
.erg-signature{font-family:'Caveat',cursive;font-size:1.7rem;color:var(--orange);line-height:1;margin-top:.4rem;}

/* Falle */
.erg-falle{margin-top:16px;background:rgba(255,77,0,.06);border-left:4px solid var(--orange);border-radius:14px;padding:18px 22px;}
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
.erg-radar-userwrap{opacity:0;transform:scale(.4);transform-box:view-box;transform-origin:170px 170px;transition:opacity .7s ease,transform .9s cubic-bezier(.2,.8,.2,1);}
.erg-reveal.in .erg-radar-userwrap{opacity:1;transform:scale(1);}
.erg-radar-label{font-size:9.5px;font-weight:600;fill:var(--soft);font-family:'Inter Tight',sans-serif;}
.erg-radar-legend{display:flex;gap:1.4rem;margin-top:1rem;font-size:.78rem;color:var(--soft);flex-wrap:wrap;justify-content:center;}
.erg-radar-legend span{display:inline-flex;align-items:center;gap:.4rem;}
.erg-radar-legend i{width:16px;height:0;border-top-width:3px;border-top-style:solid;display:inline-block;}
.erg-intro-line{margin-top:1.4rem;font-weight:600;color:var(--ink);font-size:1.02rem;}

/* Dimensions-Items */
.erg-dim-group{margin-top:1.2rem;}
.erg-dim-group h3{font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;font-weight:800;margin:0 0 .9rem;}
.erg-dim-group.staerken h3{color:var(--orange);}
.erg-dim-group.potenziale h3{color:var(--soft);}
.erg-dim{padding:16px 0;border-top:1px solid rgba(175,167,157,.28);}
.erg-dim:first-of-type{border-top:none;padding-top:.2rem;}
.erg-dim-head{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;margin-bottom:.5rem;}
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

@media (prefers-reduced-motion: reduce){
  .erg-reveal,.erg-bar-fill,.erg-radar-userwrap{transition:none !important;}
  .erg-reveal{opacity:1;transform:none;}
}
`;

/* ─── HAUPTKOMPONENTE ──────────────────────────────────────────────────── */
export default function DeinErgebnis() {
  const data = useMemo(() => {
    const raw = new URLSearchParams(window.location.search).get("d");
    return decodeToken(raw);
  }, []);

  const rootRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  // Titel + Scroll steuert zentral App.jsx (Seo() + ScrollToTop) - hier bewusst nicht.
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

  async function copyLink() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    catch { /* stille Fehlbehandlung */ }
  }
  async function shareLink() {
    try { await navigator.share({ title: "Mein Ergebnis im Unfuck-Typentest", url }); } catch { /* abgebrochen */ }
  }

  if (!data) {
    return (
      <div className="erg-root">
        <style>{STYLES}</style>
        <div className="erg-fallback">
          <h1>Dieser Link ist unvollständig.</h1>
          <p>Wir konnten dein Ergebnis nicht laden. Am sichersten öffnest du den Link direkt aus deiner Ergebnis-Mail - dort steht er vollständig. Prüf zur Not auch den Werbe- oder Spam-Ordner.</p>
        </div>
      </div>
    );
  }

  const meta = ARCHETYPES[data.primaryKey];
  const ideal = TYPE_PROFILES[data.primaryKey];
  const secMeta = data.secondaryKey ? ARCHETYPES[data.secondaryKey] : null;
  const showMischtyp = !data.isReintyp && secMeta && MISCHTYP[`${data.primaryKey}+${data.secondaryKey}`];
  const dateStr = formatDate(data.date);

  return (
    <div className="erg-root" ref={rootRef}>
      <style>{STYLES}</style>
      <div className="erg-wrap">

        {/* ① KOPF */}
        <header className="erg-card erg-header erg-reveal">
          <img className="erg-avatar" src={meta.avatar} alt={meta.name}
               onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div className="erg-eyebrow" style={{ justifyContent: "center" }}><span className="num">①</span> Dein Ergebnis</div>
          <div className="erg-type">{meta.name}</div>
          <div className="erg-tagline">{meta.tagline}</div>
          {data.name && <div className="erg-greeting">Hi {data.name}, schön dass du da bist.</div>}
          {dateStr && <div className="erg-meta">Test vom {dateStr}</div>}
        </header>

        {/* Link speichern */}
        <div className="erg-save erg-reveal">
          <div className="erg-save-row">
            <button className="erg-btn erg-btn-primary" onClick={copyLink}>
              {copied ? "Kopiert ✓" : "Link kopieren"}
            </button>
            {canShare && (
              <button className="erg-btn erg-btn-ghost" onClick={shareLink}>Teilen</button>
            )}
          </div>
          <p className={copied ? "hint copied" : "hint"}>
            {copied ? "Link liegt in deiner Zwischenablage." : "Speicher dir diesen Link - du findest ihn auch in deiner E-Mail."}
          </p>
        </div>

        {/* VORWORT */}
        <section className="erg-section erg-reveal">
          <div className="erg-card erg-vorwort">
            <img className="erg-portrait" src="/images/portrait-round.png" alt="Florian Lingner"
                 onError={(e) => { e.currentTarget.style.display = "none"; }} />
            {VORWORT.map((t, i) => <p key={i}>{t}</p>)}
            <div className="erg-signature">Florian</div>
          </div>
        </section>

        {/* ② UNBEQUEME WAHRHEIT */}
        <section className="erg-section erg-reveal">
          <div className="erg-eyebrow"><span className="num">②</span> Die unbequeme Wahrheit</div>
          <h2>Was dich ausbremst</h2>
          <div className="erg-card">
            {meta.wahrheit.map((t, i) => <p key={i}>{t}</p>)}
            <div className="erg-falle">
              <div className="lbl">⚠ Deine Falle</div>
              <p>{meta.falle}</p>
            </div>
          </div>
        </section>

        {/* ③ AUFFÄLLIG: Radar + Top-3 */}
        <section className="erg-section erg-reveal">
          <div className="erg-eyebrow"><span className="num">③</span> Das ist bei dir besonders auffällig</div>
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
              {data.strengths.map((k) => {
                const fill = strengthScore(k, data.values[k]);
                return (
                  <div className="erg-dim s" key={k}>
                    <div className="erg-dim-head"><span className="erg-dim-name">{DIMENSIONS[k].name}</span></div>
                    <div className="erg-bar"><div className="erg-bar-fill" style={{ "--w": `${fill}%` }} /></div>
                    <p>{DIMENSIONS[k].staerke}</p>
                  </div>
                );
              })}
            </div>

            <div className="erg-dim-group potenziale">
              <h3>Deine 3 größten unausgeschöpften Potenziale</h3>
              {data.potentials.map((k) => {
                const fill = 100 - strengthScore(k, data.values[k]);
                return (
                  <div className="erg-dim p" key={k}>
                    <div className="erg-dim-head"><span className="erg-dim-name">{DIMENSIONS[k].name}</span></div>
                    <div className="erg-bar"><div className="erg-bar-fill" style={{ "--w": `${fill}%` }} /></div>
                    <p>{DIMENSIONS[k].potenzial}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ④ MISCHTYP oder REINTYP */}
        <section className="erg-section erg-reveal">
          {data.isReintyp || !showMischtyp ? (
            <>
              <div className="erg-eyebrow"><span className="num">④</span> Dein Profil ist eindeutig</div>
              <h2>Ein klarer Fall</h2>
              <div className="erg-card"><p>{meta.reintyp}</p></div>
            </>
          ) : (
            <>
              <div className="erg-eyebrow"><span className="num">④</span> Dein zweiter Anteil</div>
              <h2>Was noch in dir steckt</h2>
              <div className="erg-card">
                <div className="erg-second">
                  <img src={secMeta.avatar} alt={secMeta.name}
                       onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <div>
                    <div className="lbl">Dein Zweitanteil</div>
                    <div className="nm">{secMeta.name}</div>
                  </div>
                </div>
                <p>{MISCHTYP[`${data.primaryKey}+${data.secondaryKey}`]}</p>
              </div>
            </>
          )}
        </section>

        {/* ⑤ SO KÖNNTE DEIN LEBEN AUSSEHEN */}
        <section className="erg-section erg-reveal">
          <div className="erg-eyebrow"><span className="num">⑤</span> So könnte dein Leben aussehen</div>
          <h2>Deine Potenzial-Analyse</h2>
          <div className="erg-card">
            {meta.potenzial.map((t, i) => <p key={i}>{t}</p>)}
          </div>
        </section>

        {/* ⑥ WIE ES WEITERGEHT */}
        <section className="erg-section erg-reveal">
          <div className="erg-card erg-cta">
            <div className="erg-eyebrow"><span className="num">⑥</span> Wie es weitergeht</div>
            <p>In den nächsten Wochen wird intensiv an einer Masterclass exklusiv für deinen Archetyp gearbeitet. Sobald diese online geht, wirst du selbstverständlich benachrichtigt.</p>
          </div>
        </section>

        {/* Link speichern (unten nochmal) */}
        <div className="erg-save erg-reveal">
          <div className="erg-save-row">
            <button className="erg-btn erg-btn-primary" onClick={copyLink}>
              {copied ? "Kopiert ✓" : "Link kopieren"}
            </button>
            {canShare && (
              <button className="erg-btn erg-btn-ghost" onClick={shareLink}>Teilen</button>
            )}
          </div>
          <p className={copied ? "hint copied" : "hint"}>
            {copied ? "Link liegt in deiner Zwischenablage." : "Diesen Link findest du jederzeit in deiner E-Mail wieder."}
          </p>
        </div>

      </div>
    </div>
  );
}
