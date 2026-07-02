import { Request, Response } from "express";
import { OfferService } from "../services/OfferService";

export function makeOfferController(service: OfferService) {
  return {
    async getOffers(req: Request, res: Response) {
      const { maxBudget, type, category, sortBy } = req.query;
      const offers = await service.getFiltered({
        maxBudget: maxBudget ? Number(maxBudget) : undefined,
        type: type as any,
        category: category as any,
        sortBy: sortBy as any,
      });
      if (offers.length === 0)
        return res.status(404).json({ message: "Aucune offre trouvée" });
      res.json(offers);
    },
  };
}
