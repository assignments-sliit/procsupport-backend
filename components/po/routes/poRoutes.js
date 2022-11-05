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
routes.get("/all", poController.fetchAllPos);

//approve PO
routes.put('/approve',poController.approvePo)

//Rejected
routes.put('/reject',poController.rejectPo)

module.exports = routes;
