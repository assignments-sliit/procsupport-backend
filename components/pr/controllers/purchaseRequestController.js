const mongoose = require("mongoose");

const PurchaseRequest = require("../models/PurchaseRequest");
const Material = require("../../materials/models/MaterialSchema");
const MaterialType = require("../../materials/models/MaterialTypeSchema");
const MaterialRequirement = require("../models/MaterialRequirement");

exports.checkPrExists = (req, res, next) => {
  const prid = "PR" + Math.floor(Math.random() * 50000);
  PurchaseRequest.findOne({
    prid: prid,
  })
    .exec()
    .then((foundPr) => {
      if (foundPr) {
        res.status(409).json({
          error: "The Purchase Request Exists",
          code: "PR_EXISTS",
        });
      } else {
        req.body.prid = prid;
        next();
      }
    });
};

exports.checkUserAndAccess = (req, res, next) => {
  const token = req.body.token;

  if (token) {
    const json = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    Object.entries(json).map((entry) => {
      if (entry[0] == "id") {
        req.body.createdBy = entry[1].toString();
      }

      if (entry[0] == "usertype" && entry[1] == "REQUESTOR") {
        next();
      }
    });
  }
};

exports.createPurchaseRequest = (req, res) => {
  const { prid, prName, description, createdBy } = req.body;

  const newPr = new PurchaseRequest({
    _id: mongoose.Types.ObjectId(),
    prid: prid,
    prName: prName,
    description: description,
    createdBy: createdBy,
  });

  newPr
    .save()
    .then((createdPr) => {
      res.status(201).json({
        message: "New Purchase Request created",
        code: "NEW_PR_CREATED",
        createdPr: createdPr,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        code: "UNKNOWN_ERROR",
      });
    });
};

exports.checkMaterial = (req, res, next) => {
  const material = req.body.materialId;

  Material.findOne({
    materialId: material,
  })
    .exec()
    .then((foundMaterial) => {
      if (foundMaterial) {
        req.body.material = foundMaterial.materialId;
        next();
      } else {
        res.status(404).json({
          error: "Material does not exist",
          code: "MATERIAL_DOES_NOT_EXIST",
        });
      }
    });
};

exports.checkMaterialType = (req, res,next) => {
  const materialType = req.body.materialTypeId;

  MaterialType.findOne({
    materialId: materialType,
  })
    .exec()
    .then((foundMaterialType) => {
      if (foundMaterialType) {
        req.body.materialType = foundMaterialType.materialType;
        next();
      } else {
        res.status(404).json({
          error: "Material does not exist",
          code: "MATERIAL_DOES_NOT_EXIST",
        });
      }
    });
};

exports.addMaterialRequirement = (req, res,next) => {
  const reqid = "MAR" + +Math.floor(Math.random() * 50000);
  req.body.reqid = reqid;

  const _id = mongoose.Types.ObjectId()
  req.body._id = _id;

  const materialRequirement = new MaterialRequirement(req.body);

  materialRequirement.save().then((createdMr) => {
    req.body.createdMr = createdMr;
    next();
  });
};

exports.addMrToPr = (req, res) => {
  PurchaseRequest.updateOne(
    {
      prid: req.body.prid,
    },
    {
      "$push": { materialRequirement: req.body.createdMr._id },
    },
  ).exec().then((updated)=>{
    res.status(200).json({
      createdMaterialRequirement:req.body.createdMr,
      message:"Material Requirement Added",
      code:"MATERIAL_REQUIREMENT_ADDED"
    })
  })
};
