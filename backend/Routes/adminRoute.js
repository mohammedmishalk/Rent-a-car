const express = require('express');
const multer  = require('multer')


const { storage } = require('../middleware/cloudinary');
const upload = multer({ storage })
const validateAdminToken = require('../middleware/adminToken');

const { 
  AddCars,
  getAllCars,
  blockCars,
  blockUnblockUser,
  getAllusers,
  getAllbooking,
  Refunde,
  Delivery,
  adminHomeRender,
  adminLogin,
  getSalesReport,
  updateBookingStatus
 
} = require('../Controllers/Admin-controller');
const router = express.Router();
router.post('/login', adminLogin);
router.post("/addcar",validateAdminToken,upload.array('image', 4), AddCars);
router.get("/blockcars/:id", validateAdminToken,blockCars);
router.get("/getallcars",getAllCars);
router.get('/blockuser/:id', validateAdminToken,blockUnblockUser);
router.get('/users',validateAdminToken,getAllusers)
router.get('/booking',validateAdminToken,getAllbooking)
router.put('/Refunde/:id',validateAdminToken,Refunde)
router.put('/deliver/:id',validateAdminToken,Delivery)
router.put('/dropped/:id',validateAdminToken,updateBookingStatus)
router.get('/home',validateAdminToken,adminHomeRender);
router.get('/salesReport',validateAdminToken,getSalesReport);


module.exports = router;
