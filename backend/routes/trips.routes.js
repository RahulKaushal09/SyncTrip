const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const router = express.Router();
const Trip = require('../models/tripModel');

// User Registration
router.post('/getAllTrips', async (req, res) => {
    try {
        const trips = await Trip.find({});
        res.json(trips);

    } catch (error) {
        res.status(500).json({ error });
    }
});

// User Login
router.post('/addNewTrip', async (req, res) => {
    try {

        const { title, locationId, MainImageUrl, itinerary, tripRating, requirements, essentials } = req.body;
        const trip = new Trip({
            title,
            locationId,
            MainImageUrl,
            numberOfPeopleApplied: 0,
            include: {
                travel: true,
                food: true,
                hotel: true
            },
            itinerary,
            tripRating,
            requirements,
            essentials
        });
        await trip.save();
        res.status(201).json({ message: 'Trip added successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Get User Profile
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('locationId').populate('peopleApplied').populate('locationId.locationId');
        res.json(trip);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

// Update Status of trip 
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body; // Extract the status from the request body
        const trip = await Trip.findById(req.params.id); // Find the trip by ID

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' }); // Handle case where trip doesn't exist
        }

        trip.status = status; // Update the status field
        await trip.save(); // Save the updated trip

        res.json({ message: 'Trip status updated successfully', trip }); // Respond with success message and updated trip
    } catch (error) {
        res.status(500).json({ error }); // Handle server errors
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;
