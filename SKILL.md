---
name: evidence-and-air
description: Build or upgrade scientific and clinical presentations to congress standard, in the "Evidence & Air" visual style. Use for BOTH entry points — (1) a new deck, talk, lecture, grand rounds, journal club, congress presentation or .pptx from scratch, and (2) an existing or half-finished deck that is not good enough: "make this better", "this isn't wow", "polish my slides", "redesign this deck", "review my presentation", "it looks amateurish", "upgrade these slides", or any .pptx the user shares wanting it improved. Works in English and in right-to-left languages (Hebrew, Arabic) with correct bidi. Diagnoses evidence quality and visual design separately, verifies every number against the primary source, builds with pptxgenjs through primitives whose save step audits the file and refuses to ship a dense or broken deck, and renders every slide to an image for review before delivery.
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

## Which track are you on

Decide this first, in one line, and say which you are running.

| The user has… | Track | Route |
|---|---|---|
| A topic and no slides | **A — New deck** | Stage 0, then Stages 1 → 7 |
| A deck, or a half-built one, that is not good enough | **B — Upgrade** | Stage 0, then Stages B1 → B3, rejoining at Stage 5 |

Track B is not a lesser path. An existing deck that "isn't wow" usually fails on two separate
axes — the evidence and the design — and they need separate diagnoses, because fixing the
typography on a slide whose underlying claim is unsourced just makes a weak claim look
confident. Never start redesigning before you have run the audit in B1.

---

## Stage 0 — Load what you already learned

