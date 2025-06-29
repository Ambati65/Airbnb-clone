const Listing = require('../models/listing');
const Review = require('../models/review');

const isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to access this page');
        return res.redirect('/login');
    }
    next();
};

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }
        
        if (!listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash('error', 'You are not authorized to perform this action');
            return res.redirect(`/listings/${id}`);
        }
        
        next();
    } catch (error) {
        req.flash('error', 'Something went wrong');
        return res.redirect('/listings');
    }
};

const isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewid } = req.params;
        const review = await Review.findById(reviewid);
        
        if (!review) {
            req.flash('error', 'Review not found');
            return res.redirect(`/listings/${id}`);
        }
        
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash('error', 'You are not authorized to perform this action');
            return res.redirect(`/listings/${id}`);
        }
        
        next();
    } catch (error) {
        req.flash('error', 'Something went wrong');
        return res.redirect(`/listings/${req.params.id}`);
    }
};

module.exports = {
    isLogin,
    saveRedirectUrl,
    isOwner,
    isReviewAuthor
};
