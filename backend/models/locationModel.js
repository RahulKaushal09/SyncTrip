const mongoose = require('mongoose');

// Define the location schema
const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    best_time: String,
    description: String,
    rating: Number,
    photos: [String],
    placesNumberToVisit: Number,
    full_details: {
        full_description: String,
        additional_info: [String]
    },
    top_places_to_visit: [{
        place_id: mongoose.Schema.Types.ObjectId,
        name: String,
        link: String,
        image: String
    }],
    hotels: [{
        hotel_id: mongoose.Schema.Types.ObjectId,
        name: String,
        link: String,
        location: {
            neighbourhood: String,
            distance_from_city_centre: String,
            rating: Number
        },
        price: {
            amount: Number,
            currency: String,
            description: String
        }
    }],
    places_to_visit: [{
        place_id: mongoose.Schema.Types.ObjectId,
        title: String,
        rating: Number,
        description: String,
        image: String
    }]
});

// Create and export the model
module.exports = mongoose.model('Location', locationSchema);
