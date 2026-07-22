import express from "express";
import cors from "cors";
import { OfferService } from "./services/OfferService";
import { MockOfferRepository } from "./repositories/MockOfferRepository";
import { SqlOfferRepository } from "./repositories/SqlOfferRepository";
import offerRouter from "./routes/offerRoutes";
import { RecommandationService } from "./services/RecommandationService";
import { creerRecommandationController } from "./controllers/recommandationController";

const app = express();
app.use(cors());
app.use(express.json());

const repo =
  process.env.USE_DB === "true"
    ? new SqlOfferRepository()
    : new MockOfferRepository();

// Les deux services partagent la même instance de repository
const service = new OfferService(repo);
const recommandationService = new RecommandationService(repo);

app.use("/", offerRouter(service));
app.post(
  "/api/recommandations",
  creerRecommandationController(recommandationService),
);

const PORT = 3000;
app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));
