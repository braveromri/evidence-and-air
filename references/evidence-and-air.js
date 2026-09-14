/**
 * Evidence & Air — slide primitives for pptxgenjs.  v2
 *
 * Created by Dr. Omri Braver — github.com/braveromri
 * Licensed CC BY 4.0. See LICENSE.
 *
 * Note: nothing here stamps the author onto a generated deck. `deck()` takes the
 * presenting user's own title/author, and no primitive writes a credit line or a
 * watermark onto a slide. That is deliberate — keep it that way.
 *
 * The visual system in `style-guide.md`, implemented. Build decks by composing these
 * rather than hand-rolling text boxes: the readout strip, the eyebrow, the numeral scale
 * and the citation placement are the whole style, and they only work if they are
 * identical on every slide.
 *
 * WHAT v2 ADDS, AND WHY
 * ---------------------
 * v1 only printed console warnings, had no right-to-left support, and rendered a dashed
 * "VISUAL" placeholder where a graphic belonged. Real decks built with it ignored the
 * warnings, hand-rolled 10pt text cards, and shipped Hebrew with broken punctuation.
 * v2 therefore:
 *   - mirrors every layout for RTL languages (`deck({ rtl: true, lang: 'he-IL' })`)
 *     and picks fonts that carry Hebrew/Arabic glyphs on both Mac and Windows;
 *   - ships real visual primitives (monitor, shift, steps, tiles, chart, ECG trace,
 *     icons, station tracker) so there is no reason to hand-roll a slide;
 *   - AUDITS THE WRITTEN FILE at `save()` — font floor, words on screen, RTL paragraphs,
 *     notes present, notes within the time budget — and refuses to write a failing deck
 *     unless `strict: false`. Hand-rolled slides are caught too, because the audit reads
 *     the file, not the calls;
 *   - adds Morph transitions (PowerPoint 2019+/365, Mac and Windows) with a fade fallback.
 *
 * pptxgenjs is preinstalled where the bundled `pptx` skill runs. Anywhere else:
 *   npm install pptxgenjs jszip          (icons: npm install react-icons react react-dom sharp)
 *
 * API
 * ---
 *   const EA = require('./evidence-and-air');
 *   const pres = EA.deck({ title, author, rtl: false, lang: 'en-US', minutes: 20 });
 *
 *   EA.titleSlide(pres,   { eyebrow, title, subtitle, presenter, readout, notes, visual })
 *   EA.inkBeat(pres,      { eyebrow, line, attribution, readout, notes, visual })
 *   EA.paperStat(pres,    { eyebrow, numeral, label, detail, icon, readout, citation, notes })
 *   EA.paperShift(pres,   { eyebrow, title, from:{value,label}, to:{value,label}, readout, citation, notes })
 *   EA.paperContent(pres, { eyebrow, title, bullets, visual:(slide, box)=>{}, readout, citation, notes })
 *   EA.paperCompare(pres, { eyebrow, title, left, right, recommend, readout, citation, notes })
 *   EA.tiles(pres,        { eyebrow, title, tiles:[{icon, head, value, sub, hot}], ground, readout, citation, notes })
 *   EA.steps(pres,        { eyebrow, title, steps:[{label, sub, hot}], layout:'ladder'|'chain', readout, citation, notes })
 *   EA.chartSlide(pres,   { eyebrow, title, type, data, chartOptions, takeaway, overlay, readout, citation, notes })
 *   EA.monitor(pres,      { eyebrow, line, sub, vitals:[{label, value, unit, alarm}], rhythm:'sinus'|'af', fluids:{value, max, label, alarm}, readout, notes })
 *   EA.referencesSlide(pres, { eyebrow, refs, notes })
 *
 *   Every slide type also takes: `station: [current, total]` (wayfinding dots, Morph-stable),
 *   `appendix: true` (backup slide: relaxed on-screen word cap, excluded from the notes budget).
 *
 *   Low-level, for use inside a `visual` / `overlay` callback:
 *   EA.text(pres, slide, text, opts)   EA.box(pres, slide, opts)   EA.ecg(pres, slide, opts)
 *   EA.icon(IconComponent, hexColor)   -> Promise<data string for addImage>
 *   EA.mx(pres, x, w)                  -> x mirrored for RTL
 *
 *   await EA.save(pres, 'Talk.pptx', { morph: true, strict: true });
 *   node evidence-and-air.js audit AnyDeck.pptx 20      (audit any deck, e.g. at Track B1)
 *
 * Every slide takes `readout` — the strip text at the baseline. On a data slide that is
 * "N = 8,344  ·  HR 0.78 (95% CI 0.66-0.92)". On a narrative slide it is the source line.
 * It is never omitted. `notes` is the word-for-word spoken narrative for that slide.
 */

const pptxgen = require('pptxgenjs');

// ---------------------------------------------------------------- palette

const C = {
  ink:   '13192B',  // dark ground   — hook, beats, case moments, close
  ink2:  '1C2438',  // raised surface on ink (tiles)
  paper: 'FAFAF8',  // light ground  — data and content
  card:  'F1EFEA',  // raised surface on paper
  ember: 'C75B3E',  // the ONE accent
  steel: '5B6B85',  // eyebrows, secondary structure
  mist:  '8B9AB3',  // steel lifted for legibility on ink
  ivory: 'F2EFE9',  // text on ink
  ash:   '8D9099',  // citations, sub-labels, readout
  rule:  'D9D6CF',  // hairlines on paper
};

// Fonts. Georgia and Trebuchet carry no Hebrew or Arabic glyphs, so an RTL deck set in
// them falls back to whatever the viewer's OS picks. Arial and Times New Roman carry
// Hebrew and Arabic on every Mac and Windows install — the only safe pair.
const FONTS_LTR = { sans: 'Calibri', label: 'Trebuchet MS', serif: 'Georgia', italicBeats: true };
// Times New Roman Hebrew reads as a 2005 Word document to an Israeli audience — beats stay in Arial.
const FONTS_RTL = { sans: 'Arial',   label: 'Arial',        serif: 'Arial', italicBeats: false };

const SW = 13.333;   // LAYOUT_WIDE
const G = {
  left:       0.9,
  right:      0.9,
  width:      11.53,  // 13.33 - left - right
  eyebrowY:   0.5,
  bodyTop:    1.55,
  stripY:     6.62,   // the rule
  stripTextY: 6.74,   // the text under it
};

