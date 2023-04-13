const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const instance = require("../middleware/razorpay");
const nodemailer = require("nodemailer");
const carModel = require("../model/carModel");
const Booking = require("../model/booking");
const mongoose = require("mongoose");
const moment = require("moment");

var email;

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shifananazrin15@gmail.com",
    pass: "ynudgxldjsercxjs",
  },
});
const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;

// const signup = async (req,res,next)=>{
//     const{name,email,password} =req.body;
// let existingUser;
// try{
//     existingUser = await User.findOne({email: email})
// } catch(err){
//     console.log(err)
// }
// if(existingUser){
//     return res.status(400).json({message:"user already exists! Login Instead"})
// }
// const hashPassword= bcrypt.hashSync(password)

//     const user = new User({
//         // name:req.body.name,
//         // email:req.body.email,
//         // password:req.body.password
//         name,
//         email,
//         password:hashPassword,
//     })
//     try{
//       await user.save();
//     }catch(err){
//         console.log(err)
//     }

//     return res.status(201).json({message:user})
// }
const signup = async (req, res) => {
  name = req.body.name;
  email = req.body.email;
  password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.send({ user: true });
      return;
    }

    //   const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailDetails = {
      from: "Shifananazrin15@gmail.com",
      to: email,
      subject: "Rent a car ACCOUNT REGISTRATION",
      html: `<p>YOUR OTP FOR REGISTERING IN RENT A CAR IS ${OTP}</p>`,
    };

    if (password) {
      await mailTransporter.sendMail(mailDetails);
      console.log("Email Sent Successfully");
      res.send({ email: true });
    }
  } catch (err) {
    console.log("Error Occurs: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const PostOtp = async (req, res) => {
  const { otp } = req.body;

  console.log(req.body);
  console.log(OTP);

  if (OTP == otp) {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const user = new User({
      name: name,
      email: email,
      password: hashPassword,
    });

    user.save().then(() => {
      res.send({ success: true });
    });
  } else {
    console.log("otp error");
    res.send({ OTP: "OTP ERROR" });
  }
};

//user login

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return new Error(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Signup please" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "invalid Email/Password" });
  }

  // after password is correct we want to generate a token
  const token = jwt.sign(
    { id: existingUser._id, name: existingUser.name },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "35s" }
  );

  return res.status(200).json({
    message: "successfully Logged In",
    name: existingUser.name,
    token,
    email: existingUser.email,
    uid: existingUser._id,
    wallet:existingUser.walletBalance,
  });
};

//verify token
const verifyTocken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  console.log(token);
  //     const headers =req.headers[`authorization`];
  //     // console.log(headers)
  //     const token =  headers.split(" ")[1]
  if (!token) {
    res.status(404).json({ message: "No tocken found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "invalid Tocken" });
    }
    console.log(user.id);
    req.id = user.id;
  });
  next();
};

const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    return new Error(err);
  }
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  return res.status(200).json({ user });
};

//verify token
const refreshToken = (req, res, next) => {
  if (!req.headers.hasOwnProperty("cookie")) {
    return res.status(400).json({ message: "Could not find cookie" });
  }
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];
  if (!prevToken) {
    return res.status(400).json({ message: "couldnt find token" });
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication is failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = " ";
    // it will clean prev token from cookie then generate new tocken

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30s",
    });
    //regenerate the cookie
    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30), //30 seconds
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id; //attaching req.id to user.id
    next();
  });
};

const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const cars = await carModel.findOne({ _id: id });
    // const discounts = await Products.find();

    res.send({ cars });
  } catch (error) {
    console.log(error.message);
  }
};

