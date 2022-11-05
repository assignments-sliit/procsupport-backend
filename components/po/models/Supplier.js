const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({

    _id:mongoose.Types.ObjectId,
    supplierId:{
        type:String,
        required:true,
        unique:true
    },
    supplierName:{
        type:String,
        required:true
    },
    supplierContactNo:{
        type:String,
        required:true
    },
    supplierAddress:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Supplier", SupplierSchema)