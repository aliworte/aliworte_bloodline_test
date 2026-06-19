export type RaceKey = 'elf' | 'beast' | 'mer' | 'ghost' | 'dwarf' | 'human';

export interface RaceInfo {
  name: string;
  sub: string;
  innate: string;
  blessing: string;
  ekura: string;
}

export interface Option {
  label: string;
  race: RaceKey;
  text: string;
  blessing: RaceKey | null;
}

export interface Question {
  id: number;
  races: RaceKey[];
  text: string;
  options: Option[];
}

export interface Config {
  totalQuestions: number;
  pointsPerQuestion: number;
  racesPerQuestion: number;
  maxScorePerRace: number;
  thresholds: {
    pure: number;
    dual: number;
    tri: number;
  };
}

export type BloodlineType = '纯血' | '双血脉' | '三血脉' | '混沌未分化';

export interface CalculationResult {
  scores: Record<RaceKey, number>;
  sorted: { race: RaceKey; score: number }[];
  bloodlineType: BloodlineType;
  bloodlineRaces: RaceKey[];
  blessing: RaceKey | null;
  blessingCount: Record<RaceKey, number>;
}
