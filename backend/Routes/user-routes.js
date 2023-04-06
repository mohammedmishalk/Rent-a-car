const express = require('express');
const { 
  signup,
  login,
  verifyTocken,
  getUser,
  refreshToken,
  PostOtp,
  getProductDetail,
   booking,
   getbookingDetail,
   confirmOrder,
   paymentFailure,
   verifyPayment,
   getOderDetail,
   getWalletDetail,
   cancel
} = require('../Controllers/user-controller');
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/alluser", verifyTocken, getUser);
router.get("/refresh", refreshToken, verifyTocken, getUser);
router.post("/verify-otp", PostOtp);
router.get("/product/:id", getProductDetail);
router.post("/booking", booking);  
router.get("/history", getbookingDetail);
router.get("/oderhistory", getOderDetail);
router.get("/walletbalance", getWalletDetail);/// changed the route to match the frontend call
router.post('/orderConfirmed',confirmOrder);
router.post('/verifyPayment',verifyPayment);
router.get('/paymentFail',paymentFailure);
router.put('/cancel/:id', cancel);



module.exports = router;
