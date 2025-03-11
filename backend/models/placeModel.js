const mongoose = require('mongoose');

// Define place schema
const placeSchema = new mongoose.Schema({
    name: String,
    link: String,
    description: String,
    rating: Number,
    highlights: String,
    image: String
});

// Create and export the model
module.exports = mongoose.model('Place', placeSchema);
