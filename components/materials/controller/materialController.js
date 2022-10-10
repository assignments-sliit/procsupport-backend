const mongoose = require("mongoose");

const Material = require("../models/MaterialSchema");

exports.addMaterial = (req, res) => {
  const id = mongoose.Types.ObjectId();
  req.body._id = id;
  const materialId = "MAT" + Math.floor(Math.random() * 50000);
  req.body.materialId = materialId;

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

exports.checkMaterialExists = (req, res, next) => {
  const materialId = req.body.materialId;
  Material.findOne({
    materialId: materialId,
  })
    .exec()
    .then((materialDocument) => {
      if (materialDocument) {
        req.body.materialId = materialDocument.materialId;
        req.body.availableQty = materialDocument.availableQty;
        next();
      } else {
        res.status(404).json({
          error: "No material found",
          code: "MATERIAL_NOT_FOUND",
        });
      }
    });
};

exports.addQtyToMaterial = (req, res) => {
  Material.updateOne(
    { materialId: req.body.materialId },
    {
      availableQty: req.body.availableQty + req.body.qty,
    }
  )
    .exec()
    .then((updatedDoc) => {
      res.status(200).json({
        updatedDocument: updatedDoc,
        message: "Material Quantity Incresed",
        code: "QUANTITY_INCREASED",
      });
    });
};


exports.removeQtyToMaterial = (req, res) => {
    Material.updateOne(
      { materialId: req.body.materialId },
      {
        availableQty: req.body.availableQty - req.body.qty,
      }
    )
      .exec()
      .then((updatedDoc) => {
        res.status(200).json({
          updatedDocument: updatedDoc,
          message: "Material Quantity Incresed",
          code: "QUANTITY_DECREASED",
        });
      });
  };