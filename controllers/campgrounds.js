const{ cloudinary} = require("../cloudinary");
const Campground = require("../models/campground");

module.exports.showIndex = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.makeCampground = async (req, res, next) => {
  // if(!req.body.campground){
  //      throw new ExpressError('invalid campground data' , 400);
  // }

  const camp = new Campground(req.body.campground);
  camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.author = req.user._id;
  await camp.save();
  console.log(camp);
  req.flash("success", "successfully added new campground");
  res.redirect(`/campgrounds/${camp._id}`);

  // console.log(req.body);
  // res.send("added..")
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!campground) {
    req.flash("error", "campground not found..");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "campground not found..");
    res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const newCamp = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCamp.images.push(...imgs);
  await newCamp.save();

  if (req.body.deleteImages) {

      for(let filename of req.body.deleteImages){
           await  cloudinary.uploader.destroy(filename);
      }
    await newCamp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(newCamp);
  }
  req.flash("success", "sucessfully updated campground...");
  res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "sucessfully deleted campground...");
  res.redirect("/campgrounds");
};
