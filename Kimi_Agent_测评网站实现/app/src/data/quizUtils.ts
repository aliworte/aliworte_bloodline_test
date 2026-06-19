import { questions, RACES, RACE_COLORS } from './questions';
import { getResultText, getResultTitle, getResultSubtitle } from './results';

export { RACE_COLORS };

export interface QuizResult {
  scores: Record<string, number>;
  sorted: { race: string; score: number }[];
  bloodlineType: string;
  bloodlineRaces: string[];
  blessing: string | null;
  resultTitle: string;
  resultSubtitle: string;
  resultText: string;
}

const CONFIG = {
  totalQuestions: 18,
  pointsPerQuestion: 15,
  maxScorePerRace: 180,
  thresholds: {
    pure: 150,
    dual: 75,
    tri: 30,
  },
};

export function calculateResult(answers: number[]): QuizResult {
  // answers: 每题选中的选项索引(0-3)，共18个
  const scores: Record<string, number> = {};
  RACES.forEach(r => { scores[r] = 0; });

  // 累加分数
  answers.forEach((optionIdx, questionIdx) => {
    const question = questions[questionIdx];
    if (question && question.options[optionIdx]) {
      const race = question.options[optionIdx].race;
      scores[race] += CONFIG.pointsPerQuestion;
    }
  });

  // 按分数排序
  const sorted = RACES.map(r => ({ race: r, score: scores[r] }))
    .sort((a, b) => b.score - a.score);

  const [s0, s1, s2] = sorted;
  const thr = CONFIG.thresholds;

  // 判定血统类型
  let bloodlineType: string;
  let bloodlineRaces: string[] = [];

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

  // 判定赐福方向：从bloodlineRaces涉及的族中取分数最高的（排除人类）
  let blessing: string | null = null;
  const eligibleRaces = bloodlineRaces.filter(r => r !== 'human');

  if (eligibleRaces.length > 0) {
    // 取eligibleRaces中分数最高的
    const candidates = eligibleRaces
      .map(r => ({ race: r, score: scores[r] }))
      .sort((a, b) => b.score - a.score);
    blessing = candidates[0].race;
  }

  const resultTitle = getResultTitle(bloodlineType, bloodlineRaces, blessing);
  const resultSubtitle = getResultSubtitle(bloodlineType, bloodlineRaces, blessing);
  const resultText = getResultText(bloodlineType, bloodlineRaces, blessing);

  return {
    scores,
    sorted,
    bloodlineType,
    bloodlineRaces,
    blessing,
    resultTitle,
    resultSubtitle,
    resultText,
  };
}

// 生成分享文本
export function generateShareText(result: QuizResult): string {
  return `我在「艾利沃特血脉测试」中的结果是：${result.resultTitle}\n${result.resultSubtitle}。${result.resultText.slice(0, 50)}...\n你在另一个世界长什么样？快来测测吧！`;
}
