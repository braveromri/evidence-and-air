# Presentation lessons

Read at Stage 0. Appended to at Stage 7.

This file is the memory of the system. Every entry is a question that will not have to be asked
again, and a correction that will not have to be made twice. Keep it lean — merge and prune
redundant entries rather than letting it grow into a transcript.

The entries below are seeded from real decks that were built, critiqued, and rebuilt. They are
starting defaults, not scripture: overwrite any of them the moment your own experience says
otherwise.

---

## Seeded — layout anti-patterns

These were each learned by shipping a slide that did not work. Do not rediscover them.

- **No two-column bullet text for comparisons.** Replace with a visual trade-off display:
  odds-ratio bars, an icon-based trade matrix, or side-by-side stat cards that show the
  numbers rather than prose. A two-column bullet comparison is reliably the weakest slide in
  any deck that contains one.
- **No bar chart for exactly two data points.** With two values (8.2% → 3.5%), use a bold
  before/after large-numeral layout with an arrow. Bar charts earn their place at three or more
  categories.
- **No explanatory paragraph on a hook slide.** The rule is one line, then silence. A
  supporting sentence under the serif italic line turns a punch into a paragraph. Cut it.
- **In a two-option comparison, do not put the accent colour on one option** unless that option
  is explicitly the recommendation. When both have merit — same outcome, different risk profile
  — use Steel for both headers and reserve Ember for specific key statistics inside.

## Seeded — what "wow" actually turned on

- The gap between a good deck and a memorable one was **typography and graphic polish**, not
  content. A first draft rated "good but not wow" was rated so on visual and type grounds while
  the evidence was already sound. Do not under-invest in type pairing and scale.
- One big confident numeral per data slide beats a dense layout, every time.
- **The readout strip is the single highest-value element.** It is what viewers respond to most
  strongly and what makes the deck read as one designed object. Never drop it from a slide.

## Seeded — working practice

- **Render real slides to images when discussing visual design**, rather than showing HTML
  mock-ups. Type, scale, and spacing are very hard to judge from a mock-up, and the difference
  only becomes visible in the actual rendered slide.
- **Do not export slide images as the deliverable.** Deliver the `.pptx`. Images are for
  in-conversation review only.
- Keep filenames short and descriptive (`ECMO-Demo.pptx`). Long paths plus long filenames hit
  the Windows path-length limit in ways that fail confusingly.
- **Speaker-notes pace:** ~120 wpm is a good starting default. That is roughly 70–85 words for
  a 35-second slide, 130–160 for a 75-second slide. Calibrate to your own delivery after the
  first talk and record the result here.

## Seeded — visual assets without connectors

- The pptxgenjs primitives in `references/evidence-and-air.js` produce the full style with no
  external design tool. Use them as the default path.
- Figma and Canva MCP connectors are optional. If a connector fails to authenticate, **stop
  after one attempt** and fall back to the primitives — never let one stuck visual block a
  whole deck. (Recorded after Figma OAuth failed three sessions running in the environment
  this system was built in; the fallback path lost nothing.)

---

<!-- New entries below. Format: ## YYYY-MM-DD — deck name, then a few durable one-line rules. -->
