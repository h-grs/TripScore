import { IOfferRepository } from "./IOfferRepository";
import { Offer } from "../models/Offer";

const DATA: Offer[] = [
  {
    id: "1",
    destination: "Lisbonne",
    type: "flight",
    category: "budget",
    price: 89,
    rating: 4.2,
  },
  {
    id: "2",
    destination: "Bali",
    type: "package",
    category: "luxury",
    price: 1450,
    rating: 4.8,
    durationDays: 10,
  },
  {
    id: "3",
    destination: "Marrakech",
    type: "hotel",
    category: "standard",
    price: 320,
    rating: 3.9,
    durationDays: 4,
  },
];

export class MockOfferRepository implements IOfferRepository {
  async findAll(): Promise<Offer[]> {
    return DATA;
  }
}
