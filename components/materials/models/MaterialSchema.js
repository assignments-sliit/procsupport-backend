const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MaterialSchema = new Schema({
  _id: mongoose.Types.ObjectId,
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
    type: String,
    required: true,
  },
});

module.exports = mongoose.Schema("Material", MaterialSchema);