// Audit thresholds.
const AUDIT = {
  minPt: 12,            // nothing on a slide below this, readout included
  maxWords: 40,         // on-screen words per slide, excluding eyebrow/readout/citation
  maxWordsAppendix: 90,
  maxTextBoxes: 22,     // more than this is a document, not a slide (composite visuals included)
  minNotesWords: 40,    // below this the notes are a cue, not a script
  wpm: 130,
};

// ---------------------------------------------------------------- internals

const ea = (pres) => pres._ea;
const HEB_OR_ARABIC = /[֐-׿؀-ۿ]/;

/** Mirror an x coordinate for RTL decks. Every primitive places through this. */
function mx(pres, x, w = 0) {
  return ea(pres).rtl ? SW - x - w : x;
}

/**
 * Text, the only way primitives write text. Sets RTL paragraphs, language, mirrored
 * position and alignment, isTextBox and zero margin.
 *   dir: 'ltr'     keep a Latin-only run (a statistic, a trial name) LTR inside an RTL deck
 *   noMirror: true x and align are physical, not logical
 *   role           names the box for the audit (readout/cite/eyebrow/refs are word-exempt)
 */
function text(pres, slide, content, o = {}) {
  const S = ea(pres);
  const rtl = o.dir ? o.dir === 'rtl' : S.rtl;
  let align = o.align || 'left';
  if (S.rtl && !o.noMirror) align = align === 'left' ? 'right' : align === 'right' ? 'left' : align;
  const opts = {
    fontFace: S.fonts.sans, color: C.ink, margin: 0, valign: 'top',
    ...o,
    x: o.noMirror ? o.x : mx(pres, o.x, o.w),
    align, isTextBox: true, rtlMode: rtl, lang: rtl ? S.lang : 'en-US',
  };
  if (S.rtl) delete opts.charSpacing;        // never letter-space Hebrew or Arabic
  if (!S.fonts.italicBeats && opts.italic) delete opts.italic;  // no slanted Hebrew
  ['dir', 'role', 'noMirror'].forEach((k) => delete opts[k]);
  if (!opts.objectName) opts.objectName = `ea-${o.role || 'text'}-${S.seq++}`;
  slide.addText(content, opts);
}

/** A shape, mirrored unless noMirror. `o.shape` defaults to rect. */
function box(pres, slide, o = {}) {
  const { shape = 'rect', noMirror, ...rest } = o;
  slide.addShape(shape, { ...rest, x: noMirror ? o.x : mx(pres, o.x, o.w) });
}

/** Eyebrow label, top-start. Wayfinding. On every slide. */
function eyebrow(pres, slide, str, onDark) {
  if (!str) return;
  const S = ea(pres);
  text(pres, slide, S.rtl ? String(str) : String(str).toUpperCase(), {
    x: G.left, y: G.eyebrowY, w: G.width * 0.72, h: 0.34,
    fontFace: S.fonts.label, fontSize: S.rtl ? 15 : 12, bold: true, charSpacing: 2.5,
    color: onDark ? C.mist : C.steel, role: 'eyebrow',
  });
}

/** Station tracker: dots at top-end, in reading order. Current station in Ember. */
function stationDots(pres, slide, station, onDark) {
  if (!station) return;
  const [cur, total] = station;
  const d = 0.17, gap = 0.15;
  const totalW = total * d + (total - 1) * gap;
  for (let i = 0; i < total; i++) {
    const active = i + 1 === cur;
    const col = active ? C.ember : (onDark ? '3A4460' : C.rule);
    slide.addShape('ellipse', {
      x: mx(pres, G.left + G.width - totalW + i * (d + gap), d), y: G.eyebrowY + 0.08, w: d, h: d,
      fill: { color: col }, line: { color: col, width: 0.5 }, objectName: `!!ea-station-${i}`,
    });
  }
}

/**
 * The readout strip: one thin rule at a constant baseline, with muted text beneath it.
 * This is the motif. It appears on every slide without exception.
 */
function readoutStrip(pres, slide, str, onDark) {
  const S = ea(pres);
  slide.addShape('line', {
    x: G.left, y: G.stripY, w: G.width, h: 0,
    line: { color: onDark ? '3A4460' : C.rule, width: 0.75 },
    objectName: '!!ea-strip',
  });
  if (str) {
    text(pres, slide, S.rtl ? String(str) : String(str).toUpperCase(), {
      x: G.left, y: G.stripTextY, w: G.width * 0.66, h: 0.36,
      fontFace: S.fonts.label, fontSize: 13, charSpacing: 1.5,
      color: onDark ? C.mist : C.ash, role: 'readout',
    });
  }
}

/** Citation, bottom-end. Never collides with the readout text. */
function citation(pres, slide, str, onDark) {
  if (!str) return;
  text(pres, slide, String(str), {
    x: G.left + G.width * 0.68, y: G.stripTextY, w: G.width * 0.32, h: 0.36,
    fontSize: 12, italic: true, color: onDark ? C.mist : C.ash,
    align: 'right', role: 'cite', dir: 'ltr',
  });
}

/** Common scaffold. Returns the slide with ground, eyebrow, station, strip and citation set. */
function base(pres, o) {
  const { ground, eyebrow: eb, readout, citation: cite, notes, station, appendix } = o;
  const onDark = ground === C.ink;
  const slide = pres.addSlide();
  slide.background = { color: ground };
  eyebrow(pres, slide, eb, onDark);
  stationDots(pres, slide, station, onDark);
  readoutStrip(pres, slide, readout, onDark);
  citation(pres, slide, cite, onDark);
  if (notes) slide.addNotes(String(notes));   // notes part, never a text box
  ea(pres).meta.push({ appendix: !!appendix, readout: !!readout });
  return slide;
}

// Words only: separators like "·", "—", "→" are not words and must not eat the budget.
function wordCount(s) { return String(s).trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length; }

function checkBullets(pres, where, bullets, max = 6, maxItems = 4) {
  const S = ea(pres);
  bullets.forEach((b) => {
    if (wordCount(b) > max) S.issues.push(`${where}: >${max} words on screen — ${JSON.stringify(b)}`);
  });
  if (bullets.length > maxItems) S.issues.push(`${where}: ${bullets.length} items — max ${maxItems}`);
}

const title40 = (pres, slide, str, dark) => text(pres, slide, str, {
  x: G.left, y: 1.1, w: G.width, h: 1.05, fontSize: 40, bold: ea(pres).rtl,
  color: dark ? C.ivory : C.ink, valign: 'middle', role: 'title',
});

// ---------------------------------------------------------------- deck

