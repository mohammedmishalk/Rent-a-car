const carModel = require("../model/carModel");
const User = require("../model/User");
const Booking = require("../model/booking");
const moment = require("moment");

const AddCars = async (req, res) => {
  try {
    const { name, rentPerDay, fuelType, capacity } = req.body;
    const data = new carModel({
      name,
      rentPerDay,
      fuelType,
      capacity,
    });
    if (req.files && req.files.length > 0) {
      data.image = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));
    }
    await data.save();
    res.status(201).send("Data uploaded successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllCars = async (req, res) => {
  const found = await carModel.find();

  try {
    res.status(200).send(found);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
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
      throw new Error("Something went wrong");
    }
    await carModel.findByIdAndUpdate(id, {
      status: value,
    });
    res.send({ success: true, message: "car status updated" });
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
    res.send({ success: true, found, cancel: found.cancel });
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
        value = "Blocked";
      } else {
        value = "Active";
      }
    } else {
      throw new Error("Something went wrong");
    }
    await User.findByIdAndUpdate(id, {
      status: value,
    });
    res.send({ success: true, message: "user status updated" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const Refunde = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await Booking.findById(id);

    if (!found) {
      return res
        .status(404)
        .send({ success: false, message: "Booking not found." });
    }

    if (!found.cancel) {
      return res
        .status(400)
        .send({ success: false, message: "Booking cannot be refunded." });
    }

    const user = await User.findById(found.user_id);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
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

// const Delivery = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let value;
//     const found = await Booking.findById(id);
//     const currentDate = Date.now();
//     if (found.totalDays) {
//       const { from, to } = found;
//       console.log(to)
//       console.log(currentDate)
//       const diffDays = moment(to).diff(moment(from), 'days');
//       if (found.orderStatus === "Pending") {
//         if (moment(to) < moment()) {
//           value = "Late";
//           const lateDays = moment().diff(moment(to), 'days');
//           const lateCharge = lateDays * rentPerDay;
//           found.totalAmount += lateCharge;
//           await found.save();
//         } else {
//           value = "Delivered";
//         }
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
    const found = await Booking.findById(id);
    const { from, to, totalDays, totalAmount } = found;
    const rentPerDay = totalAmount / totalDays;
    const currentDate = new Date(Date.now());
    if (currentDate.getTime() > to.getTime()) {
      const differenceInMs = currentDate.getTime() - to.getTime();
      const differenceInDays = Math.floor(
        differenceInMs / (1000 * 60 * 60 * 24)
      );
      console.log(
        `The current date is ${differenceInDays} days after the target date`
      );
      updatedTotalDays = totalDays + differenceInDays;
      updatedTotalAmount = rentPerDay * updatedTotalDays;
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        {
          totalDays: updatedTotalDays,
          totalAmount: updatedTotalAmount,
          orderStatus: "Completed",
        },
        { new: true }
      );
      console.log(updatedBooking);
      res.status(200).json({ success: true, message: "car status updated" });
    } else {
      console.log("The current date is before the target date");
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        {
          orderStatus: "Completed",
        },
        { new: true }
      );
      res.status(200).json({ success: true, message: "car status updated" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
};

const adminHomeRender = async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    const productCount = await carModel.countDocuments({});
    // const orderData = await Booking.find({ orderStatus: { $ne: 'Cancelled' } });
    const orderCount = await Booking.countDocuments({});
    const pendingOrder = await Booking.find({ orderStatus: "Pending" }).count();
    const completed = await Booking.find({ orderStatus: "Completed" }).count();
    const delivered = await Booking.find({ orderStatus: "Delivered" }).count();
    const cancelled = await Booking.find({ orderStatus: "Cancelled" }).count();
    const wallet = await Booking.find({ paymentMethod: "wallet" }).count();
    const online = await Booking.find({ paymentMethod: "online" }).count();
    const completedOrders = await Booking.find({ orderStatus: "Completed" });
    const totalIncome = completedOrders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );

    // const totalAmount = orderData.reduce((accumulator, object) => {

    //   return (accumulator += object.totalAmount);
    // }, 0);
    res.send({
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
    console.log(error);
    res.send({ massage: error });
  }
};

exports.AddCars = AddCars;
exports.blockUnblockUser = blockUnblockUser;
exports.blockCars = blockCars;
exports.getAllusers = getAllusers;
exports.getAllbooking = getAllbooking;
exports.getAllCars = getAllCars;
exports.Refunde = Refunde;
exports.Delivery = Delivery;
exports.adminHomeRender = adminHomeRender;
