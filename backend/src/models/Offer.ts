export interface Offer {
  id: string;
  destination: string;
  type: "flight" | "hotel" | "package";
  category: "budget" | "standard" | "luxury";
  price: number;
  rating: number;
  durationDays?: number;
}

export interface FilterCriteria {
  maxBudget?: number;
  type?: Offer["type"];
  category?: Offer["category"];
  sortBy?: "price" | "rating" | "score";
}
