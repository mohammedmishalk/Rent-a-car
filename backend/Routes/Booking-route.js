

const express = require('express');
const multer  = require('multer')
const router = express.Router();







router.get('/booking',validateAdminToken,getAllbooking)
router.put('/Refunde/:id',validateAdminToken,Refunde)
router.put('/deliver/:id',validateAdminToken,Delivery)