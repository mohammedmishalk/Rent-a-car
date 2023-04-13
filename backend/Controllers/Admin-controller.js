
const carModel = require('../model/carModel');
const Admin = require("../model/Admin");
const User = require('../model/User');
const jwt =require('jsonwebtoken')
const Booking = require('../model/booking');
const moment = require('moment');

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const found = await Admin.findOne({ admin_id: email, password });
    if (found) {
      const reps = {         
        email: found._id,
        admin: found.admin_id,
        accountType: 'admin',
      };
      const token = jwt.sign(reps, process.env.JWT_SECRET_KEY);
      res.send({ success: true, token });
    } else {
      throw new Error('admin not found');
    }
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};
const AddCars = async(req, res)=>{
    
    try {
        const { name, rentPerDay, fuelType, capacity } = req.body;
            const data = new carModel({
                name ,
                rentPerDay ,
                fuelType ,
                capacity ,
                
            });
            if (req.files && req.files.length > 0) {
                data.image = req.files.map((f) => ({
                  url: f.path,
                  filename: f.filename,
                }));
              }
            await data.save();
            res.status(201).send("Data uploaded successfully")
    } catch (error) {
        res.status(400).send(error.message);
    }
   
} 


const getAllCars= async (req, res) =>{
    const found = await carModel.find();

    try{
        
        res.status(200).send(found);

    }catch(error) {
        res.status(400).send(error.message);
    }

    
}
const blockCars = async (req, res) => {
    try {
      const { id } = req.params;
      let value;
      const check = await carModel.findById(id);
      if (check) {
        if (check.status === false) {
          value = true;
        } else {
          value = false;
        }
      } else {
        throw new Error('Something went wrong');
      }
      await carModel.findByIdAndUpdate(id, {
        status: value,
      });
      res.send({ success: true, message: 'car status updated' });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  };


  const getAllusers = async (req, res) => {
    try {
      const users = await User.find();
      res.send({ success: true, users });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  };

  const getAllbooking = async (req, res) => {
    try {
      const found = await Booking.find();
      res.send({ success: true, found, cancel:found.cancel });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  };

  const blockUnblockUser = async (req, res) => {
    try {
      const { id } = req.params;
      let value;
      const check = await User.findById(id);
      if (check) {
        if (check.status === "Active") {
          value = 'Blocked';
        } else {
          value = 'Active';
        }
      } else {
        throw new Error('Something went wrong');
      }
      await User.findByIdAndUpdate(id, {
        status: value,
      });
      res.send({ success: true, message: 'user status updated' });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  };
  
  const Refunde = async (req, res) => {
    try {
      const { id } = req.params;
      const found = await Booking.findById(id);
  
      if (!found) {
        return res.status(404).send({ success: false, message: "Booking not found." });
      }
  
      if (!found.cancel) {
        return res.status(400).send({ success: false, message: "Booking cannot be refunded." });
      }
  
      const user = await User.findById(found.user_id);
  
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found." });
      }
  
      const value = found.totalAmount;
      await Booking.updateOne({ _id: id }, { $set: { cancel: "Refuned" } });
      await User.updateOne({ _id: user._id }, { $inc: { walletBalance: value } });
  
      found.refund = true;
      await found.save();
  
      res.send({ success: true, message: "Refund successful." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Internal server error." });
    }
  };
  
  // const Delivery = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     let value;
  //     const found = await Booking.findById(id);
  //     if (found.totalDays) {
  //       if (found.orderStatus === "Pending") {
  //         value = "Delivered";
  //       } else {
  //         value = "pending";
  //       }
  //     } else {
  //       throw new Error('Something went wrong');
  //     }
  //     await Booking.findByIdAndUpdate(id, {
  //       orderStatus: value,
  //     });
  //     res.send({ success: true, message: 'car status updated' });
  //   } catch (error) {
  //     res.send({ success: false, message: error.message });
  //   }
  // };

  const Delivery = async (req, res) => {
    try {
      const { id } = req.params;
      let value;
      const found = await Booking.findById(id);
      if (found.totalDays) {
        const { from, to, rentPerDay } = found;
        const diffDays = moment(to).diff(moment(from), 'days');
        if (found.orderStatus === "Pending") {
          if (moment(to) < moment()) {
            value = "Late";
            const lateDays = moment().diff(moment(to), 'days');
            const lateCharge = lateDays * rentPerDay;
            found.totalAmount += lateCharge;
            await found.save();
          } else {
            value = "Delivered";
          }
        } else {
          value = "pending";
        }
      } else {
        throw new Error('Something went wrong');
      }
      await Booking.findByIdAndUpdate(id, {
        orderStatus: value,
      });
      res.send({ success: true, message: 'car status updated' });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  };


  const adminHomeRender = async (req, res) => {
    try {
     
      const userCount = await User.countDocuments({});
      const productCount = await carModel.countDocuments({});
      // const orderData = await Booking.find({ orderStatus: { $ne: 'Cancelled' } });
      const orderCount = await Booking.countDocuments({});
      const pendingOrder = await Booking.find({ orderStatus: 'Pending' }).count();
      const completed = await Booking.find({ orderStatus: 'Completed' }).count();
      const delivered = await Booking.find({ orderStatus: 'Delivered' }).count();
      const cancelled = await Booking.find({ orderStatus: 'Cancelled' }).count();
      const wallet = await Booking.find({ paymentMethod: 'wallet' }).count();
      const online = await Booking.find({ paymentMethod: 'online' }).count();
      const completedOrders = await Booking.find({ orderStatus: 'Delivered' });
      const totalIncome = completedOrders.reduce((total, order) => total + order.totalAmount, 0);

   
      // const totalAmount = orderData.reduce((accumulator, object) => {
      
      //   return (accumulator += object.totalAmount);
      // }, 0);
      res.send( {
        usercount: userCount,
        productcount: productCount,
        // totalamount: totalAmount,
        ordercount: orderCount,
        pending: pendingOrder,
        completed,
        delivered,
        cancelled,
        totalIncome: totalIncome,
        online,
      });
    } catch (error) {
      console.log(error)
      res.send({massage:error});
    }
  };


  const getSalesReport = async (req, res) => {
    try {
      const today = moment().startOf('day');
      const endtoday = moment().endOf('day');
      const monthstart = moment().startOf('month');
      const monthend = moment().endOf('month');
      const yearstart = moment().startOf('year');
      const yearend = moment().endOf('year');
      const daliyReport = await Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: today.toDate(),
              $lte: endtoday.toDate(),
            },
          },
        },
        {
          $lookup:
                {
                  from: 'User',
                  localField: 'user_id',
                  foreignField: '_id',
                  as: 'user',
                },
        },
  
        {
          $project: {
            order_id: 1,
            user_id: 1,
            paymentStatus: 1,
            totalAmount: 1,
            orderStatus: 1,
            createdAt:1
          },
        },
       
      ]);
      // console.log("dataaaaaaaaaaaaaaaaaaaaa")/
      // console.log(daliyReport);
      const monthReport = await Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: monthstart.toDate(),
              $lte: monthend.toDate(),
            },
          },
        },
        {
          $lookup:
                {
                  from: 'User',
                  localField: 'user_id',
                  foreignField: '_id',
                  as: 'user',
                },
        },
  
        {
          $project: {
            order_id: 1,
            user_id: 1,
            paymentStatus: 1,
            totalAmount: 1,
            orderStatus: 1,
            createdAt:1

          },
        },
        
      ]);
      const yearReport = await Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: yearstart.toDate(),
              $lte: yearend.toDate(),
            },
          },
        },
        {
          $lookup:
                {
                  from: 'User',
                  localField: 'user_id',
                  foreignField: '_id',
                  as: 'user',
                },
        },
        {
          $project: {
            order_id: 1,
            user_id: 1,
            paymentStatus: 1,
            totalAmount: 1,
            orderStatus: 1,
            createdAt:1
          },
        },
        
      ]);
      res.send({ today: daliyReport, month: monthReport, year: yearReport });
    } catch (error) {
      res.send({massage:"no data"});
    }
  };
  


exports.AddCars = AddCars
exports.blockUnblockUser=blockUnblockUser
exports.blockCars=blockCars
exports.getAllusers=getAllusers
exports.getAllbooking=getAllbooking
exports.getAllCars=getAllCars
exports.Refunde=Refunde;
exports.adminLogin=adminLogin;
exports.Delivery=Delivery
exports.adminHomeRender=adminHomeRender
exports.getSalesReport=getSalesReport;