const express = require("express");
const routes = express.Router();

const materialController = require('../controller/materialController')

routes.post('/add', materialController.addMaterial)

module.exports = routes;