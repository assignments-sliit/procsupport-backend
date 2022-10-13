const express = require("express");
const routes = express.Router();

const prController = require("../controllers/purchaseRequestController");

//create purchase request
routes.get(
  "/create",
  prController.checkPrExists,
  prController.checkUserAndAccess,
  prController.createPurchaseRequest
);

module.exports = routes;
