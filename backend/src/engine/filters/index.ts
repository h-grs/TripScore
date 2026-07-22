import type { FilterCriteria, Offer } from "../../models/Offer";
import type { Filtre } from "../types";

export function depuisCriteres(c: FilterCriteria): Filtre<Offer>[] {
  const filtres: Filtre<Offer>[] = [];
  if (c.maxBudget !== undefined) filtres.push((o) => o.price <= c.maxBudget!);
  if (c.type) filtres.push((o) => o.type === c.type);
  if (c.category) filtres.push((o) => o.category === c.category);
  return filtres;
}