/** One `new pptxgen()` per output file — never reuse an instance. */
function deck({ title, author, subject, rtl = false, lang, minutes } = {}) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';       // MUST be set before any slide is added. 13.33 x 7.5in
  if (title)   pres.title   = title;
  if (author)  pres.author  = author;
  if (subject) pres.subject = subject;
  if (rtl) pres.rtlMode = true;
  pres._ea = {
    rtl, lang: lang || (rtl ? 'he-IL' : 'en-US'), minutes,
    fonts: rtl ? FONTS_RTL : FONTS_LTR, issues: [], meta: [], seq: 1,
  };
  return pres;
}

// ---------------------------------------------------------------- slide types

/** Ink. Opening identity slide. Zero body text beyond title/subtitle/presenter. */
function titleSlide(pres, { eyebrow: eb, title, subtitle, presenter, readout, notes, visual }) {
  const S = ea(pres);
  const slide = base(pres, { ground: C.ink, eyebrow: eb, readout, notes });
  if (visual) visual(slide);
  text(pres, slide, title, {
    x: G.left, y: 1.9, w: G.width * 0.85, h: 1.9,
    fontSize: 66, bold: S.rtl, color: C.ivory, valign: 'bottom', role: 'title',
  });
  if (subtitle) {
    text(pres, slide, subtitle, {
      x: G.left, y: 3.95, w: G.width * 0.8, h: 1.0,
      fontFace: S.fonts.serif, fontSize: 30, italic: true, color: C.ember, role: 'subtitle',
    });
  }
  if (presenter) {
    text(pres, slide, presenter, {
      x: G.left, y: 5.2, w: G.width * 0.8, h: 0.45, fontSize: 18, color: C.mist, role: 'presenter',
    });
  }
  return slide;
}

/**
 * Ink + serif. The narrative beat: hook, a transition, the close.
 * One line, then silence. Never add an explanatory paragraph under it.
 */
function inkBeat(pres, { eyebrow: eb, line, attribution, readout, notes, station, visual, appendix }) {
  const S = ea(pres);
  const slide = base(pres, { ground: C.ink, eyebrow: eb, readout, notes, station, appendix });
  if (visual) visual(slide);
  if (wordCount(line) > 14) S.issues.push(`inkBeat: beat line is ${wordCount(line)} words — one line, then silence`);
  text(pres, slide, line, {
    x: G.left + 0.5, y: 1.75, w: G.width - 1.0, h: 2.9,
    fontFace: S.fonts.serif, fontSize: S.rtl ? 54 : 42, italic: true, color: C.ivory,
    align: 'center', valign: 'middle', lineSpacingMultiple: 1.1, role: 'beat',
  });
  if (attribution) {
    text(pres, slide, attribution, {
      x: G.left + 0.5, y: 4.85, w: G.width - 1.0, h: 0.5,
      fontFace: S.fonts.label, fontSize: 20, charSpacing: 2, color: C.ember,
      align: 'center', role: 'attribution',
    });
  }
  return slide;
}

/**
 * Paper + one huge numeral. The data slide.
 * `numeral` carries the weight through scale, not boldness.
 * `readout` must carry N and the effect estimate with CI.
 * `icon` (data string from EA.icon) is the graphic anchor; without it a thin Ember rule is drawn.
 */
function paperStat(pres, { eyebrow: eb, numeral, label, detail, icon, readout, citation: cite, notes, station, appendix }) {
  const slide = base(pres, { ground: C.paper, eyebrow: eb, readout, citation: cite, notes, station, appendix });
  if (detail) checkBullets(pres, 'paperStat detail', [].concat(detail), 8);

  text(pres, slide, String(numeral), {
    x: G.left, y: 1.3, w: G.width * 0.62, h: 2.7,
    fontSize: 150, color: C.ember, valign: 'bottom', dir: 'ltr', role: 'numeral',
    objectName: '!!ea-numeral',
  });
  if (label) {
    text(pres, slide, label, { x: G.left, y: 4.15, w: G.width * 0.58, h: 2.0, fontSize: 32, color: C.ink, role: 'label' });
  }
  const ax = G.left + G.width * 0.66;
  if (icon) {
    slide.addImage({ data: icon, x: mx(pres, ax, 1.0), y: 1.7, w: 1.0, h: 1.0 });
  } else {
    box(pres, slide, { x: ax, y: 1.9, w: 0.08, h: 2.6, fill: { color: C.ember }, line: { color: C.ember, width: 0 } });
  }
  if (detail) {
    text(pres, slide, [].concat(detail).map((d, i, a) => ({ text: String(d), options: { breakLine: i < a.length - 1 } })), {
      // without an icon the Ember rule sits at `ax`: the detail starts clear of it
      x: icon ? ax : ax + 0.4, y: icon ? 3.0 : 1.9, w: G.width * 0.34 - (icon ? 0 : 0.4), h: 3.2,
      fontSize: 24, color: C.steel, paraSpaceAfter: 14, lineSpacingMultiple: 1.05, role: 'detail',
    });
  }
  return slide;
}

/**
 * Paper. Two numerals and an arrow — the replacement for a two-bar chart, which is banned.
 * `from` is muted, `to` carries the accent. Use for before/after, control/exposed.
 */
function paperShift(pres, { eyebrow: eb, title, from, to, readout, citation: cite, notes, station, appendix }) {
  const S = ea(pres);
  const slide = base(pres, { ground: C.paper, eyebrow: eb, readout, citation: cite, notes, station, appendix });
  if (title) title40(pres, slide, title);
  const colW = 4.7;
  [[from, G.left, C.ash], [to, G.left + G.width - colW, C.ember]].forEach(([c, x, color]) => {
    text(pres, slide, String(c.value), { x, y: 2.4, w: colW, h: 2.3, fontSize: 132, color, align: 'center', valign: 'middle', dir: 'ltr', role: 'numeral' });
    text(pres, slide, c.label, { x, y: 4.8, w: colW, h: 1.4, fontSize: 26, color: C.ink, align: 'center', role: 'label' });
  });
  const ax = G.left + colW + 0.4, aw = G.width - 2 * colW - 0.8;
  slide.addShape(S.rtl ? 'leftArrow' : 'rightArrow', {
    x: mx(pres, ax, aw), y: 3.3, w: aw, h: 0.55, fill: { color: C.steel }, line: { color: C.steel, width: 0 },
  });
  return slide;
}

/**
 * Paper + title + up to 3-4 short bullets + a real visual.
 * `visual(slide, box)` draws the graphic inside `box` ({x,y,w,h}, logical coordinates —
 * draw through EA.text / EA.box, which mirror). A slide with no visual is an audit error:
 * v1 drew a placeholder here, and placeholders ship.
 */
