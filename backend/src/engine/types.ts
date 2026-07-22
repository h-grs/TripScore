import type { Offer } from "../models/Offer";

export type AttributNumerique = keyof Pick<
  Offer,
  "price" | "rating" | "durationDays" | "reviewsCount"
>;

export interface Critere {
  attr: AttributNumerique;
  direction: "min" | "max";
}

export type Normalise<T> = T & { _norm: Record<AttributNumerique, number> };
export type Score<T> = T & { score: number };
export type Profil = Record<AttributNumerique, number>;
export type Filtre<T> = (item: T) => boolean;

export interface ScoringContexte {
  profil: Profil | null;
  criteres: Critere[];
}

export interface ScoringStrategy {
  construireProfil?(favoris: Normalise<Offer>[], criteres: Critere[]): Profil;
  scorer(item: Normalise<Offer>, contexte: ScoringContexte): number;
}
