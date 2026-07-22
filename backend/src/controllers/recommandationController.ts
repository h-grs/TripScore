import type { ServerResponse } from "node:http";
import type { RecommandationService } from "../services/recommandationService";
import { estStrategie } from "../engine/scoring";

export function creerRecommandationController(service: RecommandationService) {
  return async function traiter(
    body: unknown,
    res: ServerResponse,
  ): Promise<void> {
    const { favoris, strategie } = (body ?? {}) as {
      favoris?: unknown;
      strategie?: unknown;
    };

    if (
      !Array.isArray(favoris) ||
      !favoris.every((f) => typeof f === "string" && f.length > 0)
    ) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return void res.end(
        JSON.stringify({ error: "favoris: tableau d'ids (string) attendu" }),
      );
    }
    if (
      strategie !== undefined &&
      (typeof strategie !== "string" || !estStrategie(strategie))
    ) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return void res.end(JSON.stringify({ error: "stratégie inconnue" }));
    }

    try {
      const resultats = await service.recommander({
        favorisIds: favoris,
        strategieNom: strategie,
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(resultats));
    } catch (e) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: (e as Error).message }));
    }
  };
}
