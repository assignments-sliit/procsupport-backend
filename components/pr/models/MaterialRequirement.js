const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const MaterialRequirementSchema = new Schema({
    _id:mongoose.Types.ObjectId,
    reqid:{
        type:String,
        required:true,
    },
    material:{
        type:mongoose.Types.ObjectId,
        ref:'Materials'
    },
    materialType:{
        type:mongoose.Types.ObjectId,
        ref:'Material Type'
    },
    qty:{
        type:Number,
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

})

module.exports = mongoose.Schema("Material Requirement", MaterialRequirementSchema)