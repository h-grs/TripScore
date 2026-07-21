import type {
  Critere,
  Filtre,
  Produit,
  Score,
  Normalise,
  ScoringContexte,
  ScoringStrategy,
} from "./types";
import { normaliser } from "./normalize";

interface PipelineParams {
  items: Produit[];
  criteres: Critere[];
  filtres?: Filtre<Produit>[];
  strategie: ScoringStrategy;
  contexte: ScoringContexte;
}

export function executer({
  items,
  criteres,
  filtres = [],
  strategie,
  contexte,
}: PipelineParams): Score<Normalise<Produit>>[] {
  const filtres_ = items.filter((item) => filtres.every((f) => f(item))); // O(n·p)
  const normalises = normaliser(filtres_, criteres); // O(n·d)
  const scores = normalises.map((item) => ({
    ...item,
    score: strategie.scorer(item, contexte), // O(n·d)
  }));
  return scores.toSorted((a, b) => b.score - a.score); // O(n log n)
}
