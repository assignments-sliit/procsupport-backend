const mongoose = require("mongoose");

const PurchaseOrder = require("../models/PurchaseOrder");
const PurchaseRequest = require("../../pr/models/PurchaseRequest");

const Budget = require("../../budget/models/Budget");

exports.checkPoExists = (req, res, next) => {
  const poid = "PO" + Math.floor(Math.random() * 50000);
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
      if (allPos.length > 0) {
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

//status

exports.approvePo = (req, res, next) => {
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

    if (usertype && usertype == "PURCHASER") {
      PurchaseOrder.findOneAndUpdate(
        {
          poid: req.body.poid,
        },
        {
          status: "APPROVED",
        }
      )
        .exec()
        .then(() => {
          PurchaseOrder.findOne({
            poid: req.body.poid,
          }).then((approvedPo) => {
            res.status(200).json({
              approvedPo: approvedPo,
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

exports.rejectPo = (req, res, next) => {
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

    if (usertype && usertype == "PURCHASER") {
      PurchaseOrder.findOneAndUpdate(
        {
          poid: req.body.poid,
        },
        {
          status: "REJECTED",
        }
      )
        .exec()
        .then(() => {
          PurchaseOrder.findOne({
            poid: req.body.poid,
          }).then((approvedPo) => {
            res.status(200).json({
              approvedPo: approvedPo,
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

//check budget
exports.checkBudgetBeforePoInvoice = (req, res, next) => {
  let budget = 0;
  Budget.find()
    .exec()
    .then((allBudgetObjects) => {
      if (allBudgetObjects.length > 0) {
        allBudgetObjects.map((singleObject) => {
          budget = budget + parseInt(singleObject.amount);
        });

        PurchaseOrder.findOne({
          poid: req.body.poid,
        }).then((po) => {
          if (po) {
            if (po.amount > budget) {
              res.status(500).json({
                error: "Insufficient Budget to Invoice this Purchase Order",
                code: "INSUFFICIENT_BUDGET_FOR_PO",
              });
            } else {
              next();
            }
          } else {
            res.status(404).json({
              error: "No Purchase Orders found",
              code: "NO_PURCHASE_ORDERS_FOUND",
            });
          }
        });
      }
    });
};

exports.invoicePo = (req, res, next) => {
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

    if (usertype && usertype == "PURCHASER") {
      PurchaseOrder.findOneAndUpdate(
        {
          poid: req.body.poid,
        },
        {
          status: "INVOICED",
        }
      )
        .exec()
        .then((po) => {
          req.body.amount = po.amount;
          next();
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

exports.deductBudgetAfterInvoicePo = (req, res, next) => {
  let budget = 0;
  Budget.find()
    .exec()
    .then((allBudgetObjects) => {
      if (allBudgetObjects.length > 0) {
        allBudgetObjects.map((singleObject) => {
          budget = budget + parseInt(singleObject.amount);
        });

        if (budget > 0) {
          budget = budget - req.body.amount;
        }

        Budget.findOneAndUpdate(
          {
            budgetName: "GENERAL",
          },
          {
            amount: budget,
          }
        ).then(() => {
          PurchaseOrder.findOne({
            poid: req.body.poid,
          }).then((invoicedPo) => {
            
             res.status(200).json({
              invoicedPo: invoicedPo,
            });
          });
        });

        // res.status(200).json({
        //   amount: budget,
        //   currency: "LKR",
        //   code: "ENTIRE_BUDGET",
        // });
      }
    });
};

exports.fetchAllApprovedPos = (req, res, next) => {
  PurchaseOrder.find({
    status: "APPROVED",
  })
    .exec()
    .then((allapprovedPo) => {
      if (allapprovedPo.length > 0) {
        res.status(200).json({
          message: "All Approved Purchase Orders",
          code: "ALL_APPROVED_PURCHASE_ORDERS",
          response: allapprovedPo,
        });
      } else {
        res.status(404).json({
          error: "No Approved Purchase Orders",
          code: "NO_APPROVED_PURCHASE_ORDERS",
        });
      }
    });
};

exports.fetchAllPendingPos = (req, res, next) => {
  PurchaseOrder.find({
    status: "PENDING",
  })
    .exec()
    .then((allpendingPo) => {
      if (allpendingPo.length > 0) {
        res.status(200).json({
          message: "All Pending Purchase Orders",
          code: "ALL_PENDING_PURCHASE_ORDERS",
          response: allpendingPo,
        });
      } else {
        res.status(404).json({
          error: "No Pending Purchase Orders",
          code: "NO_PENDING_PURCHASE_ORDERS",
        });
      }
    });
};

exports.fetchAllRejectedPos = (req, res, next) => {
  PurchaseOrder.find({
    status: "REJECTED",
  })
    .exec()
    .then((allRejectedPo) => {
      if (allRejectedPo.length > 0) {
        res.status(200).json({
          message: "All REJECTED Purchase Orders",
          code: "ALL_REJECTED_PURCHASE_ORDERS",
          response: allRejectedPo,
        });
      } else {
        res.status(404).json({
          error: "No Rejected Purchase Orders",
          code: "NO_REJECTED_PURCHASE_ORDERS",
        });
      }
    });
};
