const express = require("express");
const routes = express.Router();

const materialController = require("../controller/materialController");

routes.post("/add", materialController.addMaterial);

routes.patch(
  "/qty/add",
  materialController.checkMaterialExists,
  materialController.addQtyToMaterial
);

routes.patch(
  "/qty/remove",
  materialController.checkMaterialExists,
  materialController.removeQtyToMaterial
);

module.exports = routes;
