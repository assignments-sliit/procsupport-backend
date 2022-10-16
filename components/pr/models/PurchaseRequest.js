const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const PurchaseRequestSchema = new Schema({
    _id:mongoose.Types.ObjectId,
    prid:{
        type:String,
        required:true,
    },
    prName:{
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
        enum:['NEW','APPROVED','PENDING','DECLINED'],
        required:true,
        default:'NEW'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:true
    },
    materialRequirement:{
        type:[mongoose.Types.ObjectId],
        ref:'Material Requirement'
    }
})

module.exports = mongoose.model("Purchase Request", PurchaseRequestSchema)