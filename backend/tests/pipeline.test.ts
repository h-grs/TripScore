// tests/pipeline.test.ts
import { executer } from "../src/engine/pipeline";
import { normaliser } from "../src/engine/normalize";
import { barycentreScoring } from "../src/engine/scoring/barycentreScoring";
import type { Critere, Produit } from "../src/engine/types";

const CRITERES: Critere[] = [
  { attr: "prix", direction: "min" },
  { attr: "autonomie", direction: "max" },
  { attr: "puissance", direction: "max" },
  { attr: "qualite", direction: "max" },
];

const catalogue: Produit[] = [
  { id: 1, nom: "Casque", prix: 120, autonomie: 9, puissance: 7, qualite: 9 },
  { id: 2, nom: "PC", prix: 1200, autonomie: 7, puissance: 10, qualite: 9 },
  { id: 3, nom: "Souris", prix: 90, autonomie: 10, puissance: 6, qualite: 8 },
  { id: 4, nom: "Écran", prix: 300, autonomie: 5, puissance: 8, qualite: 7 },
];

function recommanderSur(items: Produit[], favorisIds: number[]) {
  const favorisSet = new Set(favorisIds);
  const favorisNorm = normaliser(items, CRITERES).filter((p) =>
    favorisSet.has(p.id),
  );
  const profil = barycentreScoring.construireProfil!(favorisNorm, CRITERES);

  return executer({
    items,
    criteres: CRITERES,
    strategie: barycentreScoring,
    contexte: { profil, criteres: CRITERES },
  });
}

describe("moteur de recommandation", () => {
  it("deux profils différents → deux classements différents", () => {
    const budget = recommanderSur(catalogue, [3]);
    const puissance = recommanderSur(catalogue, [2]);

    expect(budget.map((p) => p.id)).not.toEqual(puissance.map((p) => p.id));
    expect(budget[0]!.id).toBe(3);
    expect(puissance[0]!.id).toBe(2);
  });

  it("le favori lui-même obtient le meilleur score", () => {
    const resultats = recommanderSur(catalogue, [2]);
    expect(resultats[0]!.id).toBe(2); // distance 0 au barycentre de lui-même
  });
});
