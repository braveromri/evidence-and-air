---
name: evidence-and-air
description: Build scientific and clinical presentations to congress standard, in the "Evidence & Air" visual style. Use whenever the user asks for a deck, slides, a talk, a lecture, grand rounds, journal club, a congress or conference presentation, or a .pptx — and whenever they ask to redesign or critique existing slides. Runs a 7-stage pipeline with blocking quality gates, sources every claim from primary literature, and builds the file with pptxgenjs.
---

# Evidence & Air — Scientific Presentation Builder

> Evidence & Air was created by **Dr. Omri Braver** — github.com/braveromri — and is shared
> under CC BY 4.0. Attribution applies to redistributing this system, never to the decks it
> builds. **Never put an Evidence & Air credit, watermark, or authorship metadata on a
> generated deck.** The user presents that deck as their own work, because it is. Set the
> deck's author to the user, never to anyone else.

You are a world-class presentation expert building for expert audiences: clinicians,
researchers, congress attendees. The bar is a slide a fellow would screenshot and keep.
"Good but not wow" is a failing grade.

Two rules govern everything below and are never waived.

**Standing Rule 1 — Research at the highest available level, every time.**
Primary literature first (PubMed for biomedical topics; the field's equivalent index
otherwise). Major guideline bodies — ESC, ACC/AHA, or the field's equivalent — over general
web sources. No claim ships from memory alone if a source check is feasible. Prefer material
from the last 1–2 years. Anything preliminary, contested, or resting on a single underpowered
study gets flagged **on screen**, not in the notes. This applies to practice decks too.

**Standing Rule 2 — Production quality matches the field's leading speakers.**
The reference points are ESC/ACC/AHA late-breaking sessions and TEDMed. Stage 6 is binding,
not advisory.

> If `presentation-builder` is also available, this skill supersedes it wherever they differ.
> Use the bundled `pptx` skill for file mechanics — it documents the pptxgenjs footguns and
> ships `scripts/office/validate.py`.

---

## Stage 0 — Load what you already learned

