const express= require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const {isLogin,isOwner}=require('../middleware.js');

const controller=require('../controller/listing.js')

const multer  = require('multer')
const {storage}=require('../cloudConfig.js');
const upload = multer({  storage });


router.get('/',wrapAsync(controller.index));

router.get("/new",isLogin,controller.renderNewForm);

router.get('/:id',wrapAsync(controller.showListing));
  
router.get('/:id/edit',isLogin,isOwner,wrapAsync(controller.renderEditForm));

router.delete('/:id',isLogin,isOwner,wrapAsync(controller.destroyListing));

router.put("/:id",isLogin,isOwner,upload.single('listing[image]'), wrapAsync(controller.updateListing));

router.post("/",isLogin,upload.single('listing[image]'), wrapAsync(controller.createListing));

module.exports=router;