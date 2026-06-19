import type { CalculationResult, RaceKey } from '@/types/quiz';
import { CONFIG, RACES, QUESTIONS } from '@/data/quizData';

export function calculateResult(choices: string[]): CalculationResult {
  // 1. 累加分数和赐福计数
  const scores = Object.fromEntries(RACES.map(r => [r, 0])) as Record<RaceKey, number>;
  const blessingCount = Object.fromEntries(RACES.map(r => [r, 0])) as Record<RaceKey, number>;

  for (const choiceLabel of choices) {
    for (const q of QUESTIONS) {
      const opt = q.options.find(o => o.label === choiceLabel);
      if (opt) {
        scores[opt.race] += CONFIG.pointsPerQuestion;
        if (opt.blessing) blessingCount[opt.blessing]++;
        break;
      }
    }
  }

  // 2. 按分数排序
  const sorted = RACES
    .map(r => ({ race: r, score: scores[r] }))
    .sort((a, b) => b.score - a.score);

  const [s0, s1, s2] = sorted;
  const thr = CONFIG.thresholds;

  // 3. 判定血统类型（优先级：纯血 > 双血脉 > 三血脉 > 混沌）
  let bloodlineType: CalculationResult['bloodlineType'];
  let bloodlineRaces: RaceKey[];

  if (s0.score >= thr.pure) {
    bloodlineType = '纯血';
    bloodlineRaces = [s0.race];
  } else if (s0.score >= thr.dual && s1.score >= thr.dual) {
    bloodlineType = '双血脉';
    bloodlineRaces = [s0.race, s1.race];
  } else if (s0.score >= thr.tri && s1.score >= thr.tri && s2.score >= thr.tri) {
    bloodlineType = '三血脉';
    bloodlineRaces = [s0.race, s1.race, s2.race];
  } else {
    bloodlineType = '混沌未分化';
    bloodlineRaces = [];
  }

  // 4. 判定赐福方向
  let blessing: RaceKey | null;
  const eligibleRaces = bloodlineRaces.filter(r => r !== 'human');

  if (eligibleRaces.length === 0) {
    blessing = null;
  } else {
    const candidates = eligibleRaces
      .map(r => ({ race: r, count: blessingCount[r] }))
      .sort((a, b) => b.count - a.count);

    const topCount = candidates[0].count;
    const tied = candidates.filter(c => c.count === topCount);
    blessing = tied.length === 1
      ? tied[0].race
      : bloodlineRaces.find(r => tied.some(t => t.race === r) && r !== 'human') || tied[0].race;
  }

  return {
    scores,
    sorted,
    bloodlineType,
    bloodlineRaces,
    blessing,
    blessingCount,
  };
}

export function getResultKey(
  bloodlineType: CalculationResult['bloodlineType'],
  bloodlineRaces: RaceKey[],
  blessing: RaceKey | null
): string {
  const order = (r: RaceKey) => RACES.indexOf(r);
  const sorted = [...bloodlineRaces].sort((a, b) => order(a) - order(b));

  if (bloodlineType === '纯血') {
    return `pure_${sorted[0]}`;
  }
  if (bloodlineType === '双血脉') {
    return blessing
      ? `dual_${sorted.join('_')}_blessing_${blessing}`
      : `dual_${sorted.join('_')}`;
  }
  if (bloodlineType === '三血脉') {
    return blessing
      ? `tri_${sorted.join('_')}_blessing_${blessing}`
      : `tri_${sorted.join('_')}`;
  }
  return 'chaos';
}
