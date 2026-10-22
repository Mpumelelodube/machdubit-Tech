export const cameraStops = [
  { position: [7.8, 3.2, 12.8], look: [2.4, 1.4, 4.8] },
  { position: [-.6, 3.2, 10.2], look: [-5, 1.3, 5.6] },
  { position: [6.3, 4.8, 1.7], look: [-2.1, 1, -4.6] },
  { position: [1, 3, -1.8], look: [6, 1.3, -5.5] },
  { position: [-1.5, 3, -6.8], look: [-6.6, 1.5, -10.9] },
  { position: [1.1, 2.8, -8.8], look: [5.8, 1.6, -12.8] },
  { position: [1.7, 3, -12.8], look: [.1, 1.1, -17.4] },
  { position: [2, 3.3, -11.6], look: [-3, 1.1, -15.4] }
];

// The first 30% of each chapter is a deliberate reading stop.
export function journeyProgress(scroll, chapterTops) {
  const last = chapterTops.length - 1;
  let active = 0;
  while (active < last && scroll >= chapterTops[active + 1] - 1) active++;
  if (active === last) return { active, progress: 1 };
  const distance = chapterTops[active + 1] - chapterTops[active];
  const fraction = distance > 0 ? (scroll - chapterTops[active]) / distance : 0;
  const t = Math.max(0, Math.min(1, (fraction - .30) / .70));
  const eased = t * t * t * (t * (t * 6 - 15) + 10);
  return { active, progress: (active + eased) / last };
}
