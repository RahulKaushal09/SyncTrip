const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const router = express.Router();
const Trip = require('../models/tripModel');
const User = require('../models/userModel'); // Adjust path
const jwt = require('jsonwebtoken');
const multer = require('multer');
const supabase = require('../config/supabaseClient.js'); // Adjust path


const authenticateToken = require('../middleware/middleware.js').authenticateToken; // Adjust path
// User Registration
const upload = multer({
    storage: multer.memoryStorage(), // Store file in memory
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
        files: 1, // Limit to 1 file
        fields: 20, // Limit number of non-file fields
    },
    fileFilter: (req, file, cb) => {
        // Ensure only images are allowed
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
}).fields([{ name: 'MainImage', maxCount: 1 }]); // Expect 'MainImage' field
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

        // Update statuses based on the latest date in timelines
        for (let trip of trips) {
            let newStatus = trip.requirements?.status || 'scheduled'; // Default status if undefined

            // Modified: Check if timelines exists and has entries
            if (trip.essentials.timelines && trip.essentials.timelines.length > 0) {
                // Find the earliest fromDate and latest tillDate
                const fromDates = trip.essentials.timelines.map(t => new Date(t.fromDate));
                const tillDates = trip.essentials.timelines.map(t => new Date(t.tillDate));

                const earliestFromDate = new Date(Math.min(...fromDates));
                const latestTillDate = new Date(Math.max(...tillDates));

                earliestFromDate.setHours(0, 0, 0, 0);
                latestTillDate.setHours(0, 0, 0, 0);

                // Determine status based on earliest fromDate and latest tillDate
                if (earliestFromDate > today) {
                    newStatus = 'scheduled';
                } else if (earliestFromDate <= today && today <= latestTillDate) {
                    newStatus = 'active';
                } else {
                    newStatus = 'completed';
                }
            } else {
                // Fallback: If no timelines, assume completed (or keep existing status)
                newStatus = 'completed';
            }

            // Only update if status has changed
            if (trip.requirements.status !== newStatus) {
                trip.requirements.status = newStatus;
                await trip.save(); // Save updated status to DB
            }
        }

        // Modified: Fix appliedUsers mapping
        const response = {
            trips: trips.map(trip => ({
                ...trip._doc,
                peopleApplied: trip.peopleApplied && trip.peopleApplied.length > 0
                    ? trip.peopleApplied.map(user => ({
                        name: user.name,
                        profilePicture: user.profile_picture?.[0] || 'https://via.placeholder.com/40',
                    }))
                    : [],
            })),
            totalTrips: trips.length,
        };

        res.json(response);

    } catch (error) {
        console.error('Error in /getAllTrips:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});


// User Login
router.post('/addNewTrip', upload, async (req, res) => {
    try {

        // const { title, locationId, MainImageUrl, itinerary, tripRating, requirements, essentials, selectedHotelId } = req.body;

        const {
            title,
            locationId,
            itinerary,
            tripRating,
            requirements,
            essentials,
            selectedHotelId,
        } = req.body;


        const parsedRequirements = requirements ? JSON.parse(requirements) : {};
        const parsedEssentials = essentials ? JSON.parse(essentials) : {};
        const parsedSelectedHotelId = selectedHotelId ? JSON.parse(selectedHotelId) : [];

        let mainImageUrl = '';
        let decodedItinerary = itinerary;
        if (decodedItinerary && decodedItinerary.length > 0) {
            decodedItinerary = decodeURIComponent(decodedItinerary);
        }

        // Handle file upload to Supabase
        if (req.files && req.files.MainImage) {
            const file = req.files.MainImage[0];
            const ext = file.originalname.split('.').pop();
            const fileName = `${title.trim()}_${Date.now()}.${ext}`;


            // Upload to Supabase
            const { data, error } = await supabase.storage
                .from('trip-images')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (error) {
                console.error('Supabase upload error:', error);
                return res.status(500).json({ message: 'Error uploading file to Supabase' });
            }

            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from('trip-images')
                .getPublicUrl(fileName);

            if (!publicUrlData?.publicUrl) {
                return res.status(500).json({ message: 'Error getting public URL' });
            }

            mainImageUrl = publicUrlData.publicUrl;

            // Clear file buffer reference
            file.buffer = null; // Ensure buffer is dereferenced
        }
        // Create new trip
        const trip = new Trip({
            title: title?.trim(),
            locationId,
            MainImageUrl: mainImageUrl,
            numberOfPeopleApplied: 0,
            include: {
                travel: true,
                food: true,
                hotel: true,
            },
            itinerary: decodedItinerary,
            tripRating: parseInt(tripRating) || 5,
            requirements: parsedRequirements,
            essentials: parsedEssentials,
            selectedHotelId: parsedSelectedHotelId,
            availableSeats: parsedEssentials.availableSeats || 10,
        });
        await trip.save();
        res.status(201).json({ message: 'Trip added successfully' });
    } catch (error) {
        console.error('Error in /addNewTrip:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
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
        const userTrip = currentUser.trips.find(t => t.tripId.toString() === tripId);
        let timeline = null;

        if (userTrip?.slotId && trip.essentials.timelines?.length > 0) {
            // Find the timeline slot matching the user's selected slotId
            const selectedSlot = trip.essentials.timelines.find(
                slot => slot.slotId === userTrip.slotId
            );
            if (selectedSlot) {
                timeline = {
                    fromDate: selectedSlot.fromDate,
                    tillDate: selectedSlot.tillDate
                };
            }
        } else if (userTrip?.startDate && userTrip?.endDate) {
            // Fallback: Use startDate and endDate from User.trips if slotId is missing
            timeline = {
                fromDate: userTrip.startDate,
                tillDate: userTrip.endDate
            };
        } else if (trip.essentials.timeline) {
            // Fallback: Use existing essentials.timeline for unmigrated trips
            timeline = {
                fromDate: trip.essentials.timeline.fromDate,
                tillDate: trip.essentials.timeline.tillDate
            };
        } else if (trip.essentials.timelines?.length > 0) {
            // Fallback: Use first timeline slot if no user-specific data
            timeline = {
                fromDate: trip.essentials.timelines[0].fromDate,
                tillDate: trip.essentials.timelines[0].tillDate
            };
        }
        if (timeline.fromDate && timeline.tillDate) {
            trip.essentials.timeline.fromDate = timeline.fromDate;
            trip.essentials.timeline.tillDate = timeline.tillDate;
        }

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

// // Delete User
// router.delete('/:id', async (req, res) => {
//     try {
//         await User.findByIdAndDelete(req.params.id);
//         res.json({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });
// router.get('/en/enrolled', authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const user = await User.findById(userId).populate({
//             path: 'trips.tripId',
//             select: 'title essentials itinerary requirements include MainImageUrl ',
//         });


//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const enrolledTrips = user.trips
//             .filter((trip) => trip.tripId && trip.tripId.essentials.timeline.tillDate > new Date())
//             .map((trip) => trip.tripId);

//         res.json(enrolledTrips);
//     } catch (error) {
//         console.error('Error fetching enrolled trips:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
router.get('/en/enrolled', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate({
            path: 'trips.tripId',
            select: 'title essentials itinerary requirements include MainImageUrl',
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Modified: Filter trips based on User.trips.endDate
        const enrolledTrips = user.trips
            .filter((trip) => {
                if (!trip.tripId) return false; // Skip invalid trips

                // Use endDate from User.trips (set during enrollment)
                if (trip.endDate) {
                    return new Date(trip.endDate) > new Date();
                }

                // // Fallback: Handle trips with old essentials.timeline (if unmigrated)
                // if (trip.tripId.essentials.timeline?.tillDate) {
                //     return new Date(trip.tripId.essentials.timeline.tillDate) > new Date();
                // }

                // Fallback: Handle trips with essentials.timelines
                if (trip.tripId.essentials.timelines?.length > 0) {
                    const latestTillDate = Math.max(
                        ...trip.tripId.essentials.timelines.map(t => new Date(t.tillDate).getTime())
                    );
                    return new Date(latestTillDate) > new Date();
                }

                return false; // Exclude trips with no valid date
            })
            .map((trip) => {
                // Modified: Transform tripId to include timelines (and handle old timeline)
                const tripData = trip.tripId._doc;
                if (tripData.essentials.timeline && !tripData.essentials.timelines) {
                    tripData.essentials.timelines = [{
                        slotId: 1,
                        fromDate: tripData.essentials.timeline.fromDate,
                        tillDate: tripData.essentials.timeline.tillDate
                    }];
                    // delete tripData.essentials.timeline;
                }
                // Include user's selected dates from User.trips
                return {
                    ...tripData,
                    userSelectedDates: {
                        startDate: trip.startDate,
                        endDate: trip.endDate
                    }
                };
            });

        res.json(enrolledTrips);
    } catch (error) {
        console.error('Error fetching enrolled trips:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});
router.post('/enroll/:tripId', authenticateToken, async (req, res) => {
    const { tripId } = req.params;
    const userId = req.user.id; // From token
    const { slotId } = req.body;
    try {
        // Find the trip and populate enrolled users
        const trip = await Trip.findById(tripId)
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        const selectedSlot = trip.essentials.timelines?.find(t => t.slotId === parseInt(slotId));
        if (!slotId || !selectedSlot) {
            return res.status(400).json({ message: 'Invalid or missing slotId' });
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
            status: 'ongoing',
            tripId: trip._id,
            bookingDate: new Date(),
            // Modified: Store selected slot's fromDate and tillDate
            slotId: parseInt(slotId), // Store the selected slotId
            startDate: selectedSlot.fromDate,
            endDate: selectedSlot.tillDate
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
