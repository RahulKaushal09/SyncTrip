const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const router = express.Router();
const Trip = require('../models/tripModel');
const User = require('../models/userModel'); // Adjust path
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/middleware.js').authenticateToken; // Adjust path
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
        console.log("Fetching trip with ID:", req.params.id);  // Log the trip ID for debugging
        const trip = await Trip.findById(req.params.id);


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
router.post('/enroll/:tripId', authenticateToken, async (req, res) => {
    const { tripId } = req.params;
    const userId = req.user.id; // From token

    try {
        // Find the trip and populate enrolled users
        const trip = await Trip.findById(tripId).populate({
            path: 'peopleApplied',
            select: 'name profile_picture socialMedias.instagram', // Select fields to return
        });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if trip is enrollable
        if (trip.requirements.status === 'completed') {
            return res.status(400).json({ message: 'Cannot enroll in a completed trip' });
        }

        // Check if user is already enrolled
        if (trip.peopleApplied.some(user => user._id.toString() === userId)) {
            return res.status(400).json({ message: 'You are already enrolled in this trip' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update Trip
        trip.peopleApplied.push(userId);
        trip.numberOfPeopleApplied = (trip.numberOfPeopleApplied || 0) + 1;

        // Update User
        user.trips.push({
            status: 'ongoing', // Or 'scheduled' based on trip status
            tripId: trip._id,
            bookingDate: new Date(),
        });

        // Save both documents
        await Promise.all([trip.save(), user.save()]);

        // Re-fetch trip with updated peopleApplied (populated)
        const updatedTrip = await Trip.findById(tripId).populate({
            path: 'peopleApplied',
            select: 'name profile_picture socialMedias.instagram age', // Select fields to return
        });
        // console.log('Updated trip:', updatedTrip); // Log the updated trip for debugging

        if (!updatedTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        // Send response
        res.status(200).json({
            success: true,
            message: 'Successfully enrolled in the trip',
            trip: updatedTrip, // Includes populated peopleApplied
            user,
        });
    } catch (err) {
        console.error('Error enrolling in trip:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
