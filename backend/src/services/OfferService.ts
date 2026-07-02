import { IOfferRepository } from "../repositories/IOfferRepository";
import { Offer, FilterCriteria } from "../models/Offer";

export class OfferService {
  constructor(private repo: IOfferRepository) {}

  async getFiltered(criteria: FilterCriteria): Promise<Offer[]> {
    const offers = await this.repo.findAll();
    const filtered = offers.filter((o) => this.matches(o, criteria));
    return filtered.sort(
      (a, b) => this.sortValue(b, criteria) - this.sortValue(a, criteria),
    );
  }

  private matches(o: Offer, c: FilterCriteria): boolean {
    if (c.maxBudget && o.price > c.maxBudget) return false;
    if (c.type && o.type !== c.type) return false;
    if (c.category && o.category !== c.category) return false;
    return true;
  }

  private sortValue(o: Offer, c: FilterCriteria): number {
    if (c.sortBy === "price") return -o.price; // moins cher en premier
    if (c.sortBy === "rating") return o.rating;
    return this.score(o); // défaut : score prix/qualité
  }

  private score(o: Offer): number {
    return o.rating / (o.price / 100);
  }
}
