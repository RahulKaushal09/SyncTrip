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
        const trips = await Trip.find({}).populate({
            path: 'peopleApplied',
            select: 'name profile_picture'
        });

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'No trips found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of the day

        // Update statuses based on date

        for (let trip of trips) {
            const fromDate = new Date(trip.essentials.timeline.fromDate);
            const tillDate = new Date(trip.essentials.timeline.tillDate);

            fromDate.setHours(0, 0, 0, 0);
            tillDate.setHours(0, 0, 0, 0);

            let newStatus = trip.requirements?.status;

            if (fromDate > today) {
                newStatus = 'scheduled';
            } else if (fromDate <= today && today <= tillDate) {
                newStatus = 'active';
            } else {
                newStatus = 'completed';
            }

            // Only update if status has changed
            if (trip.requirements.status !== newStatus) {
                trip.requirements.status = newStatus;
                await trip.save(); // Save updated status to DB
            }
        }

        // Construct response
        const appliedUsers = trips.map(trip => {
            if (trip.peopleApplied && trip.peopleApplied.length > 0) {
                trip.peopleApplied.map(user => ({
                    name: user.name,
                    profilePicture: user.profile_picture?.[0] || 'https://via.placeholder.com/40',
                }))
            }
        }
        );

        const response = {
            trips: trips.map((trip, index) => ({
                ...trip._doc,
                peopleApplied: appliedUsers[index],
            })),
            totalTrips: trips.length,
        };

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});


// User Login
router.post('/addNewTrip', async (req, res) => {
    try {

        const { title, locationId, MainImageUrl, itinerary, tripRating, requirements, essentials, selectedHotelId } = req.body;
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
            essentials,
            selectedHotelId,
            availableSeats: essentials.availableSeats,
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
        // console.log("Fetching trip with ID:", req.params.id);  // Log the trip ID for debugging
        const trip = await Trip.findById(req.params.id).populate({
            path: 'peopleApplied',
            select: 'name profile_picture dateOfBirth rating persona', // Select fields to return
            where: { showProfile: true } // Only include users who want to show their profile
            // Add any other fields you want to include
        });
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        const appliedUsers = trip.peopleApplied.map(user => {
            return {
                _id: user._id,
                name: user.name,
                profilePicture: user.profile_picture?.[0] || 'https://via.placeholder.com/40',
                age: user.dateOfBirth ? Math.floor((new Date() - new Date(user.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25)) : null,
                rating: user.rating || 5,
                persona: "",

            };
        });
        trip.peopleApplied = appliedUsers; // Replace with filtered users
        const response = {
            trip,
            appliedUsers: appliedUsers,
        };

        res.json(response);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});
router.get('/enrolled/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const tripId = req.params.id;

        const [trip, currentUser] = await Promise.all([
            Trip.findById(tripId).populate({
                path: 'peopleApplied',
                select: 'name profile_picture dateOfBirth showProfile rating',
            }),
            User.findById(userId)
        ]);

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        // if peopleApplied doesnot have current user then send 403 
        if (!trip.peopleApplied.some(user => user._id.toString() === userId)) {
            return res.status(403).json({ error: 'User not enrolled in this trip' });
        }
        // Find the current user's friendship list for this trip
        const userTripFriends = currentUser.friends.find(
            f => f.tripId.toString() === tripId
        );

        const appliedUsers = trip.peopleApplied
            .filter(user => user.showProfile && user._id.toString() !== userId)
            .map(user => {
                const age = user.dateOfBirth
                    ? Math.floor(
                        (new Date() - new Date(user.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25)
                    )
                    : null;

                // Determine friendship status
                let status = null;
                if (userTripFriends) {
                    const friendEntry = userTripFriends.users.find(
                        u => u.userId.toString() === user._id.toString()
                    );
                    if (friendEntry) {
                        status = friendEntry.status;
                    }
                }

                return {
                    _id: user._id,
                    name: user.name,
                    profilePicture: user.profile_picture?.[0] || 'https://via.placeholder.com/40',
                    age,
                    status, // Add status to response
                    rating: user.rating || 5,
                };
            });

        const response = {
            _id: trip._id,
            title: trip.title,
            MainImageUrl: trip.MainImageUrl,
            essentials: trip.essentials,
            numberOfPeopleApplied: trip.numberOfPeopleApplied || 0,
            itinerary: trip.itinerary,
            tripRating: trip.tripRating,
            requirements: trip.requirements,
            include: trip.include,
            locationId: trip.locationId,
            peopleApplied: appliedUsers,
            selectedHotelId: trip.selectedHotelId,
        };

        res.json(response);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid trip ID' });
        }
        res.status(500).json({ error: 'Failed to fetch trip details' });
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
router.get('/en/enrolled', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate({
            path: 'trips.tripId',
            select: 'title essentials itinerary requirements include MainImageUrl ',
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const enrolledTrips = user.trips
            .filter((trip) => trip.tripId && trip.tripId.essentials.timeline.tillDate > new Date())
            .map((trip) => trip.tripId);

        res.json(enrolledTrips);
    } catch (error) {
        console.error('Error fetching enrolled trips:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/enroll/:tripId', authenticateToken, async (req, res) => {
    const { tripId } = req.params;
    const userId = req.user.id; // From token

    try {
        // Find the trip and populate enrolled users
        const trip = await Trip.findById(tripId)
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if trip is enrollable
        if (trip.requirements.status === 'completed') {
            return res.status(400).json({ message: 'Cannot enroll in a completed trip' });
        }

        // Check if user is already enrolled
        if (trip.peopleApplied.some(user => user._id.toString() === userId)) {
            // get all other users who are willing to showprofile 
            var redirectionURL = process.env.BACKEND_URL + 'trips/en/' + tripId;
            // trip.peopleApplied = trip.peopleApplied.filter(user => user._id.toString() !== userId && user.showProfile == true);
            return res.status(201).json({ message: 'You are already enrolled in this trip', trip: trip, redirectionURL: redirectionURL });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update Trip
        trip.peopleApplied.push(userId);
        trip.numberOfPeopleApplied = (trip.numberOfPeopleApplied || 0) + 1;
        trip.essentials.availableSeats = (trip.essentials.availableSeats || 10) - 1; // Decrease available seats
        // Update User
        user.trips.push({
            status: 'ongoing', // Or 'scheduled' based on trip status
            tripId: trip._id,
            bookingDate: new Date(),
        });

        // Save both documents
        await Promise.all([trip.save(), user.save()]);

        // Re-fetch trip with updated peopleApplied (populated)
        // const updatedTrip = await Trip.findById(tripId).populate({
        //     path: 'peopleApplied',
        //     select: 'name profile_picture socialMedias.instagram dateOfBirth showProfile', // Select fields to return
        // });
        // console.log('Updated trip:', updatedTrip); // Log the updated trip for debugging
        var redirectionURL = process.env.BACKEND_URL + 'trips/en/' + tripId;
        // if (!updatedTrip) {
        //     return res.status(404).json({ message: 'Trip not found' });
        // }
        // updatedTrip.peopleApplied = updatedTrip.peopleApplied.filter(user => user.showProfile == true && user._id.toString() !== userId);
        // Send response
        res.status(200).json({
            success: true,
            message: 'Successfully enrolled in the trip',
            redirectionURL: redirectionURL,
            user,
        });
    } catch (err) {
        console.error('Error enrolling in trip:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
