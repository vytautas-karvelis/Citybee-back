const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hour_price: {
      type: Number,
      required: true,
    },     
  },
  { timestamps: true }
);


const Model = mongoose.model('Model', modelSchema);

module.exports = Model