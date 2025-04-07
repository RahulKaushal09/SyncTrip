const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    best_time: String,
    description: String,
    href: String,
    objective: String,
    rating: String,
    title: String,
    PlaceImageLink: String,
    PlacesToVisitLink: String,
    HotelsLink: String,
    placesNumberToVisit: String,
    fullDetails: {
        full_description: String,
        additional_info: [String],
        top_places_to_visit: [{
            name: String,
            link: String,
            image: String
        }],
        coordinates: {
            lat: {
                type: Number,
                default: 0

            },

            long: {
                type: Number,
                default: 0
            }
        },
    },
    photos: [String],
    images: [String],
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],   // Linking Hotels
    placesToVisit: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlacesToVisit' }]  // Linking Places to Visit
}, { timestamps: true });

module.exports = mongoose.model('Location', LocationSchema);
