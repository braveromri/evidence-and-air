# "Evidence & Air" — the visual system

The default style for every deck built with this skill. Apply it without asking, unless the
venue mandates its own branding.

## Concept

Three registers fused, so a deck can move between them without breaking voice:

- **Rigor** (clinical congress / ESC-AHA): every data point ships with N, HR/CI, units —
  visible on the slide, never buried in the notes.
- **Narrative beats** (TEDMed): one idea per frame at the emotional turning points — hook,
  transitions, close — set in editorial serif italic.
- **Confident scale** (Apple Keynote): one big number per data slide, generous whitespace,
  nothing competing for attention.

## Palette

| Role | Hex | Use |
|---|---|---|
| Ink | `13192B` | dark background — hook, narrative beats, close |
| Paper | `FAFAF8` | light background — data and content slides. Warm off-white; never stark white, never cream |
| Ember | `C75B3E` | terracotta-crimson. The **one** accent: emphasis words, key numerals, italic highlights |
| Steel | `5B6B85` | eyebrow labels, secondary structure |
| Ivory | `F2EFE9` | body text on Ink |
| Ash | `8D9099` | citations, sub-labels, the readout strip |

**Sandwich structure:** Ink for hook, beats, and close; Paper for data and content. Never more
than one accent colour on screen at a time.

## Typography

- **Headers, eyebrows, data:** Calibri for body; Trebuchet MS for small-caps eyebrows, bold,
  letter-spaced.
- **Narrative beats:** Georgia, italic — for the line that should land and breathe. Never more
  than one or two lines.
- **Big stat numerals:** Calibri at 120–150pt, **regular weight, not bold**. Let scale carry the
  weight. (The seeded 64–80pt proved too timid on a projector; the primitives use 150.)
- Never centre body paragraphs. Centre only single-line narrative beats and titles.

### Right-to-left decks

- **Faces:** Arial for everything; Times New Roman for narrative beats. Calibri, Georgia and
  Trebuchet carry no Hebrew or Arabic glyphs — the viewer's OS would substitute at random.
- **No italics and no letter-spacing** on Hebrew or Arabic. Slanted Hebrew reads as an error;
  spaced Hebrew breaks the letterforms. Weight (bold titles) replaces both.
- **Mirror the grammar, not the data:** eyebrow and readout start at the right, citation sits
  bottom-left, arrows point right-to-left, the station tracker runs right-to-left. Charts, ECG
  traces and monitor panels stay physically left-to-right, as they are everywhere in medicine.
- Hebrew quotation marks are ״…״. Statistics stay in Latin digits and English abbreviations
  (HR, CI, N) — clinicians read them that way in any language.

## The motif — the readout strip

A single thin horizontal rule near the baseline of **every** slide, at the same y-position
throughout (~0.5" from the bottom), paired with small-caps muted text:

- on data slides it carries N / HR / CI / units
- on narrative slides it carries the source line — trial name, journal, year

This is what fuses the dark and light registers into one voice. **Repeat it on every single
slide without exception.** It is the first thing to check at the quality gate, and the single
element most responsible for the deck reading as designed rather than assembled.

## Layout grammar

- One core message per slide. One chart **or** one stat, never both.
- Generous whitespace. Resist filling. Let the big numeral or the serif line be the only thing
  in the frame.
- Eyebrow label top-left on every slide for wayfinding — Trebuchet MS, small caps,
  letter-spaced, Steel.
- Citation bottom-right in Ash, 10–11pt, italic. Consistent placement; never colliding with the
  readout strip.

## Which register, when

| Moment | Register |
|---|---|
| Hook, close | Ink + Georgia italic — land one feeling |
| Data, evidence | Paper + large Calibri numeral + readout strip with full statistical context |
| Transitions, the "so what" | Ink + Georgia italic — same as hook, used once or twice per deck so it keeps its force |
| A clinical case moment | Ink + `monitor` — vitals, trace and fluid bar that Morph between appearances |
| Backup detail cut from the main talk | After the close, behind an Ink "backup" divider — relaxed word cap, never in the timing |

## Motion

Morph (PowerPoint 2019+/365, Mac and Windows) on every slide, 0.9s. It is not decoration: the
readout strip and the station dots stay put while content changes, which makes the deck feel
like one continuous object, and on `monitor` slides it animates the physiology itself. No
fly-ins, no builds, no spinning — Morph and nothing else. Keynote and Google Slides fall back to
a fade; the deck must read fully without motion.

## Visual-asset standard

Every content slide — anything that is not a hook, close, or divider — needs at least one
visual that carries information: a native chart, a pressure–volume schematic, a case monitor, a
scored checklist, a data table, a causal chain. Plain numbers on Paper is never sufficient on its
own; the numeral needs a graphic anchor beside it.

**Generic icon sets do not count.** A pill, a bed, a magnifying glass reads as clip-art to a
specialist audience and was the first thing flagged as unprofessional in a real deck. Neither
does a chart drawn without data: a curve implies measurement, so a teaching schematic says
"schematic" on screen. See `professional-standard.md` §3.

This is part of the quality bar, not an optional polish step.
