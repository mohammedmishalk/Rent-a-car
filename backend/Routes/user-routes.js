const express = require("express");
const {
  signup,
  login,

  // getUser,

  PostOtp,
  getProductDetail,
  booking,
  getbookingDetail,
  confirmOrder,
  paymentFailure,
  verifyPayment,
  getOderDetail,
  getWalletDetail,
  cancel,
} = require("../Controllers/user-controller");
const validateUserToken = require("../middleware/userToken");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// router.get("/alluser", validateUserToken, getUser);
// router.get("/refresh", refreshToken, verifyTocken, getUser);
router.post("/verify-otp", PostOtp);
router.get("/product/:id", validateUserToken, getProductDetail);
router.post("/booking", validateUserToken, booking);
router.get("/history", validateUserToken, getbookingDetail);
router.get("/oderhistory", validateUserToken, getOderDetail);
router.get("/walletbalance", validateUserToken, getWalletDetail); /// changed the route to match the frontend call
router.post("/orderConfirmed", validateUserToken, confirmOrder);
router.post("/verifyPayment", validateUserToken, verifyPayment);
router.get("/paymentFail", validateUserToken, paymentFailure);
router.put("/cancel/:id", validateUserToken, cancel);

module.exports = router;
