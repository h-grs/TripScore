import { API } from "./config";
import type { Offer } from "../types";

export interface OfferFilters {
  maxBudget?: string;
  type?: string;
  sortBy?: string;
}

export async function fetchOffers(filtres: OfferFilters): Promise<Offer[]> {
  const params = new URLSearchParams();
  if (filtres.maxBudget) params.append("maxBudget", filtres.maxBudget);
  if (filtres.type) params.append("type", filtres.type);
  if (filtres.sortBy) params.append("sortBy", filtres.sortBy);

  const res = await fetch(`${API}/offers?${params}`);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error("Erreur lors du chargement des offres");
  return res.json();
}
