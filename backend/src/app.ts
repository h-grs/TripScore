import express from "express";
import offerRoutes from "./routes/offerRoutes";

const app = express();
app.use(express.json());
app.use("/", offerRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));
