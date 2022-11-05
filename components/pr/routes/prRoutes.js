const express = require("express");
const routes = express.Router();

const prController = require("../controllers/purchaseRequestController");

//create purchase request
routes.post(
  "/create",
  prController.checkPrExists,
  prController.checkUserAndAccess,
  prController.createPurchaseRequest
);

routes.put("/status/approve",prController.approvePr)

module.exports = routes;
