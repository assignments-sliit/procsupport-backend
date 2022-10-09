const mongoose = require("mongoose");

const Material = require("../models/MaterialSchema");

exports.addMaterial = (req, res) => {
  const id = mongoose.Types.ObjectId();
  req.body._id = id;

  const material = new Material(req.body);

  material
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Material created",
        createdMaterial: result,
        code: "MATERIAL_CREATED",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        code: "UNKNOWN_ERROR",
      });
    });
};
