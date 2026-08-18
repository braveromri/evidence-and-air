# Full guide — from install to an excellent deck

**English** · [עברית](GUIDE.md) · [README](README.md)

This guide assumes Claude is already installed and that beyond that you know nothing.
Do exactly what it says, in order.

---

## Part A · Install (once)

> **One prerequisite:** Claude must have been **opened at least once**. That first launch is
> what creates the folder we're about to use — if you installed it and never opened it, the
> path in step 2 simply won't exist.

### 1. Download the skill

On the project's main page on GitHub, click the green **Code** button, then **Download ZIP**.
Extract it (right-click → Extract All).

The extracted folder will be called `evidence-and-air-main`.
**Rename it to `evidence-and-air`** — without the suffix. This matters.

### 2. Move it into your skills folder

That folder is hidden by default, so don't go hunting for it — just paste the path.

**On Windows** — open File Explorer, paste this into the address bar at the top, press Enter:

```
%USERPROFILE%\.claude\skills
```

**On macOS** — open Finder, press `Cmd+Shift+G`, paste this, press Enter:

```
~/.claude/skills
```

If the `skills` folder doesn't exist, create it with exactly that name, lowercase.
Now move the `evidence-and-air` folder into it.

### 3. Quit Claude completely and reopen it

Minimising isn't enough — close the window and start it again. Skills are only loaded at
startup. **This is the number one reason for "nothing happened".**

### Check it worked

The structure should look exactly like this, with `SKILL.md` sitting **directly** inside
`evidence-and-air`. If you have a folder inside a folder with the same name, you went one
level too deep:

```
.claude/skills/evidence-and-air/
├── SKILL.md
├── GUIDE.md
├── GUIDE.en.md
├── LICENSE
├── README.md
├── README.he.md
├── presentation-lessons.md
└── references/
    ├── style-guide.md
    ├── venues.md
    └── evidence-and-air.js
```

---

## Part B · Your first deck

There's no special command and no syntax to remember. Open a new conversation and write a
normal sentence:

> Build me a 20-minute talk on heart failure with preserved ejection fraction, for a
> departmental meeting.

The more you say, the less you'll have to correct later.

**Have a paper, a guideline, or data?** Drag it into the conversation along with your request.
This is the single biggest upgrade available to you — Claude will prefer your material over
anything it finds, and pull numbers and phrasing from it rather than searching blind.

### Or: you already have a deck that isn't good enough

This works in reverse too. If you started a deck and it isn't at the level you wanted, drag
the `.pptx` into the conversation and write something like:

> This deck isn't good enough. Go through it, tell me what isn't working, then fix it.

What happens next is deliberately different from building from scratch:

1. **It reads the deck and looks at it.** Not just the text — it renders images of the slides,
   because most "not wow" problems live in the layout, not the words.
2. **It diagnoses two things separately:** what's weak **professionally** (unsourced claims,
   numbers with no N, stale data, misleading charts) and what's weak **visually** (crowded
   slides, small type, a slide with no visual at all, no thread tying the deck together).
3. **It hands you a punch-list by slide number**, and says what to fix first. Evidence always
   before design.
4. **It touches nothing until you approve.** This is your work — it won't delete your content
   or change your claims on its own. If something looks wrong to it, it asks, because you may
   know something the literature search didn't find.

Whatever already works stays. It should tell you explicitly which slides are fine and leave
them alone.

---

## Part C · What happens now

Claude won't start building immediately. It moves through four moments with you. Only one of
them really needs you.

### Moment one — it asks

A few questions: who the audience is, how long you have, what tone, whether you need a
disclosure slide, and how high the stakes are.

**Answer the stakes question honestly.** If you say everything is critical, it will spend
research effort you don't need and you'll wait longer. If it's a real talk to a professional
audience, say so.

### Moment two — it searches

It reads the literature and comes back with a short summary: what's established, what's new,
what's contested.

Nothing to do here — unless something looks missing or wrong to you. If so, say it now.

### Moment three — this is where you're needed ⚠

It shows you a **skeleton**: every slide listed — the title, the idea, which chart, how long.
Nothing has been built yet.

**Don't say "great, continue" too quickly. Actually read it.**

Reordering, cutting a slide or shifting emphasis costs one sentence here. After the file is
built it costs ten times that. This is the single moment that decides whether the deck comes
out good or excellent.

### Moment four — it builds

You get an ordinary `.pptx`, opening in PowerPoint or Keynote. Under every slide the speaker
notes are already written — what to say, in spoken language, timed to that slide's length.

---

## Part D · An excellent result every time

The system is good from the first slide, but it's designed to get better specifically for you.
Five things, in order of importance:

**1. Don't skip the skeleton.**
If you remember one thing from this guide, make it this one.

**2. Fill in the venues file once.**
`references/venues.md` holds five talk types with bracketed placeholders — departmental
meeting, academic lecture, congress, journal club, internal update. Replace them with your real
ones. From then on the opening questions collapse from nine to one, on every deck.

**3. Give it your own sources.**
An attached paper always beats an independent search, and it keeps your talk and your
manuscript telling the same story.

**4. Answer it at the end when it asks what to improve.**
There's a file called `presentation-lessons.md` that is the system's memory. Every correction
you give is recorded there and won't come back. After three or four decks it knows your pace,
your tone and your preferences — and you correct less and less.

**5. Tell it when something isn't beautiful.**
"This slide is crowded", "the number doesn't stand out enough" — that works, and it will
remember next time too.

---

## Part E · Troubleshooting

### I asked for a deck and nothing special happened

The skill didn't load. Almost always: you didn't quit and reopen Claude after copying, or the
folder isn't in the right place. Go back to step 2 and confirm `SKILL.md` sits directly inside
`evidence-and-air`, with no extra folder in between.

### It built a deck but it doesn't look like what was promised

Claude's own general presentation skill probably loaded instead of this one.
Tell it explicitly: *"use the evidence-and-air skill"*, and it will switch.

### An error about `pptxgenjs`

That's the component that writes the PowerPoint file, and it's already present in most cases.
If not, ask Claude to run `npm install pptxgenjs`. It knows how to do that itself.

---

Created by **Dr. Omri Braver** — <https://github.com/braveromri> · Licensed CC BY 4.0
