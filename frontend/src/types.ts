export interface Offer {
  id: string;
  destination: string;
  type: "flight" | "hotel" | "package";
  category: "budget" | "standard" | "luxury";
  price: number;
  rating: number;
  durationDays: number;
  reviewsCount: number;
}

export type OfferScored = Offer & { score: number };
