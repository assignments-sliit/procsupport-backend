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

  let usertype = "";

  if (token) {
    const json = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    Object.entries(json).map((entry) => {
      if (entry[0] == "id") {
        req.body.createdBy = entry[1].toString();
      }

      if (entry[0] == "usertype") {
        usertype = entry[1].toString();
      }
    });

    if (usertype && usertype == "REQUESTOR") {
      next();
    } else {
      res.status(409).json({
        error: "Access Denied",
        code: "ACCESS_DENIED",
      });
    }
  }
  //cannot find token
  else {
    res.status(409).json({
      error: "Cannot find auth token",
      code: "AUTH_TOKEN_NOT_FOUND",
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

exports.checkMaterialType = (req, res, next) => {
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

exports.addMaterialRequirement = (req, res, next) => {
  const reqid = "MAR" + +Math.floor(Math.random() * 50000);
  req.body.reqid = reqid;

  const _id = mongoose.Types.ObjectId();
  req.body._id = _id;

  const materialRequirement = new MaterialRequirement(req.body);

  materialRequirement.save().then((createdMr) => {
    res.status(201).json({
      createdMr: createdMr,
    });
  });
};

exports.approvePr = (req, res, next) => {
  const token = req.body.token;

  let usertype = "";

  if (token) {
    const json = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    Object.entries(json).map((entry) => {
      if (entry[0] == "usertype") {
        usertype = entry[1].toString();
      }
    });

    if (usertype && usertype == "APPROVER") {
      PurchaseRequest.findOneAndUpdate(
        {
          prid: req.body.prid,
        },
        {
          status: "APPROVED",
        }
      )
        .exec()
        .then(() => {
          PurchaseRequest.findOne({
            prid: req.body.prid,
          }).then((approvedPr) => {
            res.status(200).json({
              approvedPr: approvedPr,
            });
          });
        });
    } else {
      res.status(409).json({
        error: "Access Denied",
        code: "ACCESS_DENIED",
      });
    }
  }
  //cannot find token
  else {
    res.status(409).json({
      error: "Cannot find auth token",
      code: "AUTH_TOKEN_NOT_FOUND",
    });
  }
};

exports.declinePr = (req, res, next) => {
  const token = req.body.token;

  let usertype = "";

  if (token) {
    const json = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    Object.entries(json).map((entry) => {
      if (entry[0] == "usertype") {
        usertype = entry[1].toString();
      }
    });

    if (usertype && usertype == "APPROVER") {
      PurchaseRequest.findOneAndUpdate(
        {
          prid: req.body.prid,
        },
        {
          status: "DECLINED",
        }
      )
        .exec()
        .then(() => {
          PurchaseRequest.findOne({
            prid: req.body.prid,
          }).then((declinedPr) => {
            res.status(200).json({
              declinedPr: declinedPr,
            });
          });
        });
    } else {
      res.status(409).json({
        error: "Access Denied",
        code: "ACCESS_DENIED",
      });
    }
  }
  //cannot find token
  else {
    res.status(409).json({
      error: "Cannot find auth token",
      code: "AUTH_TOKEN_NOT_FOUND",
    });
  }
};

exports.fetchAllPr = (req, res, next) => {
  PurchaseRequest.find()
    .exec()
    .then((allPrs) => {
      if (allPrs.length < 0) {
        res.status(404).json({
          error: "No Purchase Request exists",
          code: "NO_PR_EXISTS",
        });
      } else {
        res.status(200).json({
          purchase_requests: allPrs,
          code: "PR_FOUND",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
        code: "UNKNOWN_SERVER_ERROR",
      });
    });
};

exports.fetchAllPrWithAuth = (req, res, next) => {
  const token = req.body.token;
  let _id;

  if (token) {
    const json = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    Object.entries(json).map((entry) => {
      if (entry[0] == "id") {
        _id = entry[1];
      }
    });

    PurchaseRequest.find({ createdBy: mongoose.Types.ObjectId(_id) })
      .exec()
      .then((allPrs) => {
        if (allPrs.length < 0) {
          res.status(404).json({
            error: "No Purchase Requests exist",
            code: "NO_PR_EXISTS",
          });
        } else {
          res.status(200).json({
            purchase_requests: allPrs,
            code: "PR_FOUND",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
          code: "UNKNOWN_SERVER_ERROR",
        });
      });
  }
};
exports.fetchPrByPrId = (req, res, next) => {
  PurchaseRequest.findOne({
    prid: req.params.prid,
  })
    .exec()
    .then((singlePr) => {
      if (singlePr) {
        res.status(200).json({
          purchase_request: singlePr,
          code: "SINGLE_PR_FOUND",
        });
      } else {
        res.status(404).json({
          error: "Purchase Request does not exist",
          code: "NO_PR_EXISTS",
        });
      }
    });
};

exports.fetchPrByPrIdWithAuth = (req, res, next) => {
  const token = req.body.token;

  let _id;

  if (token) {
    const json = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    Object.entries(json).map((entry) => {
      if (entry[0] == "id") {
        _id = entry[1];
      }
    });

    PurchaseRequest.findOne({
      prid: req.params.prid,
      createdBy: mongoose.Types.ObjectId(_id),
    })
      .exec()
      .then((singlePr) => {
        if (singlePr) {
          console.log(singlePr);
          res.status(200).json({
            purchase_request: singlePr,
            code: "SINGLE_PR_FOUND",
          });
        } else {
          res.status(404).json({
            error: "Purchase Request does not exist",
            code: "NO_PR_EXISTS",
          });
        }
      });
  }
};
