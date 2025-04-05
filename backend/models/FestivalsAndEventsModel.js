const mongoose = require('mongoose');

// Event Schema
const eventFestivalsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    Allcategories: {
        type: [String],  // Array of categories (e.g., 'comedy-shows', 'stand-up-comedy')
        required: true
    },
    Bestcategory: {
        type: String,  // Array of categories (e.g., 'comedy-shows', 'stand-up-comedy')
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    bookingLink: {
        type: String,
        required: true
    },
    location: {
        locationName: {
            type: String,
            required: true
        },
        locationCode: {
            type: String,
            required: true
        }
    },
    eventType: {
        type: String,
        required: true
    },
    tags: {
        type: [String],  // Array of tags (e.g., 'outdoor-events', 'fast-filling')
        required: true
    },
    lastUpdatedDate: {
        type: Number,  // Store epoch time in milliseconds
        default: () => Date.now()  // Get the current epoch timestamp
    },
    eventDateTime: {
        type: Number,  // Store epoch time in milliseconds
        default: 0  // Default to 0 if not provided
    }
});

// Location Schema
const LocationWithEventsSchema = new mongoose.Schema({
    locationName: {
        type: String,
        required: true
    },
    locationCode: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    events: [eventFestivalsSchema],  // Array of events
    lastUpdatedDate: {
        type: Number,  // Store epoch time in milliseconds
        default: () => Date.now()  // Get the current epoch timestamp
    },
    closestEventDateTime: {
        type: Number,  // Store epoch time in milliseconds
        default: 0  // Default to 0 if not provided
    }
});

// Models
const EventFestivals = mongoose.model('EventFestivals', eventFestivalsSchema);
const LocationWithEventsModel = mongoose.model('LocationWithEvents', LocationWithEventsSchema);

module.exports = { EventFestivals, LocationWithEventsModel };  // Correctly export the model
