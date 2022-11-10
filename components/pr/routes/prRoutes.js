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

routes.put("/status/decline",prController.declinePr)

routes.get("/get/all",prController.fetchAllPr)

routes.get("/get/auth/all",prController.fetchAllPrWithAuth)

routes.get("/get/pr/:prid",prController.fetchPrByPrId)

routes.get("/get/auth/pr/:prid",prController.fetchPrByPrIdWithAuth)

module.exports = routes;
