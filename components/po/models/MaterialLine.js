const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const MaterialLineSchema = new Schema({
    _id:mongoose.Types.ObjectId,
    lineid:{
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
        required:true
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
    reqid:{
        type:String,
        required:true
    },
    prid:{
        type:String,
        required:true
    },
    poid:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model("Material Line", MaterialLineSchema)