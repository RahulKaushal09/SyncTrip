const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },

    essentials: {
        region: String,
        duration: String,
        bestTime: String,
        timeline: {
            fromDate: Date,
            tillDate: Date
        },
        altitude: Number,
        typeOfTrip: String,
        price: Number,
        season: String,
        pickup: {
            name: String,
            mapLocation: {
                lat: Number,
                long: Number
            }
        },
        dropPoint: {
            name: String,
            mapLocation: {
                lat: Number,
                long: Number
            }
        },
        nearbyPoints: {
            railway: String,
            airport: String,
            busStand: String
        }
    },
    numberOfPeopleApplied: Number,
    itinerary: String,
    tripRating: Number,
    requirements: {
        age: Number,
        fitnessCriteria: String,
        status: {
            type: String,
            enum: ['active', 'scheduled', 'completed']
        },
        previousExp: String
    },
    include: {
        travel: Boolean,
        food: Boolean,
        hotel: Boolean
    },
    peopleApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;