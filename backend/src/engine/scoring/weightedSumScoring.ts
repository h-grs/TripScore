import type { Offer } from "../../models/Offer";
import type { Normalise, ScoringContexte, ScoringStrategy } from "../types";

const POIDS: Record<string, number> = {
  rating: 3,
  price: 2,
  reviewsCount: 1,
  durationDays: 1,
};

export const weightedSumScoring: ScoringStrategy = {
  scorer(item: Normalise<Offer>, { criteres }: ScoringContexte): number {
    return criteres.reduce(
      (s, { attr }) => s + (POIDS[attr] ?? 1) * item._norm[attr],
      0,
    );
  },
};
