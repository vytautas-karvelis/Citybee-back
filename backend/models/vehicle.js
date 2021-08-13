const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehicleSchema = new Schema(
    {
      model_id:{
        type:String,
        required:true
      },
      number_plate:{
        type: String,
        required: true,
      },    
      country_location:{
        type: String,
        required: true,
      }   
    },
    {timestamps:true}
  )

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle