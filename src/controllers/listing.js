const Listing = require('../models/listing');
const { ListingSchema } = require('../utils/validation');
const ExpressError = require('../utils/ExpressError');
const geocodingService = require('../services/geocoding');

class ListingController {
    // Get all listings
    async index(req, res, next) {
        try {
            const allListings = await Listing.find({}).populate('owner');
            res.render('listings/index.ejs', { allListings });
        } catch (error) {
            next(error);
        }
    }

    // Render new listing form
    renderNewForm(req, res) {
        res.render('./listings/new.ejs');
    }

    // Show single listing
    async showListing(req, res, next) {
        try {
            const { id } = req.params;
            const listing = await Listing.findById(id)
                .populate({
                    path: "reviews",
                    populate: {
                        path: "author"
                    }
                })
                .populate("owner");

            if (!listing) {
                req.flash("error", "Listing you're looking for doesn't exist!");
                return res.redirect('/listings');
            }

            res.render('listings/show.ejs', { listing });
        } catch (error) {
            next(error);
        }
    }

    // Render edit form
    async renderEditForm(req, res, next) {
        try {
            const { id } = req.params;
            const listing = await Listing.findById(id);

            if (!listing) {
                req.flash("error", "Listing you're looking for doesn't exist!");
                return res.redirect('/listings');
            }

            let originalImageUrl = listing.image.url;
            originalImageUrl = originalImageUrl.replace('/upload', '/upload/h_300,w_250');
            
            res.render('listings/edit.ejs', { listing, originalImageUrl });
        } catch (error) {
            next(error);
        }
    }

    // Create new listing
    async createListing(req, res, next) {
        try {
            const { error } = ListingSchema.validate(req.body);
            if (error) {
                throw new ExpressError(400, error.details.map(el => el.message).join(', '));
            }

            // Get coordinates for the location
            const geometry = await geocodingService.getCoordinates(req.body.listing.location);

            const url = req.file.path;
            const filename = req.file.filename;
            
            const newListing = new Listing(req.body.listing);
            newListing.owner = req.user._id;
            newListing.image = { url, filename };
            newListing.geometry = geometry;

            await newListing.save();
            
            req.flash("success", "New Listing Created Successfully!");
            res.redirect("/listings");
        } catch (error) {
            next(error);
        }
    }

    // Update listing
    async updateListing(req, res, next) {
        try {
            const { error } = ListingSchema.validate(req.body);
            if (error) {
                throw new ExpressError(400, error.details.map(el => el.message).join(', '));
            }

            const { id } = req.params;
            let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

            if (typeof req.file !== "undefined") {
                const url = req.file.path;
                const filename = req.file.filename;
                listing.image = { url, filename };
                await listing.save();
            }

            req.flash("success", "Listing Updated Successfully!");
            res.redirect(`/listings/${id}`);
        } catch (error) {
            next(error);
        }
    }

    // Delete listing
    async destroyListing(req, res, next) {
        try {
            const { id } = req.params;
            await Listing.findByIdAndDelete(id);
            
            req.flash("success", "Listing Deleted Successfully!");
            res.redirect('/listings');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ListingController();