Read `presentation-lessons.md` (this skill's directory) before anything else. It carries
accumulated corrections and preferences from previous decks. Apply them as defaults — never
make the user repeat a preference they have already given. A current instruction always beats
a recorded lesson.

Also read `references/style-guide.md`, `references/venues.md` and
**`references/professional-standard.md`** now, not later. The last one is the bar a
specialist audience applies — headline register, terminology, no clip-art, no invented curves,
guideline class on every recommendation, safety review of clinical sequences. A deck can pass
every density and design check and still fail it.

On a machine where this skill has not built a deck before, run `node references/selftest.js
<outDir>` once. It builds every primitive in English and in Hebrew through the strict audit; a
FAIL here is an environment problem (missing pptxgenjs, jszip, or a changed pptxgenjs version)
that would otherwise surface halfway through a real deck.

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
7. **Language** — and whether a second-language version will be needed later. Hebrew or
   Arabic means an RTL deck: `EA.deck({ rtl: true })`, and the RTL rules in Stage 5 apply.
8. **Presenter and disclosures** — name, specialty, institution for the title slide; funding
   and COI for the disclosure slide. Most congresses mandate one. Ask; never assume none, and
   never write a presenter's name or "no conflicts" on their behalf.
9. **Stakes and rigor** — this sets the research depth for everything downstream.
10. **What will it be presented in?** PowerPoint (Mac or Windows, 2019 or later) gets Morph
    transitions, the single biggest "wow" lever in the system. Keynote and Google Slides drop
    Morph on import, so the deck must read correctly without motion. Ask even when a venue
    preset matches: it is the one answer a preset cannot know.

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

**Check every on-screen number against the abstract itself, not against memory or a secondary
summary.** PubMed's E-utilities need no key, no login and no connector, and they work from any
shell (the PubMed web page itself often returns a cookie wall to tools):

```bash
# find PMIDs
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=5&term=Lerman+ejection+fraction+noncardiac+surgery+mortality"
# read the abstract, with N, effect estimate and CI
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=30747965&rettype=abstract&retmode=text"
# AMA-ready metadata: authors, journal, volume, pages, DOI
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=30747965&rettype=medline&retmode=text"
```

Record for each number: which group it describes (crude or adjusted, which subgroup), N, and
the CI. Typical defects this catches: a crude rate presented as adjusted, a CI dropped, a
subgroup percentage attached to the whole cohort, "doubled" in the notes for an OR of 1.46.

**Guideline currency sweep — mandatory, by name.** Search each major society in the field for
guidelines, focused updates and consensus pathways published in the last 18 months
(*"2026 ESC guidelines heart failure"*, *"2024 ACC/AHA perioperative guideline"*,
*"ACC expert consensus decision pathway HFpEF 2026"*). Record for every recommendation the
body, year, class and level. Check the release calendar when the talk is near one — ESC late
August, AHA November, ACC March–April, ADA December–January, ASA October. Definitions move:
one ESC release removed a whole HF category and redefined HFpEF two weeks before a deck built
on the old definition was reviewed.

**Also search the last 12 months for anything that contradicts the deck's advice.** A
perioperative "stop drug X three days before" rule can be challenged by a study published last
month. Such a finding goes on screen, flagged as contested, with its design stated — never
silently adopted, never silently omitted.

**Optional — NotebookLM for source-grounded checking.** When the user supplies a stack of PDFs,
NotebookLM answers "does source X actually say Y?" with a citation into the PDF. It is off by
default and never required. It needs the unofficial `notebooklm-py` package and a Google login
that **the user performs themselves** in their own browser (`notebooklm login`); never enter
credentials for them. If it is installed and authenticated: create a notebook, add the PDFs,
ask one question per central claim, and record the cited passage in the evidence map. If it is
not, or login fails once, continue with E-utilities — nothing is lost.

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

**The hook is a finding, not a slogan.** Force comes from the evidence and from the case, not
from wordplay. For a specialist audience the narrative voice lives in the spoken notes; what is
on screen reads like the title of a good paper (`references/professional-standard.md` §1).

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
- **Every title is a factual assertion on one line** — the finding the slide proves, in the
  register of a paper. No slogans, no antithesis, no quoted speech.
- **Clinical terms in the field's own language** — in a Hebrew deck, drug names, parameters and
  modes stay in English (Norepinephrine, Preload, PEEP), as specialists write them.
- **Every recommendation carries body, year and class** on the slide; expert opinion is
  labelled as such.
- **No generic icons, no invented curves.** A visual carries data or mechanism; a schematic says
  "schematic" on screen.
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

### Build only through the primitives — never hand-roll a slide

Use `references/evidence-and-air.js`. Read its header comment for the API. **Every slide in the
deck is one primitive call.** Custom graphics go *inside* a primitive's `visual` or `overlay`
callback, drawn with `EA.text` / `EA.box` / `EA.ecg`, so they inherit the eyebrow, the readout
strip, the RTL mirroring and the audit.

This is the rule that failed in practice. A deck built "with this skill" that bypassed the
primitives came back with 9.5pt text, up to 236 words on a slide, 43 elements in a frame, notes
of 13 words, and Hebrew punctuation in the wrong place — a document pasted onto slides. If a
layout seems to need hand-rolled `addText` calls, the content is too dense for one slide: split
it.

**Choose the primitive from the content, not from habit:**

| The slide's job | Primitive | Notes |
|---|---|---|
| Hook, transition, "so what", close | `inkBeat` | One line, ≤14 words. Silence under it |
| One number that matters | `paperStat` | Numeral at 150pt; N and CI in the readout |
| Two numbers: before/after, exposed/unexposed | `paperShift` | Never a two-bar chart |
| Two options with different trade-offs | `paperCompare` | Never two columns of bullets |
| 3–5 parallel targets, checks, takeaways | `tiles` | Tile value ≤3 words at 5 tiles |
| An order of operations, a causal chain | `steps` | `ladder` up to 7, `chain` up to 5 |
| A dose-response, a trend, ≥3 categories | `chartSlide` | Native chart. `takeaway` = the answer |
| A clinical case moment | `monitor` | See "The case monitor" below |
| Bullets + one custom graphic | `paperContent` | ≤3 bullets; `visual` is mandatory |

**The case monitor — the strongest single device in the system.** When the talk follows a
patient, show the case moments as `monitor` slides with the *same vitals keys* on every one
(`bp`, `hr`, `spo2`, `map`) and a running `fluids` bar. With Morph on, PowerPoint animates the
numbers changing, the trace turning from sinus to AF, the bar filling and turning Ember — the
patient deteriorates in front of the room. This is what "wow" means for a clinical audience: not
decoration, the physiology moving. **Morph only animates between adjacent slides**, so each
event is a pair: a stable frame immediately followed by the changed frame (pre-induction →
post-induction; stable at 60 min → crisis at 90 min). A monitor that follows a text slide
simply appears. Keep the numbers clinically real: MAP consistent with the pressure, fluid totals
that only rise, AF that looks irregularly irregular.

**Tiles take no icons for a specialist audience.** Generic icon sets read as clip-art. Anchor a
tile with a `kicker` ("Class I", "01") or with nothing; `EA.icon()` remains for audiences where
it helps.

**Station tracker.** Pass `station: [n, total]` on every slide of a structured talk. The dots
are Morph-stable, so moving between sections reads as travel.

### Right-to-left decks (Hebrew, Arabic)

`EA.deck({ rtl: true, lang: 'he-IL' })` mirrors every layout, switches to Arial + Times New
Roman (the only faces that carry Hebrew on both Mac and Windows), removes letter-spacing and
italics, and **repairs bidi in the written XML** at `save()` — slides and speaker notes. Do not
work around it with hand-inserted RLM marks. Measured behaviour behind that repair (PowerPoint
365, 2026): a Hebrew run tagged `en-US` puts punctuation on the wrong side; tagged `he-IL` it
reverses English letters; pptxgenjs drops `rtl="1"` when text is passed as runs. Content rules
that remain:

- Hebrew quotation marks are ״…״ (gershayim), never ASCII `"` — ASCII quotes are bidi-neutral
  and land on the wrong side.
- No arrow glyphs (→ ←) in Hebrew text — they flip unpredictably; the audit flags them. Use a
  colon, a comma or "·". Dates DD/MM/YYYY; no nikud in professional text.
- Titles wrap earlier when English terms are mixed in: keep a mixed title visibly shorter and
  confirm on the render that it is one line.
- Do not end a Hebrew line with an English parenthetical — write `· 95% CI 120–830`, not
  `(95% CI 120–830)`.
- Long Hebrew words break mid-word in narrow boxes. In a 5-step chain or 5 tiles, prefer two
  short words to one long technical term; keep the term in the sub-line or the notes.
- Charts keep an LTR x-axis in every language. Chart category labels are not bidi-repaired:
  keep them pure Hebrew or pure English, never mixed ("≥3 ימים" breaks; "שלושה ומעלה" does not).

### Speaker notes — a script, not cues

**This is where the spoken narrative gets written, once.** For each slide compose complete,
word-for-word speaker notes from its key message and the evidence map: first person,
conversational, confident, naming the evidence where it strengthens credibility ("this is from
a trial of just over 8,000 patients, published last year"), sized to the slide's time budget at
~110–130 wpm. Stage directions go in square brackets on their own line — `[pause; wait for
hands]`, `[point at the red curve]`. Say the limitation of each study out loud in the notes,
in one sentence. One line of script per paragraph (`\n`); `save()` turns each into its own
paragraph so Presenter View stays readable. Notes go in the `notes` option, never in a text box.
A slide with under 40 words of notes fails the audit: "Stop 20 seconds here" is a cue for the
presenter's memory, not something they can read aloud.

### Save, and let the audit block you

```js
await EA.save(pres, 'Talk.pptx', { morph: true, strict: true });
```

`save()` adds Morph transitions (with a fade fallback), repairs RTL, then **reads the written
file back and audits it**: text below 12pt, more than 40 words on screen (90 on appendix
slides), more than 22 text boxes, Hebrew paragraphs without RTL, notes under 40 words, total
notes over 130 × minutes, a missing readout, malformed XML, and invalid chart line dashes. Any
issue writes `Talk.FAILED.pptx` and throws. **Fix the content and rebuild. Never pass
`strict: false` to ship** — the audit exists because warnings were ignored.

Two pptxgenjs faults it catches that corrupt the whole file: a bare `&` produced by text
processing, and `lineDash` passed as an array on a scatter chart (written as one invalid value).

**Gate G5 — Build.** `save()` passes in strict mode. The file opens in PowerPoint. Every planned
visual is actually embedded — assets drop silently.

## Stage 5.5 — Render every slide and look at it

Binding, and not replaceable by the audit: the audit counts, it does not see. Render every slide
to an image at ≥1600px wide and view them — as a grid for rhythm, then individually for defects.

- **Windows (PowerPoint installed):**
  ```powershell
  $pp = New-Object -ComObject PowerPoint.Application
  $p = $pp.Presentations.Open("C:\short\path\Talk.pptx", $true, $false, $false)
  foreach ($s in $p.Slides) { $s.Export("C:\short\path\r\s$($s.SlideIndex).png", "PNG", 1600, 900) }
  $p.Close(); $pp.Quit()
  ```
  Keep the path short: PowerPoint refuses any path over 255 characters, and agent scratch
  folders often exceed it.
- **macOS / Linux:** `soffice --headless --convert-to pdf Talk.pptx`, then
  `pdftoppm -png -r 110 Talk.pdf r/s`. LibreOffice substitutes fonts and ignores Morph, so trust
  it for layout and overlap, not for exact line breaks.

Look for, on every slide: text overflowing or colliding (a label running into a value), a number
or CI split across two lines, a Hebrew word broken mid-word, punctuation on the wrong side, a
tile whose value runs into its sub-line, an empty half of a frame, a chart whose colours vary
per bar for no reason (pptxgenjs colours each point of a single series differently — pass
`chartColors` per point). Fix in the generator, rebuild, re-render the changed slides. Expect
two to three rounds; the first render always has defects.

**Gate G5.5.** Every slide has been viewed after the last rebuild. No defect from the list above
remains.

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
- [ ] Every on-screen number was checked against its abstract (Stage 2), including which
      subgroup and whether crude or adjusted
- [ ] A search of the last 12 months found nothing contradicting the advice — or the
      contradiction is on screen, flagged as contested
- [ ] The notes are a readable script: every slide ≥40 words, limitations said aloud
- [ ] `save()` passed in strict mode, and every slide was viewed after the final rebuild
- [ ] If there is a case, it appears on `monitor` slides that Morph between each other
- [ ] Backup slides after the close hold the detail that was cut from the main deck
- [ ] **Committee test, slide by slide:** would this specialty's congress programme committee
      accept this slide as it stands? Read every title aloud — any slogan, pun, quoted speech or
      informal phrasing fails (`references/professional-standard.md`)
- [ ] Every guideline cited is the current version (currency sweep done in Stage 2)
- [ ] Every clinical sequence was reviewed step by step against the case's own vitals — nothing
      contraindicated at those numbers, zero-cost immediate actions first
- [ ] No generic icons, no invented quantitative curves; schematics labelled
- [ ] Presenter details and disclosures come from the user, not from a placeholder

Run the committee test with a fresh reviewer where possible — a subagent briefed as "senior
[specialty] consultant on the programme committee of [congress]", given the rendered slide
images and `references/professional-standard.md`, asked for every slide it would send back and
why.

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

# Track B — upgrading an existing deck

Use when the user already has slides and wants them better. Run Stage 0 first, exactly as in
Track A: the lessons file and the style guide apply identically.

## Stage B1 — Read it, then audit it on two axes

**Look at the deck before saying anything about it.** Two passes, both required:

- **Content:** `markitdown deck.pptx` — one block per slide under `<!-- Slide number: N -->`.
- **Visual:** `python scripts/thumbnail.py deck.pptx <name>-thumbs` (from the bundled `pptx`
  skill) for a labelled grid of every slide. **Always pass the second argument** — it defaults
  to `thumbnails` and silently overwrites another deck's grid. Then actually view the image.

An audit written from the text alone will miss every layout problem, which is usually where
"not wow" actually lives. Do not skip the thumbnails.

Then measure it — the same audit `save()` runs, pointed at their file:

```bash
node references/evidence-and-air.js audit their-deck.pptx 20     # 20 = talk minutes
```

It prints a per-slide table (smallest font, words on screen, text boxes, Hebrew paragraphs
missing RTL, words of notes) and every rule the deck breaks. Quote those numbers in the
punch-list: "slide 11: 214 words on screen, 9.5pt text, 27 text boxes" is a finding the user
can check; "the slides are dense" is not. If there is no pptxgenjs on the machine, run it where
the `pptx` skill runs (pptxgenjs and jszip are preinstalled there).

**Dense but good is the common case.** A deck can be clinically excellent and still fail every
presentation rule — the author wrote the talk onto the slides. Then the verdict is Re-skin
*plus split*: keep every clinical point, move depth to the notes and to backup slides after the
close, and expect the slide count to rise (15 dense slides typically become 20–24 main slides
plus 4–5 backup). Ask the user once whether to split with backup or to cut to the time slot.

Then score it on the two axes **separately**, because they fail independently and the user
experiences them as one vague dissatisfaction. Report per-slide, naming slide numbers.

### Axis 1 — Professional / evidence

- Claims with no source at all
- Sources that exist but are stale — superseded guidelines, a trial overtaken since
- Statistics with no N; effect estimates with no CI; percentages with no denominator
- Preliminary or contested findings presented as settled
- Missing disclosures slide where the venue requires one
- Chart integrity: 3D effects, truncated y-axis, unlabelled axes, inconsistent precision
- No references slide, or references not in AMA 11th ed.

### Axis 2 — Graphic / design

- Bullets over 6 words; slides over 4 bullets; full sentences on screen
- Body under 28pt, titles under 40pt
- Content slides with no visual element at all
- **The banned anti-patterns** from `presentation-lessons.md` — two-column bullet comparisons,
  a bar chart for exactly two data points, an explanatory paragraph under a hook line
- More than one accent colour on screen; palette drift across slides
- No consistent wayfinding or motif — nothing tying the slides into one object
- Dense layouts where one big number would land harder
- An opening slide that is a title or agenda rather than a hook

### Axis 3 — Professional register (the specialist's eye)

Run it even when axes 1 and 2 pass — a deck fixed for density and design was still judged
informal by a specialist. Against `references/professional-standard.md`:

- Titles that are slogans, puns, antitheses or quoted speech instead of stated findings
- Home-made translations of standard clinical terms; colloquial phrasing on screen
- Generic icons or clip-art; charts drawn without data
- Recommendations without body, year and class; expert opinion presented as evidence
- Guidelines that have been superseded — run the currency sweep before judging content
- Clinical sequences with a step contraindicated at the case's own numbers
- Missing presenter details, disclosure slide, or references

**Gate B1.** The audit names specific slides and specific defects. "The design could be
stronger" is not an audit. Every finding is something a named slide does or fails to do.

## Stage B2 — Triage, and get agreement before touching anything

Sort every finding into one of three outcomes, and tell the user which the deck needs:

| Verdict | When | What happens |
|---|---|---|
| **Re-skin** | Content and argument are sound; the design is the problem | Rebuild the slides in Evidence & Air, preserving the content as-is. The common case. |
| **Restructure** | The narrative order or emphasis is wrong | Return to Stage 3, then Stage 4, keeping the evidence |
| **Re-evidence** | Claims are unsourced, stale, or overstated | Return to Stage 2 for those specific claims before anything visual |

A deck can need more than one. Say so plainly, in priority order, and say which you would do
first — evidence before design, always, since polishing an unsupported claim only makes it more
persuasive than it deserves to be.

Present the punch-list and **wait for agreement**. This is someone's existing work: never
silently rewrite their claims, drop their content, or change their argument. If a claim looks
wrong, flag it and ask — they may know something the literature search does not.

**Gate B2.** The user has seen the punch-list and agreed on scope. Do not skip ahead to
building because the fixes seem obvious.

## Stage B3 — Rebuild, or operate

Default to **rebuilding in Evidence & Air** using the primitives in
`references/evidence-and-air.js`, carrying the approved content across. A style this
systematic is far cleaner to rebuild than to retrofit, and retrofitting tends to leave half
the old deck's inconsistencies in place.

**Operate on the original file instead** only when the deck must keep a mandated template —
a congress skin, an institutional master. Then unzip, edit `ppt/slides/slideN.xml`, and
re-zip per the `pptx` skill, and apply the style's principles *within* the mandated palette:
the word counts, the single accent, one idea per slide, N and CI visible, and a consistent
baseline strip still all apply.

Either way, **preserve what was already good.** If a slide already works, say so and leave it
alone. An upgrade that rewrites everything tells the user their judgment was worthless, and it
is usually also wrong.

**Then rejoin Track A at Stage 5** for the build and the speaker notes, Stage 5.5 for the render
review, Stage 6 for the quality gate, and Stage 7 for the lessons entry. If the original notes
are cues ("pause here", "two minutes max"), keep their intent as bracketed stage directions and
write the spoken script around them. Hand the user a short change log with the deck: what moved
to backup, which numbers were corrected and against which source, and any new evidence added. Note in that entry which axis the deck actually failed
on — over several decks this reveals whether this user's weak spot is evidence or design, and
Stage 1 can pre-empt it.

---

## Optional — other tools, when they are actually there

None of these is needed; the primitives and E-utilities produce the full result on their own.
Check that a tool is installed and authenticated **before** planning around it, try it once,
and fall back without ceremony if it fails.

| Tool | What it adds | When to use it |
|---|---|---|
| NotebookLM (`notebooklm-py`) | Answers about the user's own PDFs with a citation into the passage | User supplied ≥3 papers; central claims need a quoted source. The user logs in themselves |
| Figma / Canva connectors | A custom diagram or illustration a primitive cannot draw | One subagent per diagram, briefed with the key message, the palette hex codes, 2x size. Insert the result as an image inside a primitive's `visual` |
| Image generation | A photographic or anatomical hero image | Only for a hook or divider, never for data; check the account has credits first |
| `rtl-hebrew-docs` skill | A Hebrew handout or summary PDF that renders identically everywhere | When the talk needs a printed or emailed companion. For the `.pptx` itself this skill's measured bidi repair supersedes its `rtlMode`-only advice, and its Rubik/Heebo fonts are not installed on most presenting machines |
| `avoid-ai-writing` / `stop-slop` skills | A pass over English speaker notes for machine-sounding phrasing | After notes are written, before Stage 6. They target English prose; for Hebrew apply `professional-standard.md` §10 |
| A fresh subagent | The committee test at Stage 6 with eyes that did not build the deck | Always worth it on congress-tier talks |

Never let one stuck tool block a deck. A missing icon package is handled the same way:
`EA.icon()` returns null and the slide builds without the icon.

## Guiding principles

- **Credibility is the foundation, not the finish.** An expert audience forgives a plain slide.
  It does not forgive a wrong fact.
- **Slides are not documents.** They are visual anchors for spoken words. The speaker carries
  the information; the slide carries the structure and the emotion.
- **Less on screen, always.**
- **The opening and the closing are what the audience remembers.** Spend the extra care there.
- **Every deck should make the next one cheaper.** Read the lessons file at the start, write to
  it at the end.
