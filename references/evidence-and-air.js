/**
 * Evidence & Air — slide primitives for pptxgenjs.
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
 * pptxgenjs is preinstalled where the bundled `pptx` skill runs. Anywhere else:
 *   npm install pptxgenjs
 *
 * API
 * ---
 *   const EA = require('./evidence-and-air');
 *   const pres = EA.deck({ title, author });
 *
 *   EA.titleSlide(pres,      { eyebrow, title, subtitle, presenter, readout, notes })
 *   EA.inkBeat(pres,         { eyebrow, line, attribution, readout, notes })
 *   EA.paperStat(pres,       { eyebrow, numeral, label, detail, readout, citation, notes })
 *   EA.paperContent(pres,    { eyebrow, title, bullets, visual, readout, citation, notes })
 *   EA.paperCompare(pres,    { eyebrow, title, left, right, readout, citation, notes })
 *   EA.referencesSlide(pres, { eyebrow, refs, notes })
 *
 *   await pres.writeFile({ fileName: 'Talk.pptx' });
 *
 * Every function takes `readout` — the strip text at the baseline. On a data slide that is
 * "N = 8,344  ·  HR 0.78 (95% CI 0.66-0.92)". On a narrative slide it is the source line.
 * It is never omitted. `notes` is the word-for-word spoken narrative for that slide.
 */

const pptxgen = require('pptxgenjs');

// ---------------------------------------------------------------- palette

const C = {
  ink:   '13192B',  // dark ground   — hook, beats, close
  paper: 'FAFAF8',  // light ground  — data and content
  ember: 'C75B3E',  // the ONE accent
  steel: '5B6B85',  // eyebrows, secondary structure
  ivory: 'F2EFE9',  // text on ink
  ash:   '8D9099',  // citations, sub-labels, readout
};

const FONT = {
  sans:   'Calibri',       // body, numerals
  label:  'Trebuchet MS',  // eyebrows, small caps
  serif:  'Georgia',       // narrative beats, italic only
};

// 13.33 x 7.5in. Every constant below is inches, and shared by every slide type —
// that shared geometry is what makes the deck read as one object.
const G = {
  left:      0.9,
  right:     0.9,
  width:     11.53,   // 13.33 - left - right
  eyebrowY:  0.52,
  bodyTop:   1.55,
  stripY:    6.62,    // the rule
  stripTextY: 6.74,   // the text under it
};

// ---------------------------------------------------------------- internals

/** Eyebrow label, top-left. Wayfinding. On every slide. */
function eyebrow(slide, text, onDark) {
  if (!text) return;
  slide.addText(String(text).toUpperCase(), {
    x: G.left, y: G.eyebrowY, w: G.width, h: 0.3,
    fontFace: FONT.label, fontSize: 11, bold: true,
    charSpacing: 2.5,                       // NOT letterSpacing — silently ignored
    color: onDark ? C.steel : C.steel,
    margin: 0,
  });
}

/**
 * The readout strip: one thin rule at a constant baseline, with muted small-caps text
 * beneath it. This is the motif. It appears on every slide without exception.
 */
function readoutStrip(slide, text, onDark) {
  slide.addShape('line', {
    x: G.left, y: G.stripY, w: G.width, h: 0,
    line: { color: onDark ? C.steel : C.ash, width: 0.75 },
  });
  if (text) {
    slide.addText(String(text).toUpperCase(), {
      x: G.left, y: G.stripTextY, w: G.width * 0.68, h: 0.3,
      fontFace: FONT.label, fontSize: 10,
      charSpacing: 1.5,
      color: onDark ? C.steel : C.ash,
      margin: 0,
    });
  }
}

/** Citation, bottom-right, italic. Never collides with the readout text. */
function citation(slide, text, onDark) {
  if (!text) return;
  slide.addText(String(text), {
    x: G.left + G.width * 0.68, y: G.stripTextY, w: G.width * 0.32, h: 0.3,
    fontFace: FONT.sans, fontSize: 10, italic: true,
    color: onDark ? C.steel : C.ash,
    align: 'right', margin: 0,
  });
}

/** Common scaffold. Returns the slide with ground, eyebrow, strip and citation set. */
function base(pres, { ground, eyebrow: eb, readout, citation: cite, notes }) {
  const onDark = ground === C.ink;
  const slide = pres.addSlide();
  slide.background = { color: ground };
  eyebrow(slide, eb, onDark);
  readoutStrip(slide, readout, onDark);
  citation(slide, cite, onDark);
  if (notes) slide.addNotes(String(notes));   // notes part, never a text box
  return slide;
}

