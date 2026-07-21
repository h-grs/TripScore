import type { IncomingMessage, ServerResponse } from "node:http";
import { recommander } from "../services/recommandationService";
import { estStrategie } from "../engine/scoring";

interface CorpsRequete {
  favoris: unknown;
  strategie?: unknown;
}

export async function traiterRecommandation(
  body: CorpsRequete,
  res: ServerResponse,
): Promise<void> {
  const { favoris, strategie } = body;

  if (!Array.isArray(favoris) || !favoris.every((f) => Number.isInteger(f))) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return void res.end(
      JSON.stringify({ error: "favoris: tableau d'ids attendu" }),
    );
  }
  if (
    strategie !== undefined &&
    (typeof strategie !== "string" || !estStrategie(strategie))
  ) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return void res.end(JSON.stringify({ error: "stratégie inconnue" }));
  }

  const resultats = await recommander({
    favorisIds: favoris as number[],
    strategieNom: strategie,
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(resultats));
}
