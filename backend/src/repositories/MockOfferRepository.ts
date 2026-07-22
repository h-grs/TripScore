import { IOfferRepository } from "./IOfferRepository";
import { Offer } from "../models/Offer";

const DATA: Offer[] = [
  {
    id: "1",
    destination: "Lisbonne", // garde tes vraies valeurs, seuls
    type: "flight", // durationDays et reviewsCount sont à ajouter
    category: "budget",
    price: 180,
    rating: 4.2,
    durationDays: 1, // ← vol sec : 1 par convention
    reviewsCount: 340, // ← nouveau
  },
  {
    id: "2",
    destination: "Bali",
    type: "package",
    category: "luxury",
    price: 1450,
    rating: 4.8,
    durationDays: 10,
    reviewsCount: 1250, // ← seul ajout
  },
  {
    id: "3",
    destination: "Marrakech",
    type: "hotel",
    category: "standard",
    price: 320,
    rating: 3.9,
    durationDays: 4,
    reviewsCount: 85, // ← seul ajout
  },
];

export class MockOfferRepository implements IOfferRepository {
  async findAll(): Promise<Offer[]> {
    return DATA;
  }
}
