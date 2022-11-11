const mongoose = require("mongoose");
const PurchaseOrder = require("../../po/models/PurchaseOrder");

const Delivery = require("../models/Delivery");

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

    if (usertype && usertype == "RECEIVER") {
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
exports.checkUserAndAccessGeneral = (req, res, next) => {
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

    if (usertype && usertype == "RECEIVER") {
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

exports.checkPoInvoiced = (req, res, next) => {
  PurchaseOrder.findOne({
    poid: req.body.poid,
  })
    .exec()
    .then((po) => {
      if (po) {
        req.body.amount = po.amount;
        next();
        if (po.status !== "INVOICED") {
          res.status(400).json({
            error: "Purchase Order is not invoiced",
            code: "PURCHASE_ORDER_NOT_INVOICED",
          });
        }
      }
    });
};

exports.createDelivery = (req, res, next) => {
  const delid = "DEL" + Math.floor(Math.random() * 50000);
  const {
    poid,
    supplierId,
    amount,
    createdBy,
    paymentMethod,
    paymentStatus,
    contactNo,
  } = req.body;

  console.log(amount);

  const newdel = new Delivery({
    _id: mongoose.Types.ObjectId(),
    poid: poid,
    supplierId: supplierId,
    createdBy: createdBy,
    deliveryId: delid,
    paymentMethod: paymentMethod,
    paymentStatus: paymentStatus,
    contactNo: contactNo,
    amount: amount,
  });

  newdel
    .save()
    .then((createdDelivery) => {
      res.status(201).json({
        message: "New Delivery Order created",
        code: "NEW_DELIVERY_CREATED",
        createdDelivery: createdDelivery,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        code: "UNKNOWN_ERROR",
      });
    });
};

exports.enRouteDelivery = (req, res, next) => {
  Delivery.findOneAndUpdate(
    {
      deliveryId: req.body.deliveryId,
    },
    {
      status: "ENROUTE",
    }
  )
    .exec()
    .then(() => {
      Delivery.findOne({
        deliveryId: req.body.deliveryId,
      }).then((enRouteDelivery) => {
        res.status(200).json({
          deliery: enRouteDelivery,
        });
      });
    });
};

exports.cancelDelivery = (req, res, next) => {
  Delivery.findOneAndUpdate(
    {
      deliveryId: req.body.deliveryId,
    },
    {
      status: "CANCELLED",
    }
  )
    .exec()
    .then(() => {
      Delivery.findOne({
        deliveryId: req.body.deliveryId,
      }).then((cancelDelivery) => {
        res.status(200).json({
          deliery: cancelDelivery,
        });
      });
    });
};

exports.completeDelivery = (req, res, next) => {
  Delivery.findOneAndUpdate(
    {
      deliveryId: req.body.deliveryId,
    },
    {
      status: "DELIVERED",
    }
  )
    .exec()
    .then((del) => {
      //complete PO
      PurchaseOrder.findOneAndUpdate(
        {
          poid: del.poid,
        },
        {
          status: "DELIVERED",
        }
      ).exec();

      //response
      Delivery.findOne({
        deliveryId: req.body.deliveryId,
      }).then((enRouteDelivery) => {
        res.status(200).json({
          deliery: enRouteDelivery,
        });
      });
    });
};

exports.fetchAllStartedDeliveryOrders = (req, res, next) => {
  Delivery.find({
    status: "STARTED",
  })
    .exec()
    .then((allRejectedPo) => {
      if (allRejectedPo.length > 0) {
        res.status(200).json({
          message: "All STARTED Delivery Orders",
          code: "ALL_STARTED_DELIVERY_ORDERS",
          response: allRejectedPo,
        });
      } else {
        res.status(404).json({
          error: "No STARTED Delivery Orders",
          code: "NO_STARTED_DELIVERY_ORDERS",
        });
      }
    });
};


exports.fetchAllEnRouteDeliveryOrders = (req, res, next) => {
  Delivery.find({
    status: "ENROUTE",
  })
    .exec()
    .then((allRejectedPo) => {
      if (allRejectedPo.length > 0) {
        res.status(200).json({
          message: "All ENROUTE Delivery Orders",
          code: "ALL_ENROUTE_DELIVERY_ORDERS",
          response: allRejectedPo,
        });
      } else {
        res.status(404).json({
          error: "No ENROUTE Delivery Orders",
          code: "NO_ENROUTE_DELIVERY_ORDERS",
        });
      }
    });
};

exports.fetchAllCancelledDeliveryOrders = (req, res, next) => {
  Delivery.find({
    status: "CANCELLED",
  })
    .exec()
    .then((allRejectedPo) => {
      if (allRejectedPo.length > 0) {
        res.status(200).json({
          message: "All CANCELLED Delivery Orders",
          code: "ALL_CANCELLED_DELIVERY_ORDERS",
          response: allRejectedPo,
        });
      } else {
        res.status(404).json({
          error: "No CANCELLED Delivery Orders",
          code: "NO_CANCELLED_DELIVERY_ORDERS",
        });
      }
    });
};


exports.fetchAllCompletedDeliveryOrders = (req, res, next) => {
  Delivery.find({
    status: "DELIVERED",
  })
    .exec()
    .then((allRejectedPo) => {
      if (allRejectedPo.length > 0) {
        res.status(200).json({
          message: "All DELIVERED Delivery Orders",
          code: "ALL_DELIVERED_DELIVERY_ORDERS",
          response: allRejectedPo,
        });
      } else {
        res.status(404).json({
          error: "No DELIVERED Delivery Orders",
          code: "NO_DELIVERED_DELIVERY_ORDERS",
        });
      }
    });
};

exports.fetchOneDelivery = (req,res,next)=>{
  Delivery.findOne({
    deliveryId: req.params.deliveryId,
  })
    .exec()
    .then((singleDelivery) => {
      if (singleDelivery) {
        res.status(200).json({
          purchase_request: singleDelivery,
          code: "SINGLE_DELIVERY_ORDER_FOUND",
        });
      } else {
        res.status(404).json({
          error: "Delivery Order does not exist",
          code: "NO_DELIVERY_ORDER_EXISTS",
        });
      }
    });
};
