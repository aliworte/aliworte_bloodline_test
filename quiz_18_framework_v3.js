/**
 * 艾利沃特血脉测试 - 框架 v3
 * 18题 × 15分 | 绝对分数判定 | 每题4选项（涉及固定4族）
 *
 * 核心变化（相比v2）：
 * - 题目从15题扩展到18题
 * - 每题只有4个选项，对应固定4个种族（不再是6选1）
 * - 分值改为每题+15，每族出现12次，单族满分180
 * - 阈值改为绝对分数：纯血≥150 / 双血脉各≥75 / 三血脉各≥30
 * - 三血脉无需白名单限制，任意三族达标即可
 * - 赐福判定逻辑保持不变
 */

// ─── 基础配置 ───────────────────────────────────────────
const CONFIG = {
  totalQuestions: 18,
  pointsPerQuestion: 15,
  racesPerQuestion: 4,
  maxScorePerRace: 180,   // 12次出现 × 15分
  thresholds: {
    pure: 150,   // 单族≥150 → 纯血
    dual:  75,   // 两族各≥75，且无族≥150 → 双血脉
    tri:   30,   // 三族各≥30，且无族≥75  → 三血脉
  }
};

// ─── 种族数据 ────────────────────────────────────────────
const RACES = ['elf', 'beast', 'mer', 'ghost', 'dwarf', 'human'];

const RACE_DATA = {
  elf:   { name: '阿莎那',  sub: '精灵', innate: '尖耳',  blessing: '翅膀',       ekura: '圣树' },
  beast: { name: '玛瑞维',  sub: '兽人', innate: '兽瞳',  blessing: '兽耳、兽尾', ekura: '阴阳龙' },
  mer:   { name: '蒙佩洛',  sub: '人鱼', innate: '鳞片',  blessing: '鱼耳、鱼尾', ekura: '珍珠贝' },
  ghost: { name: '迪门特',  sub: '鬼族', innate: '夜视',  blessing: '蝠翼、鬼角', ekura: '永夜镜湖' },
  dwarf: { name: '多瑞斯',  sub: '矮人', innate: '矮小',  blessing: '怪力、金属化', ekura: '地脉晶心' },
  human: { name: '伊亚迪克', sub: '人类', innate: '无',   blessing: '无赐福',     ekura: '无' }
};

// ─── 题目结构说明 ────────────────────────────────────────
//
// 18题分组规则：
//   - 共15种不重复的C(6,4)四族组合，加3道重复题，共18题
//   - 每族恰好出现12次（均匀分布）
//   - 重复的3道题：题1、题6、题15（内容相同族群，文案写成不同情境）
//
// 每题结构：
//   - 4个选项，每个选项对应题目涉及的其中1个种族
//   - 玩家选中某选项 → 该族 +15分，其余 +0
//   - 选项无赐福权重之分，赐福由 blessing 字段单独标注
//
// 选项标签格式：`${题号}${A/B/C/D}`，对应4族固定顺序
// 族顺序参照 RACES 数组中的相对顺序（elf < beast < mer < ghost < dwarf < human）