function paperContent(pres, { eyebrow: eb, title, bullets = [], visual, readout, citation: cite, notes, station, appendix, ground = C.paper }) {
  const S = ea(pres);
  const dark = ground === C.ink;
  const slide = base(pres, { ground, eyebrow: eb, readout, citation: cite, notes, station, appendix });
  checkBullets(pres, `paperContent "${title}"`, bullets);
  if (!visual) S.issues.push(`paperContent "${title}": no visual — every content slide needs one`);

  title40(pres, slide, title, dark);
  if (bullets.length) {
    text(pres, slide, bullets.map((b, i) => ({
      text: String(b), options: { bullet: true, breakLine: i < bullets.length - 1 },
    })), {
      x: G.left, y: 2.45, w: G.width * 0.48, h: 3.9,
      fontSize: 28, color: dark ? C.ivory : C.ink, paraSpaceAfter: 20, role: 'body',
    });
  }
  if (visual) visual(slide, { x: G.left + G.width * 0.53, y: 2.35, w: G.width * 0.47, h: 4.0 });
  return slide;
}

/**
 * Paper. Two options side by side, as stat cards — the replacement for two-column bullets,
 * which are banned. Both headers in Steel: the accent goes on one side ONLY when that side
 * is explicitly the recommendation. `recommend: 'left' | 'right'` means first/second in
 * reading order, so it mirrors in RTL.
 */
function paperCompare(pres, { eyebrow: eb, title, left, right, recommend, readout, citation: cite, notes, station, appendix }) {
  const S = ea(pres);
  const slide = base(pres, { ground: C.paper, eyebrow: eb, readout, citation: cite, notes, station, appendix });
  if (title) title40(pres, slide, title);

  const cardW = (G.width - 0.5) / 2;
  [[left, 0, 'left'], [right, 1, 'right']].forEach(([col, i, side]) => {
    if (!col) return;
    const x = G.left + i * (cardW + 0.5);
    const accent = recommend === side;
    box(pres, slide, { shape: 'roundRect', x, y: 2.35, w: cardW, h: 4.0, rectRadius: 0.12, fill: { color: C.card }, line: { color: C.card, width: 0 } });
    if (col.icon) slide.addImage({ data: col.icon, x: mx(pres, x + 0.4, 0.8), y: 2.65, w: 0.8, h: 0.8 });
    text(pres, slide, String(col.heading || ''), {
      x: x + (col.icon ? 1.4 : 0.4), y: 2.72, w: cardW - 1.8, h: 0.66, valign: 'middle',
      fontFace: S.fonts.label, fontSize: 22, bold: true, charSpacing: 1.5, color: accent ? C.ember : C.steel, role: 'head',
    });
    text(pres, slide, String(col.value || ''), {
      x: x + 0.4, y: 3.6, w: cardW - 0.8, h: 1.35, fontSize: 40, bold: S.rtl, color: C.ink, valign: 'middle', role: 'value',
    });
    if (col.detail) {
      text(pres, slide, String(col.detail), { x: x + 0.4, y: 5.05, w: cardW - 0.8, h: 1.15, fontSize: 22, color: C.steel, role: 'detail' });
    }
  });
  return slide;
}

/**
 * Tiles: 3-5 across, each an icon + a short head + one big value + a sub-line.
 * The grid for "five targets", "four checks", a takeaway set. Works on Paper or Ink.
 */
function tiles(pres, { eyebrow: eb, title, tiles: items = [], ground = C.paper, readout, citation: cite, notes, station, appendix }) {
  const S = ea(pres);
  const dark = ground === C.ink;
  const slide = base(pres, { ground, eyebrow: eb, readout, citation: cite, notes, station, appendix });
  if (items.length > 5) S.issues.push(`tiles "${title}": ${items.length} tiles — max 5`);
  if (title) title40(pres, slide, title, dark);
  const n = items.length, gap = 0.28;
  const w = (G.width - gap * (n - 1)) / n;
  items.forEach((t, i) => {
    const x = G.left + i * (w + gap);
    box(pres, slide, { shape: 'roundRect', x, y: 2.4, w, h: 3.95, rectRadius: 0.1,
      fill: { color: dark ? C.ink2 : C.card }, line: { color: t.hot ? C.ember : (dark ? C.ink2 : C.card), width: t.hot ? 2.25 : 0 } });
    // Anchor: an icon, a kicker ("01", "Class I"), or nothing — in which case the text moves up.
    // Generic icon sets read as clip-art to a specialist audience; prefer a kicker or nothing.
    const up = t.icon || t.kicker ? 0 : -0.55;
    if (t.icon) slide.addImage({ data: t.icon, x: mx(pres, x + 0.3, 0.55), y: 2.65, w: 0.55, h: 0.55 });
    if (t.kicker) text(pres, slide, t.kicker, { x: x + 0.3, y: 2.62, w: w - 0.6, h: 0.6, fontSize: 26, color: C.ember, role: 'kicker', dir: 'ltr', align: 'right' });
    text(pres, slide, t.head, { x: x + 0.3, y: 3.35 + up, w: w - 0.6, h: 0.45, fontSize: 19, bold: true, color: dark ? C.mist : C.steel, role: 'head', dir: t.headDir });
    // value gets a fixed band and the sub is anchored to the tile bottom, so a wrapped value never runs into it
    const vpt = n >= 5 ? 24 : n === 4 ? 28 : 32;
    if (wordCount(t.value) > (n >= 5 ? 3 : 4)) S.issues.push(`tiles "${title}": tile value "${t.value}" too long for ${n} tiles`);
    text(pres, slide, t.value, { x: x + 0.3, y: 3.85 + up, w: w - 0.6, h: 1.55, fontSize: vpt, bold: S.rtl,
      color: t.hot ? C.ember : (dark ? C.ivory : C.ink), role: 'value', dir: t.dir });
    if (t.sub) text(pres, slide, t.sub, { x: x + 0.3, y: 5.45, w: w - 0.6, h: 0.75, fontSize: 17, valign: 'bottom', color: dark ? C.mist : C.steel, role: 'sub', dir: t.subDir });
  });
  return slide;
}

/**
 * Steps. A numbered sequence — an order of operations, a causal chain.
 * layout 'ladder' (vertical, up to 7) or 'chain' (horizontal, up to 5, arrows between).
 * Each step label max 5 words; `hot: true` puts the accent on the steps that carry the message.
 */
