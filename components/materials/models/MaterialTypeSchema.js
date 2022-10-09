const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const MaterialTypeSchema = new Schema({

    _id: mongoose.Types.ObjectId,
    materialType:{
        type:String,
        required:true
    }
    
})

module.exports = mongoose.Schema("Material Type",MaterialTypeSchema)