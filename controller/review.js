const Listing= require('../models/listing.js');
const Review= require('../models/review.js');
const ExpressError=require('../utils/ExpressError.js');
const {ReviewSchema}=require('../schema.js');


module.exports.createReview=async(req,res,next)=>{
let{error} =ReviewSchema.validate(req.body);
if(error){
    throw new ExpressError(400,error);
}
let listing= await Listing.findById(req.params.id);
let newReview=new Review(req.body.review);
newReview.author=req.user._id;
console.log(newReview);
listing.reviews.push(newReview);
await newReview.save();
await listing.save();

req.flash("success", "Review Added!");
res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res,next)=>{
  let{id,reviewid}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewid}});
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  };