function steps(pres, { eyebrow: eb, title, steps: items = [], layout = 'ladder', ground = C.paper, readout, citation: cite, notes, station, appendix }) {
  const S = ea(pres);
  const dark = ground === C.ink;
  const slide = base(pres, { ground, eyebrow: eb, readout, citation: cite, notes, station, appendix });
  checkBullets(pres, `steps "${title}"`, items.map((s) => s.label), 5, layout === 'ladder' ? 7 : 5);
  if (title) title40(pres, slide, title, dark);
  const fg = dark ? C.ivory : C.ink;

  if (layout === 'ladder') {
    const top = 2.3, rowH = Math.min(0.68, 4.15 / items.length);
    items.forEach((s, i) => {
      const y = top + i * rowH;
      const d = rowH * 0.74;
      box(pres, slide, { shape: 'ellipse', x: G.left, y: y + (rowH - d) / 2, w: d, h: d,
        fill: { color: s.hot ? C.ember : (dark ? C.ink2 : C.card) }, line: { color: s.hot ? C.ember : C.steel, width: 1 } });
      text(pres, slide, String(i + 1), { x: G.left, y: y + (rowH - d) / 2, w: d, h: d, fontSize: 18, bold: true,
        color: s.hot ? C.ivory : C.steel, align: 'center', valign: 'middle', role: 'num', dir: 'ltr' });
      text(pres, slide, s.label, { x: G.left + d + 0.3, y, w: 5.0, h: rowH, fontSize: 26, bold: !!s.hot, color: s.hot ? C.ember : fg, valign: 'middle', role: 'step' });
      if (s.sub) text(pres, slide, s.sub, { x: G.left + d + 5.5, y, w: G.width - d - 5.5, h: rowH, fontSize: 19, color: dark ? C.mist : C.steel, valign: 'middle', role: 'sub' });
    });
  } else {
    const n = items.length, arrowW = 0.5;
    const w = (G.width - arrowW * (n - 1)) / n;
    items.forEach((s, i) => {
      const x = G.left + i * (w + arrowW);
      box(pres, slide, { shape: 'roundRect', x, y: 2.65, w, h: 2.2, rectRadius: 0.1,
        fill: { color: s.hot ? C.ember : (dark ? C.ink2 : C.card) }, line: { color: s.hot ? C.ember : (dark ? C.ink2 : C.card), width: 0 } });
      // narrow boxes break long Hebrew words mid-word; scale type with the number of steps
      text(pres, slide, s.label, { x: x + 0.12, y: 2.75, w: w - 0.24, h: 2.0, fontSize: n >= 5 ? 20 : n === 4 ? 22 : 26, bold: true,
        color: s.hot ? C.ivory : fg, align: 'center', valign: 'middle', role: 'step' });
      if (s.sub) text(pres, slide, s.sub, { x, y: 5.0, w, h: 1.3, fontSize: 18, color: dark ? C.mist : C.steel, align: 'center', role: 'sub' });
      if (i < n - 1) {
        slide.addShape(S.rtl ? 'leftArrow' : 'rightArrow', { x: mx(pres, x + w + 0.08, arrowW - 0.16), y: 3.57, w: arrowW - 0.16, h: 0.36,
          fill: { color: C.steel }, line: { color: C.steel, width: 0 } });
      }
    });
  }
  return slide;
}

/**
 * Chart slide. Native pptxgenjs chart styled to the palette: quiet axes, no chart junk,
 * Ember on the series that carries the message (pass `chartColors` to override).
 * `takeaway` is the one-line headline at the start side — the answer, not the question.
 * `overlay(slide, box)` draws annotations over the chart (box is physical coordinates).
 * Charts keep LTR axes in every language: a reversed x-axis misleads more than it helps.
 */
function chartSlide(pres, { eyebrow: eb, title, type = 'bar', data, chartOptions = {}, takeaway, readout, citation: cite, notes, station, appendix, overlay }) {
  const S = ea(pres);
  const slide = base(pres, { ground: C.paper, eyebrow: eb, readout, citation: cite, notes, station, appendix });
  if (title) title40(pres, slide, title);
  const tw = takeaway ? G.width * 0.3 : 0;
  const cw = G.width - (takeaway ? tw + 0.4 : 0);
  const chartBox = { x: mx(pres, G.left + (takeaway ? tw + 0.4 : 0), cw), y: 2.25, w: cw, h: 4.15 };
  slide.addChart(type, data, {
    ...chartBox,
    fontFace: S.fonts.sans, chartColors: [C.ember, C.steel, C.ash],
    catAxisLabelColor: C.steel, valAxisLabelColor: C.steel, catAxisLabelFontSize: 16, valAxisLabelFontSize: 14,
    valGridLine: { color: 'E6E3DC', size: 0.75 }, catGridLine: { style: 'none' },
    showLegend: false, dataLabelColor: C.ink, dataLabelFontSize: 18,
    ...chartOptions,
  });
  if (overlay) overlay(slide, chartBox);
  if (takeaway) {
    text(pres, slide, takeaway, { x: G.left, y: 2.45, w: tw, h: 3.7, fontSize: 30, color: C.ink, valign: 'middle', role: 'takeaway' });
  }
  return slide;
}

/**
 * ECG trace as custom geometry. rhythm 'sinus' (regular PQRST) or 'af' (irregular RR, no P,
 * fibrillatory baseline). Drawn, not an image, so it scales and morphs. Always physical
 * left-to-right — an ECG sweeps the same way in every language.
 */
function ecg(pres, slide, { x, y, w, h, rhythm = 'sinus', beats = 6, color = C.ivory, width = 2, name }) {
  const pts = [];
  const mid = h * 0.62;
  // AF must look irregularly irregular to a clinician: wide RR variation, no repeating pattern
  const seed = [0.55, 1.35, 0.7, 1.05, 0.5, 1.5, 0.8, 0.62, 1.2, 0.9, 0.48, 1.3];
  const rr = w / beats;
  const clampY = (v) => Math.max(0, Math.min(h, v));
  pts.push({ x: 0, y: mid, moveTo: true });
  let cx = 0;
  for (let b = 0; cx < w; b++) {
    const len = rhythm === 'af' ? rr * seed[b % seed.length] * 0.72 : rr;
    const P = (dx, dy) => pts.push({ x: Math.min(w, cx + dx), y: clampY(mid - dy) });
    if (rhythm === 'af') {
      for (let k = 1; k <= 5; k++) P(len * 0.07 * k, (k % 2 ? 1 : -1) * h * 0.035);
    } else {
      P(len * 0.1, 0); P(len * 0.15, h * 0.1); P(len * 0.2, 0);
    }
    const q = rhythm === 'af' ? 0.42 : 0.3;
    P(len * q, 0); P(len * (q + 0.03), -h * 0.08); P(len * (q + 0.07), h * 0.58); P(len * (q + 0.11), -h * 0.22); P(len * (q + 0.15), 0);
    P(len * (q + 0.3), 0); P(len * (q + 0.38), h * 0.15); P(len * (q + 0.46), 0); P(len, 0);
    cx += len;
  }
  slide.addShape('custGeom', {
    x, y, w, h, points: pts,
    line: { color, width }, objectName: name || `ea-ecg-${ea(pres).seq++}`,
  });
}

