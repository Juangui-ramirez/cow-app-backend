import "dotenv/config"
import express from "express";
import cors from "cors";
import GroupRouter from "./routes/group.router.js";


//config
const app = express();
const PORT = process.env.PORT || 3000;

//config
app.use(express.json());
app.use(cors());
app.use("/groups", GroupRouter().registerRoutes());


//main
app.listen(PORT, () => {
  console.info(`Express server running at http://localhost:${PORT} 🚀`);
});
