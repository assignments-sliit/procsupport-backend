const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    _id:mongoose.Types.ObjectId,
    deliveryId:{
        type:String,
        required:true,
    },
    supplierId:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
       required:true,
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
        enum:['STARTED','ENROUTE','CANCELLED','DELIVERED'],
        required:true,
        default:'STARTED'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:true
    },
    poid:{
        type:String,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        required:true
    },
    contactNo:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("Delivery", DeliverySchema)