/**
 * Monitor. The case moment, on Ink: a narrative line on the start side, a patient monitor on
 * the end side. Give vitals the same `key` across slides and Morph animates the numbers
 * changing and the fluid bar filling — the patient deteriorating in front of the room.
 */
function monitor(pres, { eyebrow: eb, line, sub, vitals = [], rhythm = 'sinus', fluids, readout, notes, station, appendix }) {
  const S = ea(pres);
  const slide = base(pres, { ground: C.ink, eyebrow: eb, readout, notes, station, appendix });
  text(pres, slide, line, { x: G.left, y: 1.35, w: 5.2, h: 2.75, fontFace: S.fonts.serif, fontSize: S.rtl ? 44 : 38, italic: true,
    color: C.ivory, valign: 'bottom', lineSpacingMultiple: 1.05, role: 'beat' });
  if (sub) {
    text(pres, slide, [].concat(sub).map((s, i, a) => ({ text: String(s), options: { breakLine: i < a.length - 1 } })), {
      x: G.left, y: 4.35, w: 5.2, h: 1.95, fontSize: 24, color: C.mist, paraSpaceAfter: 8, role: 'sub' });
  }
  // The panel's interior stays physically LTR — monitors read the same way everywhere.
  const pw = G.width - 5.75, ph = 5.25, py = 1.15;
  const px = mx(pres, G.left + 5.75, pw);
  slide.addShape('roundRect', { x: px, y: py, w: pw, h: ph, rectRadius: 0.14, fill: { color: '0B101C' }, line: { color: '2A3350', width: 1 }, objectName: '!!ea-mon-panel' });
  const alarm = vitals.some((v) => v.alarm);
  ecg(pres, slide, { x: px + 0.35, y: py + 0.28, w: pw - 0.7, h: 1.1, rhythm, color: alarm ? C.ember : '9FB0C8', width: 2.25, name: '!!ea-mon-ecg' });
  const cellW = (pw - 0.7) / 2, cellH = 1.38;
  vitals.slice(0, 4).forEach((v, i) => {
    const cx = px + 0.35 + (i % 2) * cellW;
    const cy = py + 1.5 + Math.floor(i / 2) * cellH;
    const key = String(v.key || i);
    text(pres, slide, v.label, { x: cx, y: cy, w: cellW - 0.2, h: 0.36, fontSize: 16, bold: true, color: v.alarm ? C.ember : C.mist,
      noMirror: true, align: 'left', dir: 'ltr', objectName: `!!ea-vl-${key}` });
    text(pres, slide, [{ text: String(v.value), options: { fontSize: 46 } }, { text: v.unit ? `  ${v.unit}` : '', options: { fontSize: 16, color: C.mist } }], {
      x: cx, y: cy + 0.42, w: cellW - 0.1, h: 0.86, color: v.alarm ? C.ember : C.ivory, valign: 'bottom', dir: 'ltr', noMirror: true,
      align: 'left', objectName: `!!ea-vv-${key}` });
  });
  if (fluids) {
    const fy = py + ph - 0.5, fw = pw - 0.7;
    text(pres, slide, fluids.label, { x: px + 0.35, y: fy - 0.46, w: fw * 0.55, h: 0.38, fontSize: 16, bold: true, color: C.mist,
      noMirror: true, align: 'left', dir: 'ltr', objectName: '!!ea-fl-label' });
    text(pres, slide, `${Number(fluids.value).toLocaleString('en-US')} mL`, { x: px + 0.35 + fw * 0.5, y: fy - 0.5, w: fw * 0.5, h: 0.42, fontSize: 22, bold: true,
      color: fluids.alarm ? C.ember : C.ivory, align: 'right', dir: 'ltr', noMirror: true, objectName: '!!ea-fl-value' });
    slide.addShape('roundRect', { x: px + 0.35, y: fy, w: fw, h: 0.24, rectRadius: 0.12, fill: { color: '232B42' }, line: { color: '232B42', width: 0 }, objectName: '!!ea-fl-track' });
    const frac = Math.max(0.03, Math.min(1, fluids.value / fluids.max));
    const barCol = fluids.alarm ? C.ember : '9FB0C8';
    slide.addShape('roundRect', { x: px + 0.35, y: fy, w: fw * frac, h: 0.24, rectRadius: 0.12, fill: { color: barCol }, line: { color: barCol, width: 0 }, objectName: '!!ea-fl-bar' });
  }
  return slide;
}

/** Paper. AMA 11th ed., numbered in order of first appearance in the talk. */
function referencesSlide(pres, { eyebrow: eb = 'References', refs = [], notes }) {
  const slide = base(pres, { ground: C.paper, eyebrow: eb, notes, appendix: true });
  text(pres, slide, refs.map((r, i) => ({ text: `${i + 1}.  ${r}`, options: { breakLine: i < refs.length - 1 } })), {
    x: G.left, y: 1.05, w: G.width, h: 5.4,
    fontSize: refs.length > 10 ? 12 : 14, color: C.steel, paraSpaceAfter: 5, dir: 'ltr', align: 'left', noMirror: true, role: 'refs',
  });
  return slide;
}

// ---------------------------------------------------------------- icons

/**
 * Render a react-icons component to a PNG data string for addImage. Async.
 *   const { FaHeartbeat } = require('react-icons/fa');
 *   const heart = await EA.icon(FaHeartbeat, EA.COLORS.ember);
 */
async function icon(Component, color = C.steel, px = 256) {
  try {
    const React = require('react');
    const { renderToStaticMarkup } = require('react-dom/server');
    const sharp = require('sharp');
    const svg = renderToStaticMarkup(React.createElement(Component, { color: `#${color}`, size: px }));
    const buf = await sharp(Buffer.from(svg)).resize(px, px).png().toBuffer();
    return 'image/png;base64,' + buf.toString('base64');
  } catch (e) {
    // No react/sharp here: the slide still builds, without the icon. Say so once, never crash.
    if (!icon.warned) { console.warn(`[Evidence & Air] icons unavailable (${e.message.split('\n')[0]}) — building without them. npm install react-icons react react-dom sharp`); icon.warned = true; }
    return null;
  }
}

