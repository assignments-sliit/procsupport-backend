const mongoose = require("mongoose");
const MaterialType = require("../../materials/models/MaterialTypeSchema");

exports.addMaterialType = (req, res) => {
  MaterialType.findOne({
    materialType: req.body.materialType,
  })
    .exec()
    .then((foundMt) => {
      if (foundMt) {
        res.status(409).json({
          error: "Material Type Exists",
          code: "MATERIAL_TYPE_EXISTS",
        });
      } else {
        const _id = mongoose.Types.ObjectId();
        req.body._id = _id;
        const mt = new MaterialType(req.body);

        mt.save().then((createdmt) => {
          res.status(201).json({
            createdMaterialType: createdmt,
            code: "MATERIAL_TYPE_CREATED",
          });
        });
      }
    });
};
