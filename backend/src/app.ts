import express from "express";
import offerRoutes from "./routes/offerRoutes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", offerRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));