// ---------------------------------------------------------------- deck

/** One `new pptxgen()` per output file — never reuse an instance. */
function deck({ title, author, subject } = {}) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';       // MUST be set before any slide is added. 13.33 x 7.5in
  if (title)   pres.title   = title;
  if (author)  pres.author  = author;
  if (subject) pres.subject = subject;
  return pres;
}

// ---------------------------------------------------------------- slide types

/** Ink. Opening identity slide. Zero body text beyond title/subtitle/presenter. */
function titleSlide(pres, { eyebrow: eb, title, subtitle, presenter, readout, notes }) {
  const slide = base(pres, { ground: C.ink, eyebrow: eb, readout, notes });

  slide.addText(title, {
    x: G.left, y: 2.35, w: G.width, h: 1.5,
    fontFace: FONT.sans, fontSize: 54, color: C.ivory, margin: 0,
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: G.left, y: 3.85, w: G.width * 0.8, h: 0.6,
      fontFace: FONT.serif, fontSize: 22, italic: true, color: C.ember, margin: 0,
    });
  }
  if (presenter) {
    slide.addText(presenter, {
      x: G.left, y: 4.75, w: G.width * 0.8, h: 0.4,
      fontFace: FONT.sans, fontSize: 15, color: C.steel, margin: 0,
    });
  }
  return slide;
}

/**
 * Ink + Georgia italic. The narrative beat: hook, a transition, the close.
 * One line, then silence. Never add an explanatory paragraph under it.
 */
function inkBeat(pres, { eyebrow: eb, line, attribution, readout, notes }) {
  const slide = base(pres, { ground: C.ink, eyebrow: eb, readout, notes });

  slide.addText(line, {
    x: G.left + 0.6, y: 2.15, w: G.width - 1.2, h: 2.4,
    fontFace: FONT.serif, fontSize: 38, italic: true, color: C.ivory,
    align: 'center', valign: 'middle', lineSpacingMultiple: 1.25, margin: 0,
  });

  if (attribution) {
    slide.addText(attribution, {
      x: G.left + 0.6, y: 4.75, w: G.width - 1.2, h: 0.35,
      fontFace: FONT.label, fontSize: 11, charSpacing: 2, color: C.ember,
      align: 'center', margin: 0,
    });
  }
  return slide;
}

/**
 * Paper + one huge numeral. The data slide.
 * `numeral` carries the weight through scale, not boldness — regular weight, 80pt.
 * `readout` must carry N and the effect estimate with CI.
 */
function paperStat(pres, { eyebrow: eb, numeral, label, detail, readout, citation: cite, notes }) {
  const slide = base(pres, { ground: C.paper, eyebrow: eb, readout, citation: cite, notes });

  slide.addText(String(numeral), {
    x: G.left, y: 1.95, w: G.width * 0.52, h: 1.9,
    fontFace: FONT.sans, fontSize: 96, color: C.ember,
    bold: false,                       // scale carries it, not weight
    align: 'left', valign: 'middle', margin: 0,
  });

  if (label) {
    slide.addText(label, {
      x: G.left, y: 3.95, w: G.width * 0.52, h: 0.9,
      fontFace: FONT.sans, fontSize: 28, color: C.ink, margin: 0,
    });
  }

  // The graphic anchor. A numeral alone on Paper is the forgettable case.
  slide.addShape('rect', {
    x: G.left + G.width * 0.60, y: 2.05, w: 0.09, h: 2.5,
    fill: { color: C.ember },
  });

  if (detail) {
    slide.addText(detail, {
      x: G.left + G.width * 0.60 + 0.42, y: 2.05, w: G.width * 0.38 - 0.42, h: 2.5,
      fontFace: FONT.sans, fontSize: 17, color: C.steel,
      valign: 'top', lineSpacingMultiple: 1.35, margin: 0,
    });
  }
  return slide;
}

/**
 * Paper + title + up to 3-4 short bullets. Max 6 words each — enforced loudly, because
 * this is the rule that erodes first.
 * `visual` is a short description of the graphic that belongs here; it is rendered as a
 * placeholder block so a missing asset is visible rather than silently absent.
 */
