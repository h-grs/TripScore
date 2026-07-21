export interface Produit {
  id: number;
  nom: string;
  prix: number;
  autonomie: number;
  puissance: number;
  qualite: number;
}

export type AttributNumerique = keyof Pick
  Produit,
  "prix" | "autonomie" | "puissance" | "qualite"
>;

export interface Critere {
  attr: AttributNumerique;
  direction: "min" | "max";
}

export type Normalise<T> = T & { _norm: Record<AttributNumerique, number> };

export type Score<T> = T & { score: number };

export type Profil = Record<AttributNumerique, number>;

export type Filtre<T> = (item: T) => boolean;

// LE contrat du Strategy pattern — c'est cette interface que tu montres en revue de code
export interface ScoringStrategy {
  construireProfil?(
    favoris: Normalise<Produit>[],
    criteres: Critere[],
  ): Profil;
  scorer(item: Normalise<Produit>, contexte: ScoringContexte): number;
}

export interface ScoringContexte {
  profil: Profil | null;
  criteres: Critere[];
}
