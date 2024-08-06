const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../joi.js");
const {isLoggedin, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

const validateReview = (req, res, next)=>{
  let {error} = reviewSchema.validate(req.body);
  if( error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};


//Review post
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.postReview)
);

//delete Review Rout
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview)
);

module.exports = router;