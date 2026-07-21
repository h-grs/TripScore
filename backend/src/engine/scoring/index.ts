import type { ScoringStrategy } from "../types";
import { barycentreScoring } from "./barycentreScoring";
import { weightedSumScoring } from "./weightedSumScoring";

const STRATEGIES = {
  barycentre: barycentreScoring,
  poids: weightedSumScoring,
} as const satisfies Record<string, ScoringStrategy>;

export type StrategieNom = keyof typeof STRATEGIES;

export function estStrategie(nom: string): nom is StrategieNom {
  return nom in STRATEGIES;
}

export function getStrategie(nom: StrategieNom): ScoringStrategy {
  return STRATEGIES[nom];
}
