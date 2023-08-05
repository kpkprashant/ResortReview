
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
// const ExpressError = require("../utils/ExpressErr");
// const campgrounds = require("../routes/campgrounds");
// const { campgroundSchema } = require("../schemas");
const Campground = require("../models/campground");
const {isLoggedIn , isAuthor , validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const {storage} = require('../cloudinary');
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.showIndex))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.makeCampground)
  );
      // .post(upload.array('image') , (req , res)=>{
      //     console.log(req.body , req.files);
      //     res.send("working ...!!")
      // });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.editCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


// router.get(
//   "/:id",
//   catchAsync(campgrounds.showCampground)
// );

router.get(
  "/:id/edit",
  isLoggedIn,isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

// router.put(
//   "/:id",
//   isLoggedIn,
//   isAuthor, 
//   validateCampground,
//   catchAsync(campgrounds.editCampground)
// );

// router.delete(
//   "/:id",
//   isLoggedIn,
//   isAuthor,
//   catchAsync(campgrounds.deleteCampground)
// );


module.exports = router;

