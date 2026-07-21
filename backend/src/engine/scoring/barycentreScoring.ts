import type {
  Critere,
  Normalise,
  Produit,
  Profil,
  ScoringContexte,
  ScoringStrategy,
} from "../types";

export const barycentreScoring: ScoringStrategy = {
  construireProfil(favoris: Normalise<Produit>[], criteres: Critere[]): Profil {
    const profil = {} as Profil;
    for (const { attr } of criteres) {
      profil[attr] =
        favoris.reduce((s, f) => s + f._norm[attr], 0) / favoris.length;
    }
    return profil;
  },

  scorer(
    item: Normalise<Produit>,
    { profil, criteres }: ScoringContexte,
  ): number {
    if (!profil) throw new Error("barycentre: profil requis");
    let somme = 0;
    for (const { attr } of criteres) {
      somme += (item._norm[attr] - profil[attr]) ** 2;
    }
    return -Math.sqrt(somme); // distance faible = score haut
  },
};
