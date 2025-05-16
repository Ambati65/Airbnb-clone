const express= require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const {isLogin,reviewAuthor}=require('../middleware.js');
const reviewController=require('../controller/review.js');

router.post("/",isLogin, wrapAsync(reviewController.createReview));

router.delete("/:reviewid",isLogin,reviewAuthor,wrapAsync(reviewController.destroyReview));
  

module.exports=router;