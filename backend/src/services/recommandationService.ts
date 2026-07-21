import { produitRepository } from "../repositories/produitRepository";
import { getStrategie, type StrategieNom } from "../engine/scoring";
import { normaliser } from "../engine/normalize";
import * as pipeline from "../engine/pipeline";
import type { Critere, Filtre, Produit } from "../engine/types";

const CRITERES: Critere[] = [
  { attr: "prix", direction: "min" },
  { attr: "autonomie", direction: "max" },
  { attr: "puissance", direction: "max" },
  { attr: "qualite", direction: "max" },
];

interface RecommandationParams {
  favorisIds: number[];
  strategieNom?: StrategieNom;
  filtres?: Filtre<Produit>[];
}

export async function recommander({
  favorisIds,
  strategieNom = "barycentre",
  filtres,
}: RecommandationParams) {
  const catalogue = await produitRepository.findAll();

  const favorisSet = new Set(favorisIds);
  const favorisNorm = normaliser(catalogue, CRITERES).filter((p) =>
    favorisSet.has(p.id),
  );
  if (favorisNorm.length === 0) throw new Error("Aucun favori valide fourni");

  const strategie = getStrategie(strategieNom);
  const profil = strategie.construireProfil?.(favorisNorm, CRITERES) ?? null;

  return pipeline.executer({
    items: catalogue,
    criteres: CRITERES,
    filtres,
    strategie,
    contexte: { profil, criteres: CRITERES },
  });
}
