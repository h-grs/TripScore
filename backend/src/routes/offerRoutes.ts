import { Router } from "express";
import { makeOfferController } from "../controllers/offerController";
import { OfferService } from "../services/OfferService";

export default function offerRouter(service: OfferService) {
  const router = Router();
  const controller = makeOfferController(service);
  router.get("/offers", controller.getOffers);
  return router;
}