const booking = async (req, res) => {
  const { user, carName, from, to, driverRequired, totalDays, totalAmount } =
    req.body;
  // req.body.transtionid="1234"
  try {
    const booking = new Booking({
      user,
      carName,
      from,
      to,
      driverRequired,
      totalDays,
      totalAmount,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getbookingDetail = async (req, res) => {
  try {
    const { user_id, carName } = req.query;
    console.log(req.query);
    // console.log(carName)
    const allCarBookings = await Booking.find({ cars: carName });
    res.send({ allCarBookings, success: true });
  } catch (error) {
    console.log(error.message);
    // res.send({ success: false });
  }
};

const getOderDetail = async (req, res) => {
  try {
    const { uid } = req.query;
    // console.log(uid)
    // console.log(carName)
    const userBooked = await Booking.find({ user_id: uid });
    console.log(userBooked);
    console.log(userBooked.to);
    if (userBooked) {
      res.send({ userBooked, success: true });
    }
  } catch (error) {
    console.log(error.message);
    // res.send({ success: false });
  }
};

const confirmOrder = async (req, res) => {
  let {
    carName,
    from,
    to,
    driverRequired,
    totalDays,
    totalAmount,
    paymethod,
    uid,
  } = req.body;
  const order = new Booking({
    order_id: Date.now(),
    user_id: uid,
    cars: carName,
    from: from,
    to: to,
    driverRequired: driverRequired,
    totalDays: totalDays,
    expectedDelivery: totalDays,
    totalAmount: totalAmount,
    paymentMethod: paymethod,
    order_placed_on: new Date(),
  });

  order.save().then((order) => {
    const oid = order._id;

    if (paymethod === "online") {
      const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `${oid}`,
      };

      instance.orders.create(options, (err, orders) => {
        if (err) {
          console.log(err);
        } else {
          return res.json([{ success: false, orders }]);
        }
      });
    } else if (paymethod === "wallet") {
      User.findOne({ _id: uid }).then((user) => {
        if (user.walletBalance < totalAmount) {
          console.log(totalAmount);
          updatedTotalAmount = totalAmount - user.walletBalance;
          console.log(updatedTotalAmount);
          const options = {
            amount: updatedTotalAmount * 100,
            currency: "INR",
            receipt: `${oid}`,
          };

          instance.orders.create(options, (err, orders) => {
            if (err) {
              console.log(err);
            } else {
              return res.json([{ success: false, orders }]);
            }
          });
          user.walletBalance = 0;
          user.save();
        } else {
          // Deduct final amount from user's wallet
          user.walletBalance = user.walletBalance - totalAmount;
          user.save();
          console.log(user);

          return res.json([{ success: true, totalAmount }]);
        }
      });
    }
  });
};

const verifyPayment = async (req, res) => {
  console.log("reached verify paymet");
  const details = req.body;
  console.log(details);
  const crypto = require("crypto");
  let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(details.razorpay_order_id + "|" + details.razorpay_payment_id);
  hmac = hmac.digest("hex");

  if (hmac == details.razorpay_signature) {
    console.log("payment verified!");
    // const objId = new mongoose.Types.ObjectId(details.order.receipt);
    // console.log(objId);
    Booking.updateOne(
      { user_id: details.userId },
      { $set: { paymentStatus: "Paid" } }
    )
      .then(() => {
        res.json({ success: true });
      })
      .catch((err) => {
        console.error(err);
        res.json({ success: false, err_message: "payment failed" });
      });
  } else {
    res.json({ success: false, err_message: "payment failed" });
  }
};

const paymentFailure = (req, res) => {
  const details = req.body;
  console.log(details);
  res.send("payment failed");
};

const getWalletDetail = async (req, res) => {
  try {
    const { uid } = req.query;

    const found = await User.findOne({ _id: uid });
    console.log(found); // log the value of found

    if (found) {
      res.send({ wallet: found.walletBalance, success: true });
    } else {
      res.send({ success: false });
    }
  } catch (error) {
    console.log(error.message);
    res.send({ success: false }); // log the error and send response with success: false
  }
};

const cancel = async (req, res) => {
  try {
    const { id } = req.params;
    let value;
    const check = await Booking.findOne({ order_id: id });
    // console.log(order_id)
    if (check) {
      if (check.cancel === "false") {
        value = "true";
      }
    } else {
      throw new Error("Something went wrong");
    }
    await Booking.updateOne({ order_id: id }, { $set: { cancel: value } });
    res.send({ success: true, message: "oder cancelled " });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

exports.signup = signup;
exports.login = login;
exports.verifyTocken = verifyTocken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.getProductDetail = getProductDetail;
exports.PostOtp = PostOtp;
exports.booking = booking;
exports.confirmOrder = confirmOrder;
exports.paymentFailure = paymentFailure;
exports.verifyPayment = verifyPayment;
exports.getOderDetail = getOderDetail;
exports.getWalletDetail = getWalletDetail;
exports.cancel = cancel;
exports.getbookingDetail = getbookingDetail;
