import { API } from "./config";
import type { OfferScored } from "../types";

export async function fetchRecommandations(
  favoris: string[],
  strategie: "barycentre" | "poids" = "barycentre",
): Promise<OfferScored[]> {
  const rep = await fetch(`${API}/api/recommandations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favoris, strategie }),
  });
  if (!rep.ok) {
    const corps = await rep.json().catch(() => null);
    throw new Error(corps?.error ?? "Erreur API recommandations");
  }
  return rep.json();
}
