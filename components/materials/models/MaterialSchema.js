const mongoose = require("mongoose");

const { Schema } = mongoose;

const MaterialSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  materialId:{
    type: String,
    required: true,
    unique:true
  },
  materialType: {
    type: String,
    required: true,
  },
  materialName: {
    type: String,
    required: true,
  },
  availableQty: {
    type: Number,
    required: true,
    default: 0,
  },
  uom: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  unitPriceCurrency:{
    type: String,
    required: true,
    default:"LKR"
  }
});


module.exports = mongoose.model('Material',MaterialSchema);
