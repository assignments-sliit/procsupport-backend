const express = require("express");
const routes = express.Router();

const poController = require("../controllers/poController");

//new PO
routes.post(
  "/create",
  poController.checkUserAndAccess,
  poController.checkPoExists,
  poController.getAmount,
  poController.createPo
);

//all POs
routes.get("/get/all", poController.fetchAllPos);

//approve PO
routes.put("/approve", poController.approvePo);

//Rejected
routes.put("/reject", poController.rejectPo);

routes.get("/get/approved", poController.fetchAllApprovedPos);

routes.get("/get/pending", poController.fetchAllPendingPos);

routes.get("/get/rejected", poController.fetchAllRejectedPos);

routes.get("/get/invoiced", poController.fetchAllInvoicedPos);

routes.get("/get/delivered", poController.fetchAllDeliveredPos);

routes.put(
  "/invoice",
  poController.checkBudgetBeforePoInvoice,
  poController.invoicePo,
  poController.deductBudgetAfterInvoicePo
);

module.exports = routes;