const QUESTIONS = [
  // ── 题1（精灵/兽人/人鱼/鬼族）────────────────────────
  {
    id: 1,
    races: ['elf', 'beast', 'mer', 'ghost'],
    text: '【问题1】你最向往居住在什么地方？',
    options: [
      { label: '1A', race: 'elf',   text: '树冠之上的精灵树城',   blessing: 'elf' },
      { label: '1B', race: 'beast', text: '广袤无垠的野性草原',   blessing: 'beast' },
      { label: '1C', race: 'mer',   text: '深海之下的珊瑚宫殿',   blessing: 'mer' },
      { label: '1D', race: 'ghost', text: '永夜笼罩的镜雾湖畔',   blessing: 'ghost' },
    ]
  },
  // ── 题2（精灵/兽人/人鱼/矮人）────────────────────────
  {
    id: 2,
    races: ['elf', 'beast', 'mer', 'dwarf'],
    text: '【问题2】清晨醒来，你最先注意到的是？',
    options: [
      { label: '2A', race: 'elf',   text: '窗外树叶上露珠折射的七彩光芒', blessing: 'elf' },
      { label: '2B', race: 'beast', text: '远处传来的野兽低吼与鸟鸣',     blessing: 'beast' },
      { label: '2C', race: 'mer',   text: '空气中潮湿的咸味与潮汐声',     blessing: 'mer' },
      { label: '2D', race: 'dwarf', text: '石壁传来的地脉震动与金属敲击', blessing: 'dwarf' },
    ]
  },
  // ── 题3（精灵/兽人/人鱼/人类）────────────────────────
  {
    id: 3,
    races: ['elf', 'beast', 'mer', 'human'],
    text: '【问题3】如果必须离开家乡，你会选择前往？',
    options: [
      { label: '3A', race: 'elf',   text: '传说中圣树守护的永春之谷', blessing: 'elf' },
      { label: '3B', race: 'beast', text: '阴阳龙盘踞的龙脊山脉',     blessing: 'beast' },
      { label: '3C', race: 'mer',   text: '珍珠贝沉没的遗忘海沟',     blessing: 'mer' },
      { label: '3D', race: 'human', text: '悬陵学院所在的求知之都',   blessing: null },
    ]
  },
  // ── 题4（精灵/兽人/鬼族/矮人）────────────────────────
  {
    id: 4,
    races: ['elf', 'beast', 'ghost', 'dwarf'],
    text: '【问题4】面对突如其来的危险，你的第一反应是？',
    options: [
      { label: '4A', race: 'elf',   text: '冷静分析局势，寻找最优解',   blessing: 'elf' },
      { label: '4B', race: 'beast', text: '凭本能咆哮，准备正面迎击',   blessing: 'beast' },
      { label: '4C', race: 'ghost', text: '完全隐匿气息，等待时机',     blessing: 'ghost' },
      { label: '4D', race: 'dwarf', text: '筑起防御，保护身边同伴',     blessing: 'dwarf' },
    ]
  },
  // ── 题5（精灵/兽人/鬼族/人类）────────────────────────
  {
    id: 5,
    races: ['elf', 'beast', 'ghost', 'human'],
    text: '【问题5】以下哪种气味让你感到安心？',
    options: [
      { label: '5A', race: 'elf',   text: '雨后森林的泥土与花香',     blessing: 'elf' },
      { label: '5B', race: 'beast', text: '皮毛与阳光晒过的干草',     blessing: 'beast' },
      { label: '5C', race: 'ghost', text: '冷冽的湖水与夜雾湿气',     blessing: 'ghost' },
      { label: '5D', race: 'human', text: '刚出炉的面包与烟火气息',   blessing: null },
    ]
  },
  // ── 题6（精灵/兽人/矮人/人类）────────────────────────
  {
    id: 6,
    races: ['elf', 'beast', 'dwarf', 'human'],
    text: '【问题6】你更倾向于如何度过闲暇时光？',
    options: [
      { label: '6A', race: 'elf',   text: '在古树顶端冥想，聆听风声',   blessing: 'elf' },
      { label: '6B', race: 'beast', text: '追逐猎物，在旷野中奔跑',     blessing: 'beast' },
      { label: '6C', race: 'dwarf', text: '锻造器具，雕琢宝石',         blessing: 'dwarf' },
      { label: '6D', race: 'human', text: '与朋友聚会，交换故事',       blessing: null },
    ]
  },
  // ── 题7（精灵/人鱼/鬼族/矮人）────────────────────────
  {
    id: 7,
    races: ['elf', 'mer', 'ghost', 'dwarf'],
    text: '【问题7】你认为一个人最重要的品质是？',
    options: [
      { label: '7A', race: 'elf',   text: '优雅与智慧，顺应自然的韵律', blessing: 'elf' },
      { label: '7B', race: 'mer',   text: '包容与柔韧，如水流适应万物', blessing: 'mer' },
      { label: '7C', race: 'ghost', text: '神秘与洞察，看透表象的本质', blessing: 'ghost' },
      { label: '7D', race: 'dwarf', text: '坚韧与务实，用双手铸造未来', blessing: 'dwarf' },
    ]
  },
  // ── 题8（精灵/人鱼/鬼族/人类）────────────────────────
  {
    id: 8,
    races: ['elf', 'mer', 'ghost', 'human'],
    text: '【问题8】如果可以获得一种能力，你会选择？',
    options: [
      { label: '8A', race: 'elf',   text: '与植物沟通，让花朵随心情绽放',   blessing: 'elf' },
      { label: '8B', race: 'mer',   text: '在水下呼吸，听懂鲸歌的含义',     blessing: 'mer' },
      { label: '8C', race: 'ghost', text: '穿越阴影，在黑暗中视物如昼',     blessing: 'ghost' },
      { label: '8D', race: 'human', text: '快速学习任何技能，与任何人交朋友', blessing: null },
    ]
  },
  // ── 题9（精灵/人鱼/矮人/人类）────────────────────────
  {
    id: 9,
    races: ['elf', 'mer', 'dwarf', 'human'],
    text: '【问题9】以下哪种音乐最吸引你？',
    options: [
      { label: '9A', race: 'elf',   text: '风穿过树叶的空灵竖琴',     blessing: 'elf' },
      { label: '9B', race: 'mer',   text: '深海鲸鸣与潮汐的韵律',     blessing: 'mer' },
      { label: '9C', race: 'dwarf', text: '铁锤敲击铁砧的铿锵节奏',   blessing: 'dwarf' },
      { label: '9D', race: 'human', text: '街头艺人的欢快民谣',       blessing: null },
    ]
  },
  // ── 题10（精灵/鬼族/矮人/人类）───────────────────────
  {
    id: 10,
    races: ['elf', 'ghost', 'dwarf', 'human'],
    text: '【问题10】在群体中，你通常扮演什么角色？',
    options: [
      { label: '10A', race: 'elf',   text: '旁观者，在边缘静静观察一切', blessing: 'elf' },
      { label: '10B', race: 'ghost', text: '幕后，操纵局势却不被察觉', blessing: 'ghost' },
      { label: '10C', race: 'dwarf', text: '支柱，默默承担最重的责任', blessing: 'dwarf' },
      { label: '10D', race: 'human', text: '核心，把大家凝聚在一起',   blessing: null },
    ]
  },
  // ── 题11（兽人/人鱼/鬼族/矮人）───────────────────────
  {
    id: 11,
    races: ['beast', 'mer', 'ghost', 'dwarf'],
    text: '【问题11】你理想的伴侣/伙伴应该？',
    options: [
      { label: '11A', race: 'beast', text: '陪你一起冒险，无所畏惧',   blessing: 'beast' },
      { label: '11B', race: 'mer',   text: '给你空间，也随时等你归来', blessing: 'mer' },
      { label: '11C', race: 'ghost', text: '与你共享秘密，不问过去',   blessing: 'ghost' },
      { label: '11D', race: 'dwarf', text: '可靠踏实，说到一定做到',   blessing: 'dwarf' },
    ]
  },
  // ── 题12（兽人/人鱼/鬼族/人类）───────────────────────
  {
    id: 12,
    races: ['beast', 'mer', 'ghost', 'human'],
    text: '【问题12】当朋友向你倾诉烦恼时，你会？',
    options: [
      { label: '12A', race: 'beast', text: '拍拍肩膀，拉他去喝酒发泄',   blessing: 'beast' },
      { label: '12B', race: 'mer',   text: '静静倾听，像海水包容一切',   blessing: 'mer' },
      { label: '12C', race: 'ghost', text: '给出犀利建议，直指问题核心', blessing: 'ghost' },
      { label: '12D', race: 'human', text: '陪伴左右，让他知道不孤单',   blessing: null },
    ]
  },
  // ── 题13（兽人/人鱼/矮人/人类）───────────────────────
  {
    id: 13,
    races: ['beast', 'mer', 'dwarf', 'human'],
    text: '【问题13】如果生命只剩最后一天，你会？',
    options: [
      { label: '13A', race: 'beast', text: '奔向最高的山巅，对风长啸',    blessing: 'beast' },
      { label: '13B', race: 'mer',   text: '潜入最深的海沟，归于宁静',    blessing: 'mer' },
      { label: '13C', race: 'dwarf', text: '完成最后一件作品，刻下名字',  blessing: 'dwarf' },
      { label: '13D', race: 'human', text: '与所有爱的人围坐，分享故事',  blessing: null },
    ]
  },
  // ── 题14（兽人/鬼族/矮人/人类）───────────────────────
  {
    id: 14,
    races: ['beast', 'ghost', 'dwarf', 'human'],
    text: '【问题14】你内心深处最恐惧的是？',
    options: [
      { label: '14A', race: 'beast', text: '被束缚，失去自由奔跑的权利',  blessing: 'beast' },
      { label: '14B', race: 'ghost', text: '被看穿，再无秘密可言',        blessing: 'ghost' },
      { label: '14C', race: 'dwarf', text: '传承断绝，技艺无人继承',      blessing: 'dwarf' },
      { label: '14D', race: 'human', text: '孤独终老，无人记得你来过',    blessing: null },
    ]
  },
  // ── 题15（人鱼/鬼族/矮人/人类）───────────────────────
  {
    id: 15,
    races: ['mer', 'ghost', 'dwarf', 'human'],
    text: '【问题15】如果可以为这个世界留下一样东西，你会选择？',
    options: [
      { label: '15A', race: 'mer',   text: '一条连接所有海域的航道',     blessing: 'mer' },
      { label: '15B', race: 'ghost', text: '一面映照真相的神秘镜子',     blessing: 'ghost' },
      { label: '15C', race: 'dwarf', text: '一座屹立千年的坚固要塞',     blessing: 'dwarf' },
      { label: '15D', race: 'human', text: '一个让所有人都能安睡的故事', blessing: null },
    ]
  },
  // ── 题16（精灵/兽人/人鱼/鬼族，重复题1族群，文案不同）
  {
    id: 16,
    races: ['elf', 'beast', 'mer', 'ghost'],
    text: '【问题16】旅途中迷路，你更倾向于？',
    options: [
      { label: '16A', race: 'elf',   text: '攀上最高的树，观察远处的地形', blessing: 'elf' },
      { label: '16B', race: 'beast', text: '依靠本能追踪气味与足迹',       blessing: 'beast' },
      { label: '16C', race: 'mer',   text: '寻找水流，顺流而下总有出路',   blessing: 'mer' },
      { label: '16D', race: 'ghost', text: '等待夜晚，在黑暗中更容易感知方向', blessing: 'ghost' },
    ]
  },
  // ── 题17（精灵/兽人/矮人/人类，重复题6族群，文案不同）
  {
    id: 17,
    races: ['elf', 'beast', 'dwarf', 'human'],
    text: '【问题17】你最享受哪种胜利的感觉？',
    options: [
      { label: '17A', race: 'elf',   text: '找到了别人从未发现的隐秘真相', blessing: 'elf' },
      { label: '17B', race: 'beast', text: '在激烈的对抗中压倒对手',       blessing: 'beast' },
      { label: '17C', race: 'dwarf', text: '亲手完成一件无可挑剔的作品',   blessing: 'dwarf' },
      { label: '17D', race: 'human', text: '说服所有人，达成共识',         blessing: null },
    ]
  },
  // ── 题18（人鱼/鬼族/矮人/人类，重复题15族群，文案不同）
  {
    id: 18,
    races: ['mer', 'ghost', 'dwarf', 'human'],
    text: '【问题18】面对别人的误解，你通常会？',
    options: [
      { label: '18A', race: 'mer',   text: '随它去，时间会证明一切',       blessing: 'mer' },
      { label: '18B', race: 'ghost', text: '不解释，让他们继续猜',         blessing: 'ghost' },
      { label: '18C', race: 'dwarf', text: '用行动证明，比言语更有力',     blessing: 'dwarf' },
      { label: '18D', race: 'human', text: '直接说清楚，消除误会',         blessing: null },
    ]
  },
];

