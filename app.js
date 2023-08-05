if(process.env.NODE_ENV  !== "production"){
      require('dotenv').config();
}

console.log(process.env.secret);



const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");

const methodOverride = require('method-override');
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressErr");
const {campgroundSchema , reviewSchema} = require('./schemas');
const Review = require("./models/review");
const Campground = require('./models/campground');
const userRoutes = require('./routes/users');
const campgroundRoutes= require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
      console.log("mongoose connection open..");
})
.catch((err)=>{
      console.log("oh no error");
      console.log(err);
})

// mongoose.connect("mongodb://localhost:27017/yelp-camp" ,{
//       useNewUrlParser : true,
//       // useCreateIndex:true,
//       useUnifiedTopology : true
            // useFindAndModify : false;
// })

// const db = mongoose.connection;
// db.on("error" , console.error.bind(console , "connnection error:"));
// db.once("open" , ()=>{
//       console.log("database connected");
// });




app.set('view engine' , 'ejs');
app.set('views' ,  path.join(__dirname , 'views'));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.engine('ejs' , ejsMate);


const validateCampground = (req , res , next)=>{

        

      const {error} = campgroundSchema.validate(req.body);

      if(error){
            const msg = error.details.map(el =>el.message).join(',');
            throw new ExpressError(msg , 400);
      }else{
            next(); 
      }
      
}

const validateReview = (req , res , next) =>{
      const {error} = reviewSchema.validate(req.body);
      if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
      } else {
        next();
      }

}

const sessionConfig = {
      secret : 'thisshouldbeabettersecret',
      resave: false,
      saveUninitialized : true,
      
      
      cookie : {
            httpOnly : true, 
            expires : Date.now() + 1000 * 60 * 60 ,
            maxAge : 1000 * 60 * 60,
            
      }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session(sessionConfig));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res , next)=>{
      // console.log(req.session);
      res.locals.currentUser = req.user;
      res.locals.success = req.flash('success');
      res.locals.error = req.flash('error');
      next();
});

app.get('/fakeuser' , async (req , res)=>{
      const user = new User({email : 'kumarrr2001@gmail.com' , username : 'kumarrr'});
      const newUser = await User.register(user , 'lamborghini');
      res.send(newUser);
});





app.get('/' , (req , res)=>{
      res.render('home');
})

app.use('/' , userRoutes);
app.use('/campgrounds' , campgroundRoutes);
app.use('/campgrounds/:id/reviews' , reviewRoutes);
app.use(express.static(path.join(__dirname , 'public')));






app.get('/makecampground' , async (req , res)=>{
      // const camp = new Campground({
      //       title : "ranchi" , description : "cheap camping.!"
      // })

      // await camp.save();
      // res.send(camp);
})

app.all('*', (req , res , next) =>{
      next(new ExpressError("Page not found" , 400));
})

app.use((err, req , res , next)=>{
     const {statusCode = 500} = err;
     if(!err.message){
      err.message ="something went wrong..";
     }
     res.status(statusCode).render('error' , {err});
})

app.listen(3000 , ()=>{
      console.log("serving on port 3000")
})