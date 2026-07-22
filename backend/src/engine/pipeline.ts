import type { Offer } from "../models/Offer";
import type {
  Critere,
  Filtre,
  Normalise,
  Score,
  ScoringContexte,
  ScoringStrategy,
} from "./types";
import { normaliser } from "./normalize";

interface PipelineParams {
  items: Offer[];
  criteres: Critere[];
  filtres?: Filtre<Offer>[];
  strategie: ScoringStrategy;
  contexte: ScoringContexte;
}

export function executer({
  items,
  criteres,
  filtres = [],
  strategie,
  contexte,
}: PipelineParams): Score<Normalise<Offer>>[] {
  const filtrees = items.filter((item) => filtres.every((f) => f(item))); // O(n·p)
  const normalisees = normaliser(filtrees, criteres); // O(n·d)
  const scorees = normalisees.map((item) => ({
    ...item,
    score: strategie.scorer(item, contexte), // O(n·d)
  }));
  return scorees.toSorted((a, b) => b.score - a.score); // O(n log n)
}