// ---------------------------------------------------------------- audit + save

const MORPH = '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
  + '<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">'
  + '<p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" spd="slow" p14:dur="900"><p159:morph option="byObject"/></p:transition>'
  + '</mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>';

/**
 * Bidi repair for RTL decks, applied to the written XML at save().
 *
 * Measured, not guessed (PowerPoint 365 render, 2026-09): pptxgenjs writes RTL text that
 * PowerPoint lays out wrongly in three ways. (1) With text passed as runs it drops rtl="1"
 * and repeats <a:pPr> once per run inside one paragraph. (2) One lang for the whole run is
 * wrong either way: lang="en-US" puts Hebrew punctuation on the wrong side ("מרים ,בת"),
 * lang="he-IL" reverses Latin letters ("Mathis" -> "sihtaM"). (3) Embedded LTR segments
 * drift. PowerPoint's own files split runs by script, so this does the same: Hebrew/Arabic
 * runs keep the deck language, each Latin/number segment becomes an en-US run fenced with
 * LRM marks, parentheses stay in the RTL run so they mirror, one pPr per paragraph with
 * rtl="1", and an RLM closes the paragraph. Latin-only paragraphs become plain LTR.
 * Known residue: an English parenthetical at the very END of a Hebrew line can still flip —
 * write "· 95% CI 120–830" there instead of "(95% CI 120–830)".
 */
const RTL_CHARS = /[֐-׿؀-ۿ]/;
// Latin letters, digits, and sub/superscript digits (FiO₂, mL/m²) belong to the LTR segment.
const LTR_SEG = /[A-Za-z0-9²³¹⁰-₟](?:[^֐-׿؀-ۿ()\[\]]*[A-Za-z0-9%′²³¹⁰-₟])?/g;

function bidiRun(run, lang) {
  const m = run.match(/^<a:r>(<a:rPr[^>]*?(?:\/>|>[\s\S]*?<\/a:rPr>))<a:t>([\s\S]*?)<\/a:t><\/a:r>$/);
  if (!m) return run;
  const [, rPr, raw] = m;
  const withLang = (l) => (/lang="/.test(rPr) ? rPr.replace(/lang="[^"]*"/, `lang="${l}"`) : rPr.replace('<a:rPr', `<a:rPr lang="${l}"`));
  if (!RTL_CHARS.test(raw)) return `<a:r>${withLang('en-US')}<a:t>${raw}</a:t></a:r>`;
  // Segment the decoded text, never the XML: "&quot;" split into "&" + "quot" corrupts the file.
  const txt = raw.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const enc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  const mk = (s, l) => `<a:r>${withLang(l)}<a:t>${enc(s)}</a:t></a:r>`;
  let out = '', last = 0, g;
  LTR_SEG.lastIndex = 0;
  while ((g = LTR_SEG.exec(txt))) {
    if (g.index > last) out += mk(txt.slice(last, g.index), lang);
    out += mk('‎' + g[0] + '‎', 'en-US');
    last = g.index + g[0].length;
  }
  if (last < txt.length) out += mk(txt.slice(last), lang);
  return out;
}

function bidiFixSlide(xml, lang) {
  return xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (whole, inner) => {
    const plain = (inner.match(/<a:t>[^<]*<\/a:t>/g) || []).join('');
    if (!RTL_CHARS.test(plain)) return whole.replace(/rtl="1"/g, 'rtl="0"').replace(/lang="(he-IL|ar-[A-Z]{2}|fa-IR)"/g, 'lang="en-US"');
    let first = true;
    inner = inner.replace(/<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, (pp) => {
      if (!first) return '';
      first = false;
      return /rtl="/.test(pp) ? pp.replace(/rtl="0"/, 'rtl="1"') : pp.replace('<a:pPr', '<a:pPr rtl="1"');
    });
    if (first) inner = '<a:pPr rtl="1"/>' + inner;
    inner = inner.replace(/<a:r>[\s\S]*?<\/a:r>/g, (r) => bidiRun(r, lang));
    inner = inner.replace(/(<a:t>)([^<]*)(<\/a:t><\/a:r>)(?![\s\S]*<a:r>)/, (m0, a, t, b) => a + t + '‏' + b);
    return `<a:p>${inner}</a:p>`;
  });
}

/**
 * Read a written .pptx and audit what is actually on each slide. Works on any deck —
 * one built by these primitives, a hand-rolled one, or a deck someone else made (Track B1).
 */
