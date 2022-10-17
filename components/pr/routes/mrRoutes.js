const express = require("express");
const routes = express.Router();

const prController = require("../controllers/purchaseRequestController");

//add material requirement to PR
routes.post(
  "/add",
  prController.checkMaterial,
  prController.checkMaterialType,
  prController.checkPrExists,
  prController.addMaterialRequirement
);

module.exports = routes;
