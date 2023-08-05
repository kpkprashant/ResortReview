const express = require('express');
const router = express.Router({mergeParams : true});
const Review = require("../models/review");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressErr");
const { campgroundSchema, reviewSchema } = require("../schemas");
const {validateReview , isLoggedIn , isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post(
  "/",
  isLoggedIn, 
  validateReview,
  catchAsync(reviews.addReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn , isReviewAuthor, 
  catchAsync(reviews.deleteReview)
);


module.exports = router;