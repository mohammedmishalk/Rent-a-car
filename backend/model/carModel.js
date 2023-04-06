const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image:[{
    url:{
      type:String
    },
    filename:{
      type:String
    }
  }],
  rentPerDay: {
    type: Number,
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  bookedTimeSlots: [{
    type: Date
  }],
  capacity: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: false,
  },
 
  
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
