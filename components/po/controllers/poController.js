const mongoose = require("mongoose");

const PurchaseOrder = require("../models/PurchaseOrder")

exports.checkPoExists = (req,res,next) =>{
    PurchaseOrder.findOne({
        poid: req.body.poid
    }).exec().then((poObject)=>{
        if(poObject){
            res.status(409).json({
                error:"Purchase Order already exists",
                code:"PURCHASE_ORDER_EXISTS"
            })
        }else{
            next();
        }
    })
}