async function auditFile(fileOrBuffer, { minutes, appendixFrom } = {}) {
  const JSZip = require('jszip');
  const fs = require('fs');
  const zip = await JSZip.loadAsync(Buffer.isBuffer(fileOrBuffer) ? fileOrBuffer : fs.readFileSync(fileOrBuffer));
  const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
  const slides = [], issues = [];
  let notesMain = 0;
  // A bare "&" in any part makes PowerPoint refuse the whole file ("corrupted and unreadable").
  for (const n of Object.keys(zip.files).filter((f) => /\.(xml|rels)$/.test(f))) {
    const x = await zip.file(n).async('string');
    if (/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/.test(x)) issues.push(`${n}: malformed XML (bare "&") — PowerPoint will refuse to open the file`);
    // pptxgenjs joins a lineDash ARRAY on scatter charts into one invalid value; PowerPoint rejects the file
    if (/prstDash val="[^"]*,/.test(x)) issues.push(`${n}: invalid line dash "${x.match(/prstDash val="([^"]*,[^"]*)"/)[1]}" — pass lineDash as one string, not an array, on scatter charts`);
  }
  for (const n of names) {
    const k = +n.match(/\d+/)[0];
    const xml = await zip.file(n).async('string');
    const shapes = xml.split(/<p:sp>|<p:sp /).slice(1);
    let words = 0, boxes = 0, minPt = 999, ltrRtlScript = 0, arrows = 0, isAppendix = !!(appendixFrom && k >= appendixFrom);
    for (const sp of shapes) {
      const name = (sp.match(/<p:cNvPr[^>]*name="([^"]*)"/) || [])[1] || '';
      const paras = sp.match(/<a:p>[\s\S]*?<\/a:p>/g) || [];
      const txt = paras.map((p) => (p.match(/<a:t>[^<]*<\/a:t>/g) || []).map((t) => t.slice(5, -6)).join('')).join(' ').trim();
      if (!txt) continue;
      boxes++;
      if (/ea-refs/.test(name)) isAppendix = true;
      if (!/ea-(readout|cite|refs|eyebrow)/.test(name)) words += wordCount(txt);
      (sp.match(/ sz="\d+"/g) || []).forEach((s) => { const pt = +s.match(/\d+/)[0] / 100; if (pt < minPt) minPt = pt; });
      paras.forEach((p) => {
        const t = (p.match(/<a:t>[^<]*<\/a:t>/g) || []).join('');
        if (HEB_OR_ARABIC.test(t) && !/rtl="1"/.test(p)) ltrRtlScript++;
        if (HEB_OR_ARABIC.test(t) && /[←-⇿]/.test(t)) arrows++;
      });
    }
    if (arrows) issues.push(`slide ${k}: arrow glyph in Hebrew/Arabic text — arrows flip unpredictably in RTL; use a colon, a comma or "·"`);
    let notesWords = 0;
    const nf = zip.file(`ppt/notesSlides/notesSlide${k}.xml`);
    if (nf) {
      const nx = await nf.async('string');
      const body = (nx.match(/<p:sp>[\s\S]*?<\/p:sp>/g) || []).filter((s) => /type="body"/.test(s)).join(' ');
      notesWords = wordCount((body.match(/<a:t>[^<]*<\/a:t>/g) || []).map((t) => t.slice(5, -6)).join(' '));
    }
    if (!isAppendix) notesMain += notesWords;
    slides.push({ slide: k, minPt: minPt === 999 ? null : minPt, words, boxes, ltrRtlScript, notesWords, appendix: isAppendix });
    const cap = isAppendix ? AUDIT.maxWordsAppendix : AUDIT.maxWords;
    if (minPt < AUDIT.minPt) issues.push(`slide ${k}: text at ${minPt}pt — floor is ${AUDIT.minPt}pt (body 28pt)`);
    if (words > cap) issues.push(`slide ${k}: ${words} words on screen — cap ${cap}. Move depth to the notes or split the slide`);
    if (boxes > AUDIT.maxTextBoxes) issues.push(`slide ${k}: ${boxes} text boxes — that is a document, not a slide`);
    if (ltrRtlScript) issues.push(`slide ${k}: ${ltrRtlScript} Hebrew/Arabic paragraph(s) without rtl="1" — punctuation and numbers render in the wrong order`);
    if (!isAppendix && notesWords < AUDIT.minNotesWords) issues.push(`slide ${k}: ${notesWords} words of speaker notes — the notes are the word-for-word script, not a cue`);
  }
  if (minutes && notesMain > AUDIT.wpm * minutes) {
    issues.push(`speaker notes total ${notesMain} words (main deck) — over ${AUDIT.wpm} x ${minutes} min = ${AUDIT.wpm * minutes}`);
  }
  return { slides, issues, notesMain };
}

/**
 * Write the deck, add Morph transitions, audit the result.
 * strict (default true): on any build-time or file-audit issue the deck is written as
 * `<name>.FAILED.pptx` for inspection and the call throws.
 */
async function save(pres, fileName, { morph = true, strict = true, minutes } = {}) {
  const JSZip = require('jszip');
  const fs = require('fs');
  const S = ea(pres);
  const mins = minutes || S.minutes;
  const zip = await JSZip.loadAsync(await pres.write({ outputType: 'nodebuffer' }));
  // speaker notes too: the presenter reads them in Presenter View, in the same language
  for (const n of Object.keys(zip.files).filter((f) => /^ppt\/(slides\/slide|notesSlides\/notesSlide)\d+\.xml$/.test(f))) {
    let xml = await zip.file(n).async('string');
    if (n.includes('notesSlide')) {
      // pptxgenjs keeps "\n" as a raw newline inside one <a:t>, which Presenter View shows as one
      // unbroken block. Each line of the script becomes its own paragraph.
      xml = xml.replace(/(<a:r>(<a:rPr[^>]*?(?:\/>|>[\s\S]*?<\/a:rPr>))<a:t>)([^<]*)(<\/a:t><\/a:r>)/g, (m, open, rPr, t, close) =>
        (/\r?\n/.test(t) ? open + t.split(/\r?\n/).join(`</a:t></a:r></a:p><a:p><a:r>${rPr}<a:t>`) + close : m));
    }
    if (S.rtl) xml = bidiFixSlide(xml, S.lang);
    zip.file(n, xml);
  }
  if (morph) {
    for (const n of Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))) {
      let xml = await zip.file(n).async('string');
      if (!xml.includes('p159:morph')) {
        xml = xml.includes('</p:clrMapOvr>')
          ? xml.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + MORPH)
          : xml.replace('</p:cSld>', '</p:cSld>' + MORPH);
        zip.file(n, xml);
      }
    }
  }
  const out = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const firstAppendix = S.meta.findIndex((m) => m.appendix);
  const report = await auditFile(out, { minutes: mins, appendixFrom: firstAppendix >= 0 ? firstAppendix + 1 : undefined });
  S.meta.forEach((m, i) => { if (!m.readout && !m.appendix) S.issues.push(`slide ${i + 1}: no readout strip text`); });
  const issues = [...S.issues, ...report.issues];

  console.log(`[Evidence & Air] ${report.slides.length} slides · notes ${report.notesMain} words (main deck)`
    + (mins ? ` · budget ${AUDIT.wpm * mins}` : ''));
  if (issues.length) {
    console.log(`[Evidence & Air] ${issues.length} issue(s):\n  - ` + issues.join('\n  - '));
    if (strict) {
      const failed = fileName.replace(/\.pptx$/i, '.FAILED.pptx');
      fs.writeFileSync(failed, out);
      throw new Error(`Evidence & Air audit failed (${issues.length}). Wrote ${failed} for inspection. Fix the generator; do not pass strict:false to ship.`);
    }
  }
  fs.writeFileSync(fileName, out);
  return report;
}

module.exports = {
  deck, titleSlide, inkBeat, paperStat, paperShift, paperContent, paperCompare, tiles, steps,
  chartSlide, monitor, referencesSlide,
  text, box, ecg, icon, mx, save, auditFile,
  COLORS: C, GEOMETRY: G, AUDIT,
};

// CLI: node evidence-and-air.js audit deck.pptx [minutes]
if (require.main === module && process.argv[2] === 'audit') {
  auditFile(process.argv[3], { minutes: +process.argv[4] || undefined }).then((r) => {
    console.table(r.slides);
    console.log(r.issues.length ? `${r.issues.length} issue(s):\n  - ${r.issues.join('\n  - ')}` : 'clean');
    process.exitCode = r.issues.length ? 1 : 0;
  });
}
