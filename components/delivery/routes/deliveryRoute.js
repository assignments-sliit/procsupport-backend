const express = require("express");
const routes = express.Router();

const delController = require("../controller/deliveryController");

routes.post(
  "/create",
  delController.checkUserAndAccess,
  delController.checkPoInvoiced,
  delController.createDelivery
);

routes.put('/status/enroute',delController.checkUserAndAccessGeneral,delController.enRouteDelivery)

routes.put('/status/cancel',delController.checkUserAndAccessGeneral,delController.cancelDelivery)

routes.put('/status/complete',delController.checkUserAndAccessGeneral,delController.completeDelivery)


routes.get('/get/all/started', delController.fetchAllStartedDeliveryOrders)

routes.get('/get/all/enroute',delController.fetchAllEnRouteDeliveryOrders)

routes.get('/get/all/cancelled',delController.fetchAllCancelledDeliveryOrders)

routes.get('/get/all/completed',delController.fetchAllCompletedDeliveryOrders)

routes.get('/get/delivery/:deliveryId', delController.fetchOneDelivery)
module.exports = routes;