// ─── 核心算法：计算结果 ──────────────────────────────────
/**
 * @param {string[]} choices - 玩家选择的选项标签数组，如 ['1A','2C','3B',...]
 * @returns {object} 结果对象
 */
function calculateResult(choices) {
  // 1. 累加分数和赐福计数
  const scores = Object.fromEntries(RACES.map(r => [r, 0]));
  const blessingCount = Object.fromEntries(RACES.map(r => [r, 0]));

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
  let bloodlineType, bloodlineRaces;

  if (s0.score >= thr.pure) {
    bloodlineType = '纯血';
    bloodlineRaces = [s0.race];
  }
  else if (s0.score >= thr.dual && s1.score >= thr.dual) {
    bloodlineType = '双血脉';
    bloodlineRaces = [s0.race, s1.race];
  }
  else if (s0.score >= thr.tri && s1.score >= thr.tri && s2.score >= thr.tri) {
    bloodlineType = '三血脉';
    bloodlineRaces = [s0.race, s1.race, s2.race];
  }
  else {
    bloodlineType = '混沌未分化';
    bloodlineRaces = [];
  }

  // 4. 判定赐福方向
  // 规则：从 bloodlineRaces 涉及的族中取赐福计数最高的，人类无赐福
  let blessing;
  const eligibleRaces = bloodlineRaces.filter(r => r !== 'human');

  if (eligibleRaces.length === 0) {
    // 纯血人类 或 混沌
    blessing = null;
  } else {
    const candidates = eligibleRaces
      .map(r => ({ race: r, count: blessingCount[r] }))
      .sort((a, b) => b.count - a.count);

    // 平局处理：优先选血统最高分种族的赐福
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

// ─── 结果描述生成（占位，文案后续填入）─────────────────────
/**
 * 根据血统类型+赐福方向生成结果key，用于查表
 * 格式：
 *   纯血    → 'pure_elf'
 *   双血脉  → 'dual_elf_beast'（按RACES顺序排）
 *   三血脉  → 'tri_elf_beast_mer'
 *   混沌    → 'chaos'
 */
function getResultKey(bloodlineType, bloodlineRaces, blessing) {
  const order = r => RACES.indexOf(r);
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

// ─── 导出 ────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG,
    RACES,
    RACE_DATA,
    QUESTIONS,
    calculateResult,
    getResultKey,
  };
}
