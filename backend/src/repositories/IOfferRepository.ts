import { Offer } from "../models/Offer";

export interface IOfferRepository {
  findAll(): Promise<Offer[]>;
}
