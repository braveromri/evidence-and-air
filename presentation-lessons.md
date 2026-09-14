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

## 2026-09-13 — "HFpEF בחדר הניתוח" (Hebrew, anaesthesia department meeting, 20 min) — Track B

A deck built by another user of this skill, upgraded. It failed on **design only**; the
clinical content was strong. Durable rules:

- **A skill that only warns gets ignored.** The builder bypassed the primitives and hand-rolled
  every slide: 9.5pt text, 110–236 words per slide, notes of 13–37 words. The fix was an audit
  that reads the *written file* and refuses to save — not another paragraph of rules.
- **Dense-but-good decks need splitting, not cutting.** 15 slides became 23 main + 5 backup with
  no clinical point lost. The case thread (one patient, five stations) was the author's best
  idea; it was kept and made visible with `monitor` slides and a station tracker.
- **RTL is not a font choice.** Hebrew in pptxgenjs renders with punctuation on the wrong side
  or English reversed unless runs are split by script — now automatic in `save()`. ASCII quotes
  and an English parenthetical at the end of a Hebrew line still break; write around them.
- **Verify numbers against the abstract, even in a good deck.** One figure had lost its CI, one
  crude rate was described as "doubled" risk (adjusted OR 1.46), and a study published the month
  before contradicted the deck's "stop SGLT2i 3–4 days before" advice. The new study went on
  screen flagged as contested, not into the advice.
- **pptxgenjs file-corrupting faults met in one build:** entity text split into a bare `&`;
  `lineDash` array on a scatter chart; notes line breaks collapsing into one paragraph. All three
  are now caught or repaired in `save()`.
- **Tile values must be 1–3 words at 5 tiles.** Longer values wrapped into the sub-line on every
  tile slide in the first render. The audit now flags long tile values.
- **Research tier actually needed:** high (department teaching, practice-changing). Intake
  assumed the same.

## 2026-09-14 — same deck, second review: "שכונתי" — the specialist's standard

The v2 rebuild passed every density, design and bidi check and was still judged informal by the
specialist who commissioned it: "not a student deck — a specialist presenting to specialists".
The gap was register and clinical currency, not layout. Now codified in
`references/professional-standard.md` and a third audit axis. Durable rules:

- **Slogans fail an expert room.** Antithesis titles ("the water didn't accumulate, it was
  pushed"), quoted hallway speech and taglines were the core of the complaint. Titles now state
  the finding in the register of a paper; rhetoric lives in the notes.
- **Translate syntax, not terminology.** Hebrew academy terms for Preload/Afterload/atrial kick
  read as a translated textbook. Drug names, parameters and modes stay in English.
- **Generic icons are clip-art; a chart without data is a fabrication.** Both were removed.
- **Guidelines move under a finished deck.** The 2026 ESC HF guidelines (28 Aug 2026) removed
  HFmrEF, redefined HFpEF as LVEF ≥50% and made SGLT2i + MRA foundational — the deck predated
  them. A named, dated currency sweep is now mandatory at Stage 2.
- **Clinical sequences need a safety read against the case's own vitals.** The crisis ladder
  listed nitroglycerin before the vasopressor at SBP 78 and "stop fluids" seventh; an ACE
  inhibitor was held where the 2024 ACC/AHA guideline favours continuing GDMT in compensated HF.
  None of this is visible to a design audit.
- **Morph needs adjacency.** A deterioration animates only between a stable frame and the
  changed frame on consecutive slides — added a pre-induction and a 60-minute monitor.
- **Mixed English–Hebrew titles wrap earlier than pure Hebrew** — four titles collided with
  content in the render. Keep them short and confirm one line.
- **Borrowed from `rtl-hebrew-docs`:** no arrow glyphs in RTL text (now an audit error),
  DD/MM/YYYY, no nikud.
