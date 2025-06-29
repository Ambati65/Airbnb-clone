const Listing = require('../models/listing');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const { ReviewSchema } = require('../utils/validation');

class ReviewController {
    // Create new review
    async createReview(req, res, next) {
        try {
            const { error } = ReviewSchema.validate(req.body);
            if (error) {
                throw new ExpressError(400, error.details.map(el => el.message).join(', '));
            }

            const listing = await Listing.findById(req.params.id);
            if (!listing) {
                req.flash("error", "Listing not found!");
                return res.redirect('/listings');
            }

            const newReview = new Review(req.body.review);
            newReview.author = req.user._id;

            listing.reviews.push(newReview);
            
            await newReview.save();
            await listing.save();

            req.flash("success", "Review Added Successfully!");
            res.redirect(`/listings/${listing._id}`);
        } catch (error) {
            next(error);
        }
    }

    // Delete review
    async destroyReview(req, res, next) {
        try {
            const { id, reviewid } = req.params;
            
            // Remove review reference from listing
            await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
            
            // Delete the review
            await Review.findByIdAndDelete(reviewid);
            
            req.flash("success", "Review Deleted Successfully!");
            res.redirect(`/listings/${id}`);
        } catch (error) {
            next(error);
        }
    }

    // Get all reviews for a listing
    async getReviewsForListing(req, res, next) {
        try {
            const { id } = req.params;
            const listing = await Listing.findById(id).populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            });

            if (!listing) {
                req.flash("error", "Listing not found!");
                return res.redirect('/listings');
            }

            res.json({
                success: true,
                reviews: listing.reviews
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReviewController();
