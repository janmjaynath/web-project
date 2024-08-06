const { model } = require("mongoose");
const Listing = require("../model/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async(req,res)=>{
  const allListing =  await Listing.find({});
  res.render("./listings/index.ejs",{allListing});
 }

 module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id).populate({
   path:"reviews",
   populate : {
   path : "author",
 },
  }).populate("owner");
  if(!listing){
   req.flash("error"," Listing does not exist!");
   res.redirect("/listings");
  } 
  res.render("listings/show.ejs",{listing});
}

module.exports.postListing = async (req,res)=>{
  let url = req.file.path;
  let filename = req.file.filename;
  const newListings = new Listing(req.body.listing);
  newListings.owner = req.user._id;
  newListings.image = {url , filename};
  await newListings.save();
  req.flash("success","new Listing created!");
  res.redirect("/listings");
}

module.exports.edit = async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error"," Listing does not exist!");
    res.redirect("/listings");
   }
  //  let originalImageUrl = listing.image.url;
  //  originalImageUrl =  originalImageUrl.replace("/upload","/upload/h_300,w_ 250");
   res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async(req,res)=>{
  
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

  if(typeof req.file  !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();

 }

  req.flash("success"," Listing updated!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success"," Listing Deleted!");
  res.redirect("/listings")
}