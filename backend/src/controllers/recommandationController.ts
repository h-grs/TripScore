// src/controllers/recommandationController.ts
import type { Request, Response } from "express";
import type { RecommandationService } from "../services/RecommandationService";
import { estStrategie } from "../engine/scoring";

export function creerRecommandationController(service: RecommandationService) {
  return async function traiter(req: Request, res: Response): Promise<void> {
    const { favoris, strategie } = (req.body ?? {}) as {
      favoris?: unknown;
      strategie?: unknown;
    };

    if (
      !Array.isArray(favoris) ||
      !favoris.every((f) => typeof f === "string" && f.length > 0)
    ) {
      res
        .status(400)
        .json({ error: "favoris: tableau d'ids (string) attendu" });
      return;
    }
    if (
      strategie !== undefined &&
      (typeof strategie !== "string" || !estStrategie(strategie))
    ) {
      res.status(400).json({ error: "stratégie inconnue" });
      return;
    }

    try {
      const resultats = await service.recommander({
        favorisIds: favoris,
        strategieNom: strategie,
      });
      res.status(200).json(resultats);
    } catch (e) {
      res.status(400).json({ error: (e as Error).message });
    }
  };
}
