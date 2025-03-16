const mongoose = require('mongoose');

const PlacesToVisitSchema = new mongoose.Schema({
    title: String,
    link: String,
    rating: String,
    description: String,
    highlights: String,
    image: [String],
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }  // Mapping to Location
}, { timestamps: true });

module.exports = mongoose.model('PlacesToVisit', PlacesToVisitSchema);
