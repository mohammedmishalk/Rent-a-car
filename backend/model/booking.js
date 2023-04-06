// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//     user: {
//         type: String,
//         required: false
//       },
//   carName: {
//     type: String,
//     required: true
//   },
//   from: {
//     type: Date,
//     required: false
//   },
//   to: {
//     type: Date,
//     required: false
//   },
//   driverRequired: {
//     type: Boolean,
//     required: true
//   },
//   totalDays: {
//     type: Number,
//     required: true
//   },
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   transtionid: {
//     type: String,
//     default: "123"
//   },
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// module.exports = Booking;


const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;
const bookingSchema = new Schema({
  order_id: {
    type: String,
    unique: true,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },

  cars: {
    type: String,
    required: true,
  },
  from: {
    type: Date,
    required: false
  },
  to: {
    type: Date,
    required: false
  },
  driverRequired: {
    type: Boolean,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },

  expectedDelivery: {
    type: String,
    required: true,
  },
 

  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    default: 'Pending',
  },
  order_placed_on: {
    type: String,
    required: true,
  },
  cancel: {
    type: String,
    required: true,
    default:"false",
  },

}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;