import type { Config, RaceKey, RaceInfo, Question } from '@/types/quiz';

export const CONFIG: Config = {
  totalQuestions: 18,
  pointsPerQuestion: 15,
  racesPerQuestion: 4,
  maxScorePerRace: 180,
  thresholds: {
    pure: 150,
    dual: 75,
    tri: 30,
  },
};

export const RACES: RaceKey[] = ['elf', 'beast', 'mer', 'ghost', 'dwarf', 'human'];

export const RACE_DATA: Record<RaceKey, RaceInfo> = {
  elf:   { name: '种族一',  sub: '精灵', innate: '尖耳',  blessing: '翅膀',       ekura: '圣树' },
  beast: { name: '种族二',  sub: '兽人', innate: '兽瞳',  blessing: '兽耳、兽尾', ekura: '阴阳龙' },
  mer:   { name: '种族三',  sub: '人鱼', innate: '鳞片',  blessing: '鱼耳、鱼尾', ekura: '珍珠贝' },
  ghost: { name: '种族四',  sub: '鬼族', innate: '夜视',  blessing: '蝠翼、鬼角', ekura: '永夜镜湖' },
  dwarf: { name: '种族五',  sub: '矮人', innate: '矮小',  blessing: '怪力、金属化', ekura: '地脉晶心' },
  human: { name: '种族六',  sub: '人类', innate: '无',   blessing: '无赐福',     ekura: '无' },
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    races: ['elf', 'beast', 'mer', 'ghost'],
    text: '问题一',
    options: [
      { label: '1A', race: 'elf',   text: '选择A',   blessing: 'elf' },
      { label: '1B', race: 'beast', text: '选择B',   blessing: 'beast' },
      { label: '1C', race: 'mer',   text: '选择C',   blessing: 'mer' },
      { label: '1D', race: 'ghost', text: '选择D',   blessing: 'ghost' },
    ],
  },
  {
    id: 2,
    races: ['elf', 'beast', 'mer', 'dwarf'],
    text: '问题二',
    options: [
      { label: '2A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '2B', race: 'beast', text: '选择B', blessing: 'beast' },
      { label: '2C', race: 'mer',   text: '选择C', blessing: 'mer' },
      { label: '2D', race: 'dwarf', text: '选择D', blessing: 'dwarf' },
    ],
  },
  {
    id: 3,
    races: ['elf', 'beast', 'mer', 'human'],
    text: '问题三',
    options: [
      { label: '3A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '3B', race: 'beast', text: '选择B', blessing: 'beast' },
      { label: '3C', race: 'mer',   text: '选择C', blessing: 'mer' },
      { label: '3D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 4,
    races: ['elf', 'beast', 'ghost', 'dwarf'],
    text: '问题四',
    options: [
      { label: '4A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '4B', race: 'beast', text: '选择B', blessing: 'beast' },
      { label: '4C', race: 'ghost', text: '选择C', blessing: 'ghost' },
      { label: '4D', race: 'dwarf', text: '选择D', blessing: 'dwarf' },
    ],
  },
  {
    id: 5,
    races: ['elf', 'beast', 'ghost', 'human'],
    text: '问题五',
    options: [
      { label: '5A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '5B', race: 'beast', text: '选择B', blessing: 'beast' },
      { label: '5C', race: 'ghost', text: '选择C', blessing: 'ghost' },
      { label: '5D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 6,
    races: ['elf', 'beast', 'dwarf', 'human'],
    text: '问题六',
    options: [
      { label: '6A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '6B', race: 'beast', text: '选择B', blessing: 'beast' },
      { label: '6C', race: 'dwarf', text: '选择C', blessing: 'dwarf' },
      { label: '6D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 7,
    races: ['elf', 'mer', 'ghost', 'dwarf'],
    text: '问题七',
    options: [
      { label: '7A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '7B', race: 'mer',   text: '选择B', blessing: 'mer' },
      { label: '7C', race: 'ghost', text: '选择C', blessing: 'ghost' },
      { label: '7D', race: 'dwarf', text: '选择D', blessing: 'dwarf' },
    ],
  },
  {
    id: 8,
    races: ['elf', 'mer', 'ghost', 'human'],
    text: '问题八',
    options: [
      { label: '8A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '8B', race: 'mer',   text: '选择B', blessing: 'mer' },
      { label: '8C', race: 'ghost', text: '选择C', blessing: 'ghost' },
      { label: '8D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 9,
    races: ['elf', 'mer', 'dwarf', 'human'],
    text: '问题九',
    options: [
      { label: '9A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '9B', race: 'mer',   text: '选择B', blessing: 'mer' },
      { label: '9C', race: 'dwarf', text: '选择C', blessing: 'dwarf' },
      { label: '9D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 10,
    races: ['elf', 'ghost', 'dwarf', 'human'],
    text: '问题十',
    options: [
      { label: '10A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '10B', race: 'ghost', text: '选择B', blessing: 'ghost' },
      { label: '10C', race: 'dwarf', text: '选择C', blessing: 'dwarf' },
      { label: '10D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 11,
    races: ['beast', 'mer', 'ghost', 'dwarf'],
    text: '问题十一',
    options: [
      { label: '11A', race: 'beast', text: '选择A', blessing: 'beast' },
      { label: '11B', race: 'mer',   text: '选择B', blessing: 'mer' },
      { label: '11C', race: 'ghost', text: '选择C', blessing: 'ghost' },
      { label: '11D', race: 'dwarf', text: '选择D', blessing: 'dwarf' },
    ],
  },
  {
    id: 12,
    races: ['beast', 'mer', 'ghost', 'human'],
    text: '问题十二',
    options: [
      { label: '12A', race: 'beast', text: '选择A', blessing: 'beast' },
      { label: '12B', race: 'mer',   text: '选择B', blessing: 'mer' },
      { label: '12C', race: 'ghost', text: '选择C', blessing: 'ghost' },
      { label: '12D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 13,
    races: ['beast', 'mer', 'dwarf', 'human'],
    text: '问题十三',
    options: [
      { label: '13A', race: 'beast', text: '选择A', blessing: 'beast' },
      { label: '13B', race: 'mer',   text: '选择B', blessing: 'mer' },
      { label: '13C', race: 'dwarf', text: '选择C', blessing: 'dwarf' },
      { label: '13D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 14,
    races: ['beast', 'ghost', 'dwarf', 'human'],
    text: '问题十四',
    options: [
      { label: '14A', race: 'beast', text: '选择A', blessing: 'beast' },
      { label: '14B', race: 'ghost', text: '选择B', blessing: 'ghost' },
      { label: '14C', race: 'dwarf', text: '选择C', blessing: 'dwarf' },
      { label: '14D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 15,
    races: ['mer', 'ghost', 'dwarf', 'human'],
    text: '问题十五',
    options: [
      { label: '15A', race: 'mer',   text: '选择A', blessing: 'mer' },
      { label: '15B', race: 'ghost', text: '选择B', blessing: 'ghost' },
      { label: '15C', race: 'dwarf', text: '选择C', blessing: 'dwarf' },
      { label: '15D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 16,
    races: ['elf', 'beast', 'mer', 'ghost'],
    text: '问题十六',
    options: [
      { label: '16A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '16B', race: 'beast', text: '选择B', blessing: 'beast' },
      { label: '16C', race: 'mer',   text: '选择C', blessing: 'mer' },
      { label: '16D', race: 'ghost', text: '选择D', blessing: 'ghost' },
    ],
  },
  {
    id: 17,
    races: ['elf', 'beast', 'dwarf', 'human'],
    text: '问题十七',
    options: [
      { label: '17A', race: 'elf',   text: '选择A', blessing: 'elf' },
      { label: '17B', race: 'beast', text: '选择B', blessing: 'beast' },
      { label: '17C', race: 'dwarf', text: '选择C', blessing: 'dwarf' },
      { label: '17D', race: 'human', text: '选择D', blessing: null },
    ],
  },
  {
    id: 18,
    races: ['mer', 'ghost', 'dwarf', 'human'],
    text: '问题十八',
    options: [
      { label: '18A', race: 'mer',   text: '选择A', blessing: 'mer' },
      { label: '18B', race: 'ghost', text: '选择B', blessing: 'ghost' },
      { label: '18C', race: 'dwarf', text: '选择C', blessing: 'dwarf' },
      { label: '18D', race: 'human', text: '选择D', blessing: null },
    ],
  },
];
