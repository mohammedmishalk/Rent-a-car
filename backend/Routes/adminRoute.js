const express = require('express');
const multer  = require('multer')


const { storage } = require('../middleware/cloudinary');
const upload = multer({ storage })


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
 
} = require('../Controllers/Admin-controller');
const router = express.Router();

router.post("/addcar",upload.array('image', 4), AddCars);
router.get("/blockcars/:id", blockCars);
router.get("/getallcars", getAllCars);
router.get('/blockuser/:id', blockUnblockUser);
router.get('/users',getAllusers)
router.get('/booking',getAllbooking)
router.put('/Refunde/:id',Refunde)
router.put('/deliver/:id',Delivery)
router.get('/home',adminHomeRender);



module.exports = router;
