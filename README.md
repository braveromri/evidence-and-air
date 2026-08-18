# Evidence &amp; Air

**English** · [עברית](README.he.md)

**Congress-standard scientific and clinical presentations — a skill for Claude.**

📖 Step-by-step walkthrough: [**GUIDE.en.md**](GUIDE.en.md) · [בעברית](GUIDE.md) · [designed version](https://braveromri.github.io/evidence-and-air/)

---

Not a design template. A system that was built and corrected on real decks, and that does not
move from one stage to the next until the current one meets the standard.

**It works in both directions:**

| You have | What happens |
|---|---|
| **A topic, no slides** | It interviews you, builds an evidence map from primary literature, shows a slide-by-slide skeleton for sign-off, then builds a `.pptx` with speaker notes timed to your speaking pace |
| **An existing deck that isn't good enough** | It reads the deck *and looks at it*, diagnoses the evidence and the design as two separate problems, hands you a per-slide punch-list — and only then improves anything |

The second track is not an afterthought. A deck that "isn't wow" almost always fails on two
independent axes, and they need separate diagnoses: fixing the typography on a slide whose
claim is unsourced only makes a weak claim look confident.

## Install

> **Prerequisite:** Claude Desktop or Claude Code, installed and **opened at least once** —
> that first launch is what creates the `.claude` folder you are about to use.

1. Download `evidence-and-air.zip` from the [latest release](https://github.com/braveromri/evidence-and-air/releases/latest) and extract it.
2. Double-click **`install-windows.bat`** (Windows) or **`install-mac.command`** (macOS).
3. Quit Claude completely and reopen it — skills are only loaded at startup.

The installer places the folder in `~/.claude/skills/` for you. To do it by hand instead, just
copy the `evidence-and-air` folder there yourself.

Then just ask: *"Build me a 20-minute talk on [topic] for [audience]."*
Or share a `.pptx` and ask for it to be improved.

Nothing to install, no connectors to configure, no API keys.

## The look

The style is called "Evidence & Air". Full spec in [`references/style-guide.md`](references/style-guide.md).

| Token | Hex | Role |
|---|---|---|
| **Ink** | `13192B` | Dark ground — hook, narrative beats, close |
| **Paper** | `FAFAF8` | Light ground — data and content slides |
| **Ember** | `C75B3E` | The **single** accent |
| **Steel** | `5B6B85` | Eyebrow labels, secondary structure |
| **Ash** | `8D9099` | Citations and the readout strip |

**The motif:** one thin rule at the same baseline on every slide, with muted small-caps text
beneath it — N, HR and CI on data slides, the source line on narrative slides. That is what
fuses the dark and light registers into one voice.

The style is implemented as code in
[`references/evidence-and-air.js`](references/evidence-and-air.js), not described in prose.
Your first deck *is* Evidence & Air rather than an interpretation of it.

## What it enforces

These are enforced, not suggested:

- Max 6 words per bullet; max 3–4 bullets per slide
- Title ≥ 40pt, body ≥ 28pt
- One idea per slide. One chart **or** one table — never both
- Every data slide shows N; every effect estimate shows its CI — on the slide, not in the notes
- Every content slide carries at least one non-text visual
- No 3D charts, no truncated y-axis, units on every axis
- Every claim traces to primary literature; anything preliminary or contested is flagged on screen

Above all: research at the highest available level every time, and production quality matching
the field's leading speakers. **"Good but not wow" is a failing grade.**

## Requirements

Claude Desktop or Claude Code, installed and signed in. That's it — the bundled `pptx` and
`presentation-builder` skills ship with the app, and `pptxgenjs` is already present in the
environment they run in. If a `require` ever fails: `npm install pptxgenjs`.

Figma and Canva are supported as optional sources for visual assets, but are **off by default
and not required** — the primitives in `evidence-and-air.js` produce the full style without them.

## Credit and licence

Created by **Dr. Omri Braver** — [github.com/braveromri](https://github.com/braveromri)

Released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): use, adapt and
redistribute freely, including commercially, as long as credit is given when redistributing
the system itself.

**The decks you build are yours.** They carry no branding, no credit line, and no authorship
metadata belonging to anyone else. That is deliberate, not an oversight — attribution covers
redistributing the system, never its output.
