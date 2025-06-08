const express = require('express');
const router = express.Router();
const Trip = require('../models/tripModel');
const User = require('../models/userModel');
const { authenticateAdmin } = require('../middleware/middleware');

// Get all trips for admin dashboard
router.get('/trips', authenticateAdmin, async (req, res) => {
    try {
        const trips = await Trip.find({}).populate({
            path: 'peopleApplied',
            select: 'name profile_picture _id'
        });

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'No trips found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let trip of trips) {
            let newStatus = trip.requirements?.status || 'scheduled';
            if (trip.essentials.timelines && trip.essentials.timelines.length > 0) {
                const fromDates = trip.essentials.timelines.map(t => new Date(t.fromDate));
                const tillDates = trip.essentials.timelines.map(t => new Date(t.tillDate));
                const earliestFromDate = new Date(Math.min(...fromDates));
                const latestTillDate = new Date(Math.max(...tillDates));
                earliestFromDate.setHours(0, 0, 0, 0);
                latestTillDate.setHours(0, 0, 0, 0);

                if (earliestFromDate > today) {
                    newStatus = 'scheduled';
                } else if (earliestFromDate <= today && today <= latestTillDate) {
                    newStatus = 'active';
                } else {
                    newStatus = 'completed';
                }
            } else {
                newStatus = 'completed';
            }

            if (trip.requirements.status !== newStatus) {
                trip.requirements.status = newStatus;
                await trip.save();
            }
        }

        const response = {
            trips: trips.map(trip => ({
                ...trip._doc,
                peopleApplied: trip.peopleApplied && trip.peopleApplied.length > 0
                    ? trip.peopleApplied.map(user => ({
                        name: user.name,
                        profilePicture: user.profile_picture?.[0] || 'https://via.placeholder.com/40',
                        userId: user._id,
                    }))
                    : [],
            })),
            totalTrips: trips.length,
        };

        res.json(response);
    } catch (error) {
        console.error('Error in /admin/trips:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
router.get('/trip/:id', authenticateAdmin, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const trip = await Trip.findById(req.params.id).lean();
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const appliedUsers = await User.find({
            _id: { $in: trip.peopleApplied },
        })
            .populate({
                path: 'friends.users.userId',
                select: 'name',
            })
            .lean();

        const formattedUsers = appliedUsers.map((user) => {
            const userTrip = user.trips.find((t) => t.tripId.toString() === trip._id.toString());
            const friendsForTrip = user.friends.find((f) => f.tripId.toString() === trip._id.toString());
            const friends = friendsForTrip
                ? friendsForTrip.users.map((f) => ({
                    userId: f.userId._id,
                    status: f.status,
                    name: f.userId.name, // Populated name
                }))
                : [];

            return {
                _id: user._id,
                name: user.name,
                profilePicture: user.profile_picture?.[0] || 'https://via.placeholder.com/40',
                age: user.dateOfBirth
                    ? Math.floor((new Date() - new Date(user.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25))
                    : null,
                rating: user.rating || 5,
                slotId: userTrip ? userTrip.slotId : null,
                startDate: userTrip ? userTrip.startDate : null,
                endDate: userTrip ? userTrip.endDate : null,
                remark: userTrip ? userTrip.remark : '',
                friends,
            };
        });

        res.json({
            trip,
            appliedUsers: formattedUsers,
            numberOfPeopleApplied: trip.peopleApplied.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// // Get specific trip details for admin
// router.get('/trip/:id', authenticateAdmin, async (req, res) => {
//     try {
//         const trip = await Trip.findById(req.params.id).populate({
//             path: 'peopleApplied',
//             select: 'name profile_picture dateOfBirth rating trips friends'
//         });
//         if (!trip) {
//             return res.status(404).json({ error: 'Trip not found' });
//         }

//         const appliedUsers = trip.peopleApplied.map(user => {
//             const userTrip = user.trips.find(t => t.tripId.toString() === trip._id.toString());
//             const friendsForTrip = user.friends.find(f => f.tripId.toString() === trip._id.toString());
//             const friends = friendsForTrip ? friendsForTrip.users.map(f => ({
//                 userId: f.userId,
//                 status: f.status,
//                 name: user.name // Note: Populate friends.users.userId for names if needed
//             })) : [];
//             return {
//                 _id: user._id,
//                 name: user.name,
//                 profilePicture: user.profile_picture?.[0] || 'https://via.placeholder.com/40',
//                 age: user.dateOfBirth ? Math.floor((new Date() - new Date(user.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25)) : null,
//                 rating: user.rating || 5,
//                 slotId: userTrip ? userTrip.slotId : null,
//                 startDate: userTrip ? userTrip.startDate : null,
//                 endDate: userTrip ? userTrip.endDate : null,
//                 remark: userTrip ? userTrip.remark : '',
//                 friends
//             };
//         });

//         res.json({
//             trip: {
//                 _id: trip._id,
//                 title: trip.title,
//                 MainImageUrl: trip.MainImageUrl,
//                 essentials: trip.essentials,
//                 numberOfPeopleApplied: trip.numberOfPeopleApplied,
//                 itinerary: trip.itinerary,
//                 tripRating: trip.tripRating,
//                 requirements: trip.requirements,
//                 include: trip.include,
//                 locationId: trip.locationId,
//                 selectedHotelId: trip.selectedHotelId
//             },
//             appliedUsers
//         });
//     } catch (error) {
//         console.error('Error in /admin/trip/:id:', error);
//         res.status(500).json({ error: error.message || 'Server error' });
//     }
// });

// Add/update remark for a user's trip enrollment
router.post('/trip/:tripId/user/:userId/remark', authenticateAdmin, async (req, res) => {
    try {
        const { tripId, userId } = req.params;
        const { remark } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userTrip = user.trips.find(t => t.tripId.toString() === tripId);
        if (!userTrip) {
            return res.status(400).json({ error: 'User not enrolled in this trip' });
        }

        userTrip.remark = remark || '';
        await user.save();

        res.json({ message: 'Remark updated successfully' });
    } catch (error) {
        console.error('Error in /admin/trip/:tripId/user/:userId/remark:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

module.exports = router;