const mongoose = require('mongoose');

// Define hotel schema
const hotelSchema = new mongoose.Schema({
  hotel_name: String,
  hotel_link: String,
  hotel_location: {
    neighbourhood: String,
    distance_from_city_centre: String,
    rating: Number
  },
  price: {
    amount: Number,
    currency: String,
    description: String
  },
  hotel_images: [String],
  hotel_description: String,
  rating: {
    score: Number
  }
});

// Create and export the model
module.exports = mongoose.model('Hotel', hotelSchema);
