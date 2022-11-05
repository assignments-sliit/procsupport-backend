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

module.exports = routes;
