import type { FilterCriteria } from "../models/Offer";
import type { IOfferRepository } from "../repositories/IOfferRepository";
import type { Critere } from "../engine/types";
import { getStrategie, type StrategieNom } from "../engine/scoring";
import { depuisCriteres } from "../engine/filters";
import { normaliser } from "../engine/normalize";
import { executer } from "../engine/pipeline";

const CRITERES: Critere[] = [
  { attr: "price", direction: "min" },
  { attr: "rating", direction: "max" },
  { attr: "reviewsCount", direction: "max" },
  { attr: "durationDays", direction: "max" },
];

interface RecommandationParams {
  favorisIds: string[];
  strategieNom?: StrategieNom;
  criteres?: FilterCriteria;
}

export class RecommandationService {
  constructor(private readonly offerRepository: IOfferRepository) {}

  async recommander({
    favorisIds,
    strategieNom = "barycentre",
    criteres,
  }: RecommandationParams) {
    const catalogue = await this.offerRepository.findAll();

    const favorisSet = new Set(favorisIds);
    const favorisNorm = normaliser(catalogue, CRITERES).filter((o) =>
      favorisSet.has(o.id),
    );
    if (favorisNorm.length === 0) throw new Error("Aucun favori valide fourni");

    const strategie = getStrategie(strategieNom);
    const profil = strategie.construireProfil?.(favorisNorm, CRITERES) ?? null;

    return executer({
      items: catalogue,
      criteres: CRITERES,
      filtres: criteres ? depuisCriteres(criteres) : [],
      strategie,
      contexte: { profil, criteres: CRITERES },
    });
  }
}
