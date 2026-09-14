/**
 * Evidence & Air — self-test. Builds every primitive, once in English and once in Hebrew (RTL),
 * through the strict audit. Run it once on a new machine before a real deck:
 *
 *   node references/selftest.js [outDir]
 *
 * Passing means: pptxgenjs + jszip resolve, every primitive builds, bidi repair and Morph
 * post-processing produce a file the audit accepts. It does not replace looking at the render.
 * Open the two files in PowerPoint once to confirm they open.
 */
const path = require('path');
const EA = require('./evidence-and-air');

const NOTES = (s) => `Slide ${s}. ` + 'This sentence exists so the self-test notes clear the forty-word floor that the audit enforces on every main slide, which is the point of the floor: notes are a script the presenter can read aloud, not a cue.';
const HNOTES = (s) => `${s} ` + 'המשפט הזה קיים כדי שהערות הבדיקה יעברו את רצפת ארבעים המילים שהבדיקה אוכפת על כל שקף ראשי, וזו בדיוק מטרת הרצפה: ההערות הן תסריט שהמרצה יכול להקריא בקול, ולא תזכורת קצרה לעצמו בלבד. גם השורה הזאת נבדקת, כדי לוודא שהכיוון מימין לשמאל נשמר.';

async function build(rtl, outDir) {
  const t = rtl
    ? { beat: 'EF תקין. לב לא תקין.', title: 'בדיקה עצמית', stat: 'מ״ל פחות נוזלים', n: HNOTES, a: 'לפני', b: 'אחרי', ro: 'N = 1,018 · aOR 0.39 · 95% CI 0.18–0.89', c1: 'קצב', c2: 'דופק', step: 'צעד' }
    : { beat: 'Normal EF. Abnormal heart.', title: 'Self-test', stat: 'mL less fluid', n: NOTES, a: 'Before', b: 'After', ro: 'N = 1,018 · aOR 0.39 · 95% CI 0.18–0.89', c1: 'Rhythm', c2: 'Rate', step: 'Step' };
  const pres = EA.deck({ title: t.title, rtl, minutes: 10 });
  EA.inkBeat(pres, { eyebrow: t.title, line: t.beat, readout: t.ro, notes: t.n('1') });
  EA.titleSlide(pres, { eyebrow: t.title, title: t.title, subtitle: t.beat, readout: t.ro, notes: t.n('2') });
  EA.paperStat(pres, { eyebrow: t.title, station: [1, 3], numeral: '470', label: t.stat, detail: ['aOR 0.39', '95% CI 0.18–0.89'], readout: t.ro, citation: 'Mathis MR et al. Br J Anaesth 2025', notes: t.n('3') });
  EA.paperShift(pres, { eyebrow: t.title, station: [1, 3], title: t.title, from: { value: '1.2%', label: t.a }, to: { value: '4.4%', label: t.b }, readout: t.ro, notes: t.n('4') });
  EA.paperContent(pres, { eyebrow: t.title, station: [2, 3], title: t.title, bullets: [t.a, t.b], readout: t.ro, notes: t.n('5'),
    visual: (slide, b) => EA.box(pres, slide, { shape: 'roundRect', x: b.x, y: b.y, w: b.w, h: b.h, rectRadius: 0.1, fill: { color: EA.COLORS.card }, line: { color: EA.COLORS.card, width: 0 } }) });
  EA.paperCompare(pres, { eyebrow: t.title, station: [2, 3], title: t.title, left: { heading: t.a, value: '1.2%' }, right: { heading: t.b, value: '4.4%' }, readout: t.ro, notes: t.n('6') });
  EA.tiles(pres, { eyebrow: t.title, station: [2, 3], title: t.title, tiles: [{ head: t.c1, value: 'Sinus', hot: true }, { head: t.c2, value: '60–80' }, { head: t.c1, value: '250 mL' }], readout: t.ro, notes: t.n('7') });
  EA.steps(pres, { eyebrow: t.title, station: [3, 3], title: t.title, layout: 'chain', steps: [{ label: `${t.step} 1` }, { label: `${t.step} 2`, hot: true }, { label: `${t.step} 3` }], readout: t.ro, notes: t.n('8') });
  EA.chartSlide(pres, { eyebrow: t.title, station: [3, 3], title: t.title, type: 'bar', takeaway: t.beat, readout: t.ro, notes: t.n('9'),
    data: [{ name: 'x', labels: ['A', 'B', 'C', 'D'], values: [1.7, 5.7, 8.4, 11.5] }],
    chartOptions: { showValue: true, valAxisHidden: true, chartColors: [EA.COLORS.ash, EA.COLORS.ember, EA.COLORS.ember, EA.COLORS.ember] } });
  EA.monitor(pres, { eyebrow: t.title, station: [3, 3], line: t.beat, sub: [t.a], rhythm: 'af', readout: t.ro, notes: t.n('10'),
    vitals: [{ key: 'bp', label: 'ART', value: '78/52', unit: 'mmHg', alarm: true }, { key: 'hr', label: 'HR', value: '148', unit: 'bpm', alarm: true }],
    fluids: { label: 'IV FLUIDS', value: 1600, max: 2000, alarm: true } });
  EA.referencesSlide(pres, { refs: ['Mathis MR, Ghadimi K, Benner A, et al. Br J Anaesth. 2025;134(1):32-44. doi:10.1016/j.bja.2024.08.020'], notes: 'refs' });
  const file = path.join(outDir, rtl ? 'selftest-rtl.pptx' : 'selftest-ltr.pptx');
  await EA.save(pres, file, { strict: true });
  return file;
}

(async () => {
  const outDir = process.argv[2] || process.cwd();
  for (const rtl of [false, true]) console.log('PASS', await build(rtl, outDir));
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
