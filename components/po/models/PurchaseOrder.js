const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PurchaseOrderSchema = new Schema({
    _id:mongoose.Types.ObjectId,
    poid:{
        type:String,
        required:true,
    },
    supplierId:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
        default:0
    },
    createdOn:{
        type:Date,
        required:true,
        default:Date.now()
    },
    updatedOn:{
        type:Date,
        required:true,
        default:Date.now()
    },
    status:{
        type:String,
        enum:['APPROVED','PENDING','DECLINED'],
        required:true,
        default:'PENDING'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:true
    },
    prNo:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("Purchase Order", PurchaseOrderSchema)