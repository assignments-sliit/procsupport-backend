const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  amount: {
    type: String,
    required: true,
  },
  currency:{
    type:String,
    required:true,
    default:'LKR'
  },
  budgetName:{
    required:true,
    enum:["GENERAL", "PR"],
    type: String,
    default:"GENERAL"
  }

});

module.exports = mongoose.model("Budget",BudgetSchema)
