const mongoose = require("mongoose");

const PurchaseRequest = require("../models/PurchaseRequest");

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
