import express from "express";
import cors from "cors";
import albumRoutes from "./routes/albums.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/albums", albumRoutes);

/*I was just happy to get this running if I'm being honest*/
app.get("/", (req, res) => {
  res.send("RYM API is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});