import { Router } from "express";
import { makeOfferController } from "../controllers/offerController";
import { OfferService } from "../services/OfferService";
import { MockOfferRepository } from "../repositories/MockOfferRepository";

const router = Router();
const service = new OfferService(new MockOfferRepository()); // composition root, temporaire ici
const controller = makeOfferController(service);

router.get("/offers", controller.getOffers);

export default router;
