const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../joi.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../model/listing.js");
const {isLoggedin, isOwner} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudCnfig.js")
const upload = multer({ storage});


const validateReview = (req, res, next)=>{
  let {error} = reviewSchema.validate(req.body);
  if( error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}

//Index Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedin,
  upload.single('listing[image]'),
  wrapAsync(listingController.postListing)

);

 
 //new Rout
 router.get("/new",isLoggedin,listingController.renderNewForm);
 
 //Show Rout
  router.route("/:id") 
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedin,
    isOwner,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing));

 //create Rout
  // router.post("/",isLoggedin,wrapAsync(listingController.postListing));


//edit Rout
  router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.edit)
);

// //update rout
//   router.put("/:id",isLoggedin,isOwner,wrapAsync(listingController.updateListing)
// );

//delete rout
  router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingController.deleteListing)
);

module.exports = router;