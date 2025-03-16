const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  hotel_name: String,
  hotel_link: String,
  hotel_description: String,
  hotel_images: [String],
  hotel_location: {
    neighbourhood: String,
    distance_from_city_centre: String,
    rating: {
      score: String,
      review_count: Number
    },
    top_location: String
  },
  price: {
    amount: String,
    description: String
  },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }  // Mapping to Location
}, { timestamps: true });

module.exports = mongoose.model('Hotel', HotelSchema);
