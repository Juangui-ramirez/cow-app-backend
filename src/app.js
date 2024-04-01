const express = require("express");
const cors = require("cors");
const petRouter = require("./routes/pets");
const routerGroup = require("./routes/groups");


//config
const app = express();
const PORT = 3000;

//config
app.use(express.json());
app.use(cors());
app.use(petRouter);
app.use(routerGroup);


//main
app.listen(PORT, () => {
  console.info(`Express server running at http://localhost:${PORT} 🚀`);
});
