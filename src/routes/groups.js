const express = require('express');
const groupControllers = require('../controller/groups');

const routerGroup = express.Router();

//Begin logic/ presentacion
routerGroup.get("/groups", groupControllers.getAll);

routerGroup.get("/groups/:name", groupControllers.get);

routerGroup.post("/groups", groupControllers.create);
// END logic

module.exports = routerGroup