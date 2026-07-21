import type {
  Normalise,
  Produit,
  ScoringContexte,
  ScoringStrategy,
} from "../types";

const POIDS: Record<string, number> = {
  qualite: 3,
  prix: 2,
  autonomie: 1,
  puissance: 1,
};

export const weightedSumScoring: ScoringStrategy = {
  scorer(item: Normalise<Produit>, { criteres }: ScoringContexte): number {
    return criteres.reduce(
      (s, { attr }) => s + (POIDS[attr] ?? 1) * item._norm[attr],
      0,
    );
  },
};
