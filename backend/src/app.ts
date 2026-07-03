import express from "express";
import cors from "cors";
import { OfferService } from "./services/OfferService";
import { MockOfferRepository } from "./repositories/MockOfferRepository";
import { SqlOfferRepository } from "./repositories/SqlOfferRepository";
import offerRouter from "./routes/offerRoutes";

const app = express();
app.use(cors());
app.use(express.json());

const repo =
  process.env.USE_DB === "true"
    ? new SqlOfferRepository()
    : new MockOfferRepository();

const service = new OfferService(repo);
app.use("/", offerRouter(service));

const PORT = 3000;
app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));
