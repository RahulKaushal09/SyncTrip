const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    MainImageUrl: {
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
        availableSeats: Number,
        duration: String,
        bestTime: String,
        timeline: {
            fromDate: Date,
            tillDate: Date
        },
        timelines: [{
            slotId: {
                type: Number,
                required: true
            },
            fromDate: {
                type: Date,
                required: true
            },
            tillDate: {
                type: Date,
                required: true
            }
        }],
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
    peopleApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    selectedHotelId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    }],

});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;