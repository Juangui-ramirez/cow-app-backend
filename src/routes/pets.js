const express = require('express');
const petControllers = require('../controller/pets');

const router = express.Router();

//Begin logic/ presentacion
router.get("/pets", petControllers.getAll);

router.get("/pets/:name", petControllers.get);

router.post("/pets", petControllers.create);
// END logic

module.exports = router