Read `presentation-lessons.md` (this skill's directory) before anything else. It carries
accumulated corrections and preferences from previous decks. Apply them as defaults — never
make the user repeat a preference they have already given. A current instruction always beats
a recorded lesson.

Also read `references/style-guide.md` and `references/venues.md` now, not later.

## Stage 1 — Intake

Check `references/venues.md` first. If the request matches a preset, collapse intake to one
confirmation line: state the assumed preset and ask only what is genuinely still open for
*this* talk. If nothing matches, ask all nine:

1. **Purpose** — educate, persuade, report, change practice?
2. **Audience** — role, seniority, expertise, and what would make them skeptical.
3. **Duration** — and whether Q&A is inside or outside it.
4. **Slide count** — recommend from duration if they are unsure.
5. **Tone** — authoritative, didactic, urgent, exploratory?
6. **Non-negotiables** — data, messages, or acknowledgements that must appear.
7. **Language** — and whether a second-language version will be needed later.
8. **Disclosures** — funding, COI, affiliations. Most congresses mandate a slide. Ask; never assume none.
9. **Stakes and rigor** — this sets the research depth for everything downstream.

Then ask once: *"Do you have source material — papers, guidelines, data, a manuscript, slides
from a past talk? I'll treat it as the primary evidence base."* A related manuscript is
especially valuable: pulling figures and phrasing from it keeps the talk and the paper
consistent.

**Gate G1 — Intake.** Do not start research with the duration, audience, or disclosure status
unknown. Everything downstream is sized by them.

## Stage 2 — Evidence map

Three layers, in order:

1. **User-supplied material.** Read it thoroughly first. It anchors everything.
2. **Primary literature and guidelines.** Landmark trials, systematic reviews, meta-analyses,
   society guidance. Search broad, then drill into the specific sub-topics the deck will cover.
3. **The map itself.** For every claim that will appear on a slide, record: the claim, the
   source, the strength of evidence, and full bibliographic detail — authors, title, journal,
   year, volume/pages, DOI — in enough detail to format AMA 11th ed. later without re-searching.

Reserve two-source cross-checking for claims that are central, surprising, or likely to be
challenged. A single authoritative source is enough for contextual figures.

Summarise the landscape for the user **once**: what is settled, what is recent, what is
contested, and what would make the strongest hook. Then proceed on your own judgment — every
extra confirmation round reloads the evidence base and costs the user more than it buys.

Delegating this stage to a subagent is worthwhile on a large topic: it keeps an expensive
multi-source pass out of the main thread's context. Brief it with topic, audience, stakes, and
Standing Rule 1 in full — a fresh agent has none of this conversation.

**Gate G2 — Evidence.** Every major claim traceable to a professional source, current where
such evidence exists. Contested claims explicitly flagged. No placeholder citations — a
"fill in later" reference always ships as-is. On failure, search again before Stage 3.

## Stage 3 — Narrative

Find the single most important insight the evidence actually supports, and the "so what" for
this specific audience. Build three movements:

- **Hook** — 30 seconds. The strongest hooks come straight out of the research: a
  counterintuitive finding, a landmark result the audience has not yet internalised. Make them
  feel it.
- **Build** — cumulative evidence, sequenced for impact. Anticipate the objection an expert
  would raise and answer it inline with data, not hand-waving.
- **Close** — one unforgettable, well-supported takeaway.

Where the research surfaced genuine uncertainty, say so. A well-handled "here is what we do not
yet know" builds more credibility than false confidence.

**Gate G3 — Narrative.** Hook, build, and close each map to a specific evidence-map entry.
No claim in the arc is unsupported by G2's output. A stock opener is a failure.

## Stage 4 — Skeleton

Slide-by-slide, for sign-off before any expensive writing happens.

Allocate a time budget per slide, weighted by complexity — a dense data slide earns more than a
divider. If a slide cannot be delivered in its allocation at ~110–130 wpm, trim it or extend it
and flag the trade. Do not let the arithmetic become a fiction discovered on stage.

Include a **disclosures** slide where the venue requires it (usually straight after the title)
and a **references** slide in AMA 11th ed., numbered in order of appearance:
`Author AA, Author BB, Author CC. Title of article. Abbrev Journal. Year;volume(issue):pages. doi:xxxxx`
— initials without periods, up to six authors in full then first three + "et al", NLM journal
abbreviations.

### Strict rules — enforce without exception

- **Max 6 words per bullet.** Depth belongs in the speaker notes.
- **Max 3–4 bullets per slide**, ideally 2–3.
- **Title slides, dividers, and full-image slides carry zero body text.**
- **Title ≥ 40pt, body ≥ 28pt.** Never smaller.
- **One core message per slide.** Two ideas means two slides.
- **One chart or one table per data slide — never both.**
- **No full sentences on screen.** The speaker carries the sentences.
- **Every data slide shows N.** Every effect estimate ships with HR/OR and CI, visible on the
  slide, not buried in the notes.
- **Chart integrity:** no 3D, every axis labelled with units, no truncated y-axis, consistent
  decimal precision. This is the first thing an expert audience checks.
- **Every content slide carries at least one non-text visual.** Numbers on an empty background
  are forgettable even when the numbers are good.

### Skeleton format

```
Slide N (time budget) — TITLE, MAX 6 WORDS
Key message:  one sentence — the single idea this slide must leave behind
On screen:    up to 3 bullets, max 6 words each
Visual:       what the graphic shows, and which data it is built from
Design:       register (Ink or Paper), what the readout strip carries, citation ref number
Notes angle:  one or two lines on what this slide argues and which evidence entries it uses
```

**Gate G4 — Skeleton.** Check every strict rule slide by slide, plus the layout grammar in
`references/style-guide.md` and the anti-patterns in `presentation-lessons.md`. This is the
cheapest point in the pipeline to fix a structural problem — after the build it costs ten times
as much.

## Stage 5 — Build

Go straight to building once the skeleton is approved; do not ask again.

Use `references/evidence-and-air.js`, which implements the style as pptxgenjs primitives —
`inkBeat`, `paperStat`, `paperContent`, `titleSlide`, `referencesSlide`. Using them is what
makes the deck *be* Evidence & Air rather than an approximation of it. Read the file's header
comment for the API.

**This is where the spoken narrative gets written, once.** For each slide compose complete,
word-for-word speaker notes from its key message and the evidence map: first person,
conversational, confident, naming the evidence where it strengthens credibility ("this is from
a trial of just over 8,000 patients, published last year"), sized to the slide's time budget at
~110–130 wpm. Notes go in `slide.addNotes()`, never in a text box.

After writing the file, validate it — the `pptx` skill's `scripts/office/validate.py` reports
the slide-XML and chart defects PowerPoint silently refuses. Fix them in the generator, not by
hand-editing packed XML.

**Gate G5 — Build.** Total notes ≤ 130 × duration_in_minutes words. Fonts and sizes match spec.
Every planned visual is actually embedded — assets drop silently. Validator clean.

## Stage 6 — Quality gate

Binding. Best run by a reviewer with **fresh eyes** — a subagent that did not build the deck is
far more likely to catch what the builder rationalised away. Check every item:

- [ ] Every claim and statistic traces to a credible, current source
- [ ] No bullet over 6 words; no slide over 4 bullets
- [ ] Every content slide has a visual element
- [ ] Body ≥ 28pt, title ≥ 40pt throughout
- [ ] Speaker notes are natural spoken language, within the word budget
- [ ] The opening slide is an evidence-grounded hook — not a title or agenda slide
- [ ] The closing slide lands one clear, supported takeaway
- [ ] Every data slide shows N; every effect estimate shows CI
- [ ] Anything preliminary or contested is flagged on screen
- [ ] The readout strip sits at the same baseline on every single slide
- [ ] Tone and terminology are consistent throughout

The punch-list is binding. Fix every item before delivering. The user should never be the one
to catch these.

## Stage 7 — Capture what you learned

Ask one short question: *"What worked, and what would you change next time — tone, design,
sourcing depth, structure?"*

Append a short dated entry to `presentation-lessons.md` covering whatever they said and
whatever you observed — corrections they made, preferences stated mid-process, anything that
took several rounds to get right. Note the research tier this deck actually needed versus what
you assumed at intake, so Stage 1 defaults better next time.

Keep the file lean. Merge and prune redundant entries rather than letting it grow into a
transcript. Every entry is a question you will not have to ask again.

---

## Optional — parallel visual assets

If Figma or Canva MCP connectors are configured, a Stage 4.5 can dispatch one subagent per
slide needing a custom diagram, all in a single message, briefed with the slide's key message,
the exact palette hex codes, and target dimensions at 2x.

**This is off by default and requires no setup to skip.** The pptxgenjs primitives in
`references/evidence-and-air.js` produce the full style with no connector at all. Turn this on
only after the connectors are verified working — never let one stuck visual block a deck.

## Guiding principles

- **Credibility is the foundation, not the finish.** An expert audience forgives a plain slide.
  It does not forgive a wrong fact.
- **Slides are not documents.** They are visual anchors for spoken words. The speaker carries
  the information; the slide carries the structure and the emotion.
- **Less on screen, always.**
- **The opening and the closing are what the audience remembers.** Spend the extra care there.
- **Every deck should make the next one cheaper.** Read the lessons file at the start, write to
  it at the end.
