const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const Campground = require('../models/campground');
const cities = require('./cities');

const {descriptors , places} = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
      console.log("mongoose connection open..");
})
.catch((err)=>{
      console.log("oh no error");
      console.log(err);
})

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async ()=>{
      await Campground.deleteMany({});
      for(let i = 0  ; i < 50 ; i++){
            const price = Math.floor(Math.random() * 20) + 10;
            const rand = Math.floor(Math.random() * 1000);
            const camp = new Campground({
              author: "641c5ad8fa0274ee2239cfab",
              location: `${cities[rand].city} , ${cities[rand].state}`,
              title: `${sample(descriptors)}  ${sample(places)}`,
              description:
                "shfwh wqeuyw`   p waeq;pdoxiznduywe r4876djnxhso7whfushdeuw4y83qanedwait3w4wydpyas7352qo3nasdbsh hsd y78waqtlo8 szayyyyywl",
              price: price,
              
              images: [
                {
                  url: "https://res.cloudinary.com/dh6ggiycp/image/upload/v1680014368/YelpCamp/hbtjlcwdlouhu2niwmyh.jpg",
                  filename: "YelpCamp/hbtjlcwdlouhu2niwmyh",
                  
                },
                {
                  url: "https://res.cloudinary.com/dh6ggiycp/image/upload/v1680014369/YelpCamp/lk7czsn09p96xt7yge4x.jpg",
                  filename: "YelpCamp/lk7czsn09p96xt7yge4x",
                 
                },
              ],
            });

            await camp.save();
      }
}


seedDB()
      .then(()=>{
            mongoose.connection.close();
      })


      
