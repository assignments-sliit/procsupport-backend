const express = require("express");
const routes = express.Router();

const materialTypeController = require('../controller/materialTypeController')

//add material type
routes.post('/new',materialTypeController.addMaterialType)

module.exports = routes;