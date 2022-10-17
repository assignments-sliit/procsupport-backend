const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const MaterialRequirementSchema = new Schema({
    _id:mongoose.Types.ObjectId,
    reqid:{
        type:String,
        required:true,
    },
    material:{
        type:String,
        required: true
    },
    materialType:{
        type:String,
        required:true
    },
    qty:{
        type:Number,
        required:true,
    },
    qtyUom:{
        type:String,
        required:true,
    },
    totalAmount:{
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
    prid:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model("Material Requirement", MaterialRequirementSchema)