const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String,
     required: true
     },
  email: { type: String, 
    required: true,
    unique:true
 },
  password: { 
    type: String, 
    required: true,
    minlength:6 
},
walletBalance: { 
  type: Number, 
  required: false,
  default: 50,
},
status: {
  type: String,
  default: "Active",
},
});

module.exports = mongoose.model('User', userSchema);
