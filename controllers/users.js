module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};


module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "welcome to yelpcamp..!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};


module.exports.loginUser = (req, res) => {
  // console.log(req.session);
  req.flash("success", "welcome back!");
  // console.log(req.session.returnTo);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  // console.log(redirectUrl);
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};


module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out ..!!");
    res.redirect("/campgrounds");
  });
  // here if i put parenthesis it is asking for logout callback and error ..... so i removed the parenthesis it did worked... i dont know how n why
  // req.flash("success", "Logged out ..!!");
  // res.redirect("/campgrounds");
};

