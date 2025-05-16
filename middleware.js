
const Listing= require('./models/listing.js');
const Review= require('./models/review.js');

module.exports.isLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','You must loggin to create post');
       return res.redirect('/listings');
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error','you are not owner of this listing');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.reviewAuthor=async(req,res,next)=>{
    let{id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if( !review.author.equals(res.locals.currUser._id)){
        req.flash('error','your are not Author of this review');
        return res.redirect(`/listings/${id}`);
    }
    next();
}