function paperContent(pres, { eyebrow: eb, title, bullets = [], visual, readout, citation: cite, notes }) {
  const slide = base(pres, { ground: C.paper, eyebrow: eb, readout, citation: cite, notes });

  const overlong = bullets.filter((b) => String(b).trim().split(/\s+/).length > 6);
  if (overlong.length) {
    console.warn(`  [Evidence & Air] >6 words on screen: ${overlong.map((b) => JSON.stringify(b)).join(', ')}`);
  }
  if (bullets.length > 4) {
    console.warn(`  [Evidence & Air] ${bullets.length} bullets on "${title}" — max is 4, ideally 2-3.`);
  }

  slide.addText(title, {
    x: G.left, y: 1.35, w: G.width * 0.54, h: 0.95,
    fontFace: FONT.sans, fontSize: 40, color: C.ink, margin: 0,
  });

  if (bullets.length) {
    slide.addText(
      bullets.map((b, i) => ({
        text: String(b),
        options: { bullet: true, breakLine: i < bullets.length - 1 },
      })),
      {
        x: G.left, y: 2.65, w: G.width * 0.54, h: 3.3,
        fontFace: FONT.sans, fontSize: 28, color: C.ink,
        paraSpaceAfter: 14,            // NOT lineSpacing — that gaps enormously
        valign: 'top', margin: 0,
      },
    );
  }

  if (visual) {
    slide.addShape('rect', {
      x: G.left + G.width * 0.60, y: 1.5, w: G.width * 0.40, h: 4.4,
      fill: { color: 'F0EEE9' }, line: { color: C.ash, width: 0.5, dashType: 'dash' },
    });
    slide.addText(`VISUAL\n${visual}`, {
      x: G.left + G.width * 0.60 + 0.3, y: 1.5, w: G.width * 0.40 - 0.6, h: 4.4,
      fontFace: FONT.label, fontSize: 12, color: C.ash,
      align: 'center', valign: 'middle', charSpacing: 1, margin: 0,
    });
  }
  return slide;
}

/**
 * Paper. Two options side by side, as stat cards — the replacement for two-column bullets,
 * which are banned. Both headers in Steel: the accent goes on one side ONLY when that side
 * is explicitly the recommendation. Pass `recommend: 'left' | 'right'` for that case.
 */
function paperCompare(pres, { eyebrow: eb, title, left, right, recommend, readout, citation: cite, notes }) {
  const slide = base(pres, { ground: C.paper, eyebrow: eb, readout, citation: cite, notes });

  if (title) {
    slide.addText(title, {
      x: G.left, y: 1.25, w: G.width, h: 0.8,
      fontFace: FONT.sans, fontSize: 40, color: C.ink, margin: 0,
    });
  }

  const cardW = (G.width - 0.7) / 2;
  [[left, 0, 'left'], [right, 1, 'right']].forEach(([col, i, side]) => {
    if (!col) return;
    const x = G.left + i * (cardW + 0.7);
    const accent = recommend === side;

    slide.addShape('rect', {
      x, y: 2.35, w: cardW, h: 0.06,
      fill: { color: accent ? C.ember : C.steel },
    });
    slide.addText(String(col.heading || ''), {
      x, y: 2.55, w: cardW, h: 0.5,
      fontFace: FONT.label, fontSize: 14, bold: true, charSpacing: 1.5,
      color: accent ? C.ember : C.steel, margin: 0,
    });
    slide.addText(String(col.value || ''), {
      x, y: 3.05, w: cardW, h: 1.15,
      fontFace: FONT.sans, fontSize: 60, color: C.ink, bold: false, margin: 0,
    });
    if (col.detail) {
      slide.addText(String(col.detail), {
        x, y: 4.3, w: cardW, h: 1.9,
        fontFace: FONT.sans, fontSize: 16, color: C.steel,
        valign: 'top', lineSpacingMultiple: 1.3, margin: 0,
      });
    }
  });
  return slide;
}

/** Paper. AMA 11th ed., numbered in order of first appearance in the talk. */
function referencesSlide(pres, { eyebrow: eb = 'References', refs = [], notes }) {
  const slide = base(pres, { ground: C.paper, eyebrow: eb, notes });

  slide.addText(
    refs.map((r, i) => ({
      text: `${i + 1}.  ${r}`,
      options: { breakLine: i < refs.length - 1 },
    })),
    {
      x: G.left, y: 1.3, w: G.width, h: 5.1,
      fontFace: FONT.sans, fontSize: refs.length > 8 ? 11 : 13, color: C.steel,
      paraSpaceAfter: 7, valign: 'top', margin: 0,
    },
  );
  return slide;
}

module.exports = {
  deck, titleSlide, inkBeat, paperStat, paperContent, paperCompare, referencesSlide,
  COLORS: C, FONTS: FONT, GEOMETRY: G,
};
