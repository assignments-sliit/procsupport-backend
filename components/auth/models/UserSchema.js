const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  username: {
    index:true,
    unique: true,
    type: String,
    required: true,
  },
  userstatus: {
    type: String,
    enum: ["ACTIVE", "OBSOLETE", "BLOCKED"],
    required: true,
    default: "ACTIVE",
  },
  usertype:{
    type: String,
    enum: ["ADMIN", "RECEIVER", "APPROVER","REQUESTOR","PURCHASER"],
    required: true,
    default: "ADMIN",
  },
  password:{
    required:true,
    type:String
  },
  name:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model("User",UserSchema)
