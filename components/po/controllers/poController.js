const mongoose = require("mongoose");

const PurchaseOrder = require("../models/PurchaseOrder");
const PurchaseRequest = require("../../pr/models/PurchaseRequest");

exports.checkPoExists = (req, res, next) => {
  const poid = "PR" + Math.floor(Math.random() * 50000);
  PurchaseOrder.findOne({
    poid: poid,
  })
    .exec()
    .then((poObject) => {
      if (poObject) {
        res.status(409).json({
          error: "Purchase Order already exists",
          code: "PURCHASE_ORDER_EXISTS",
        });
      } else {
        req.body.poid = poid;
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

    if (usertype && usertype == "PURCHASER") {
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

exports.getAmount = (req, res, next) => {
  PurchaseRequest.findOne({
    prid: req.body.prid,
  })
    .exec()
    .then((foundPr) => {
      if (foundPr) {
        req.body.amount = foundPr.amount;
        console.log("punda1");
        next();
      } else {
        res.status(404).json({
          error: "Purchase Request not found",
          code: "PR_NOT_FOUND",
        });
      }
    });
};

exports.createPo = (req, res, next) => {
  const { poid, supplierId, description, amount, createdBy, prid } = req.body;
  console.log("punda12");
  const newPo = new PurchaseOrder({
    _id: mongoose.Types.ObjectId(),
    poid: poid,
    supplierId: supplierId,
    description: description,
    createdBy: createdBy,
    amount: amount,
    prid: prid,
  });

  newPo
    .save()
    .then((createdPo) => {
      res.status(201).json({
        message: "New Purchase Order created",
        code: "NEW_PO_CREATED",
        createdPo: createdPo,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        code: "UNKNOWN_ERROR",
      });
    });
};

exports.fetchAllPos = (req, res, next) => {
  PurchaseOrder.find()
    .exec()
    .then((allPos) => {
      if (allPos) {
        res.status(200).json({
          message: "All Purchase Orders",
          code: "ALL_PURCHASE_ORDERS",
          response: allPos,
        });
      } else {
        res.status(404).json({
          error: "No Purchase Orders",
          code: "NO_PURCHASE_ORDERS",
        });
      }
    });
};
