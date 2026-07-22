import type { Offer } from "../src/models/Offer";
import type { Critere } from "../src/engine/types";
import { normaliser } from "../src/engine/normalize";
import { executer } from "../src/engine/pipeline";
import { barycentreScoring } from "../src/engine/scoring/barycentreScoring";

const CRITERES: Critere[] = [
  { attr: "price", direction: "min" },
  { attr: "rating", direction: "max" },
  { attr: "reviewsCount", direction: "max" },
  { attr: "durationDays", direction: "max" },
];

const catalogue: Offer[] = [
  {
    id: "off-1",
    destination: "Lisbonne",
    type: "flight",
    category: "budget",
    price: 180,
    rating: 4.4,
    durationDays: 3,
    reviewsCount: 850,
  },
  {
    id: "off-2",
    destination: "Japon",
    type: "package",
    category: "luxury",
    price: 2100,
    rating: 4.8,
    durationDays: 14,
    reviewsCount: 2100,
  },
  {
    id: "off-3",
    destination: "Écosse",
    type: "package",
    category: "standard",
    price: 450,
    rating: 4.6,
    durationDays: 7,
    reviewsCount: 320,
  },
  {
    id: "off-4",
    destination: "Baléares",
    type: "hotel",
    category: "budget",
    price: 320,
    rating: 4.1,
    durationDays: 5,
    reviewsCount: 1400,
  },
];

function recommanderSur(items: Offer[], favorisIds: string[]) {
  const favorisSet = new Set(favorisIds);
  const favorisNorm = normaliser(items, CRITERES).filter((o) =>
    favorisSet.has(o.id),
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
    const petitBudget = recommanderSur(catalogue, ["off-1"]);
    const grandVoyage = recommanderSur(catalogue, ["off-2"]);

    expect(petitBudget.map((o) => o.id)).not.toEqual(
      grandVoyage.map((o) => o.id),
    );
    expect(petitBudget[0]!.id).toBe("off-1");
    expect(grandVoyage[0]!.id).toBe("off-2");
  });

  it("le favori lui-même obtient le meilleur score", () => {
    const resultats = recommanderSur(catalogue, ["off-2"]);
    expect(resultats[0]!.id).toBe("off-2");
  });

  it("un profil composite (2 favoris) produit un barycentre intermédiaire", () => {
    const mixte = recommanderSur(catalogue, ["off-1", "off-4"]);
    const posEcosse = mixte.findIndex((o) => o.id === "off-3");
    const posJapon = mixte.findIndex((o) => o.id === "off-2");
    expect(posEcosse).toBeLessThan(posJapon);
  });
});
