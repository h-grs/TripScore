import { OfferService } from "../src/services/OfferService";
import { IOfferRepository } from "../src/repositories/IOfferRepository";
import { Offer } from "../src/models/Offer";

const mockOffers: Offer[] = [
  {
    id: "1",
    destination: "Lisbonne",
    type: "flight",
    category: "budget",
    price: 89,
    rating: 4.2,
    durationDays: 1,
    reviewsCount: 340,
  },
  {
    id: "2",
    destination: "Bali",
    type: "package",
    category: "luxury",
    price: 1450,
    rating: 4.8,
    durationDays: 10,
    reviewsCount: 1250,
  },
  {
    id: "3",
    destination: "Marrakech",
    type: "hotel",
    category: "standard",
    price: 320,
    rating: 3.9,
    durationDays: 4, // il y était déjà
    reviewsCount: 85,
  },
];

class FakeOfferRepository implements IOfferRepository {
  async findAll(): Promise<Offer[]> {
    return mockOffers;
  }
}

describe("OfferService", () => {
  const service = new OfferService(new FakeOfferRepository());

  it("retourne toutes les offres sans filtre", async () => {
    const result = await service.getFiltered({});
    expect(result).toHaveLength(3);
  });

  it("filtre par maxBudget", async () => {
    const result = await service.getFiltered({ maxBudget: 500 });
    expect(result.every((o) => o.price <= 500)).toBe(true);
  });

  it("filtre par type", async () => {
    const result = await service.getFiltered({ type: "flight" });
    expect(result.every((o) => o.type === "flight")).toBe(true);
  });

  it("retourne une liste vide si rien ne matche", async () => {
    const result = await service.getFiltered({ maxBudget: 10 });
    expect(result).toHaveLength(0);
  });
});
