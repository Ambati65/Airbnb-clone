const Listing= require('../models/listing.js');
const {ListingSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res,next)=>{
    const alllistings=await Listing.find({});
    res.render('listings/index.ejs',{alllistings});
}

module.exports.renderNewForm= (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing=async(req,res,next)=>{
      const {id}=req.params;
      const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
      if(!listing){
        req.flash("error","listing your looking for doesn't exist! ");
        res.redirect('/listings');
      }
      res.render('listings/show.ejs',{listing});
};

module.exports.renderEditForm=async (req,res,next)=>{
      const {id}=req.params;
      const listing=await Listing.findById(id);
      if(!listing){
        req.flash("error","listing your looking for doesn't exist! ");
        res.redirect('/listings');
      }
      let copyimage=listing.image.url;
      copyimage.replace('/upload','/upload/h_300w_250');
      res.render('listings/edit.ejs',{listing,copyimage});
};

module.exports.destroyListing=async (req,res,next)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect(`/listings`);
};

module.exports.updateListing=async (req,res,next)=>{
   let {error} = ListingSchema.validate(req.body);
    if (error){
      throw new ExpressError(400, error);
    }
    const {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings`);
};

module.exports.createListing=async(req, res,next) => {
    let {error} = ListingSchema.validate(req.body);
    if (error){
     throw new ExpressError(400, error);
    }

    let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
   .send();

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    newListing.geometry=response.body.features[0].geometry;

    await newListing.save();
    console.log(newListing);
    req.flash("success","New Listing Is Created!");
    res.redirect("/listings");
  };