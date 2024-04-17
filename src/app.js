import express from "express";
import cors from "cors";
import routerGroup from "./routes/groups.js";


//config
const app = express();
const PORT = 3000;

//config
app.use(express.json());
app.use(cors());
app.use(routerGroup);


//main
app.listen(PORT, () => {
  console.info(`Express server running at http://localhost:${PORT} 🚀`);
});
