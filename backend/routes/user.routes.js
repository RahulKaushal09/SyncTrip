const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/userModel');
const authenticateToken = require('../middleware/middleware.js').authenticateToken;
// User Registration
router.post('/basicRegistration', async (req, res) => {
    try {
        const { name, email, phone, password, sex } = req.body;
        email = email.toLowerCase(); // Normalize email to lowercase
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, phone, password: hashedPassword, sex });
        await user.save();
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({ user, token: accessToken, message: 'User BasicEnrollment successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login request body:', req.body); // Debugging line

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error });
    }
});
// Send Request
router.post('/sendRequest', authenticateToken, async (req, res) => {
    try {
        const { receiverId, tripId } = req.body;
        const senderId = req.userId;
        console.log('senderId:', senderId); // Debugging line
        console.log('receiverId:', receiverId); // Debugging line
        console.log('tripId:', tripId); // Debugging line


        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (senderId === receiverId) {
            return res.status(400).json({ message: 'Cannot send request to yourself' });
        }

        // Check if request already exists in sender's requested array
        const existingRequest = sender.requested?.find(
            (req) => req.user.toString() === receiverId && req.trips.some((t) => t.tripId.toString() === tripId)
        );
        if (existingRequest) {
            return res.status(400).json({ message: 'Request already sent' });
        }

        // Add to sender's requested array
        sender.requested = sender.requested || [];
        sender.requested.push({
            user: receiverId,
            trips: [{ tripId, type: 'sent', status: 'pending' }],
        });

        // Add to receiver's recievedReq array
        receiver.recievedReq = receiver.recievedReq || [];
        receiver.recievedReq.push({
            user: senderId,
            trips: [{ tripId, type: 'received', status: 'pending' }],
        });

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: 'Request sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Accept Request
router.post('/acceptRequest', authenticateToken, async (req, res) => {
    try {
        const { requesterId, tripId } = req.body;
        const acceptorId = req.userId;

        const acceptor = await User.findById(acceptorId);
        const requester = await User.findById(requesterId);

        if (!acceptor || !requester) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find request in acceptor's recievedReq array
        const acceptorRequest = acceptor.recievedReq?.find(
            (req) => req.user.toString() === requesterId && req.trips.some((t) => t.tripId.toString() === tripId)
        );
        if (!acceptorRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const tripIndex = acceptorRequest.trips.findIndex((t) => t.tripId.toString() === tripId);
        acceptorRequest.trips[tripIndex].status = 'accepted';

        // Find request in requester's requested array
        const requesterRequest = requester.requested?.find(
            (req) => req.user.toString() === acceptorId && req.trips.some((t) => t.tripId.toString() === tripId)
        );
        if (!requesterRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const requesterTripIndex = requesterRequest.trips.findIndex((t) => t.tripId.toString() === tripId);
        requesterRequest.trips[requesterTripIndex].status = 'accepted';

        // Add to matched arrays
        acceptor.matched = acceptor.matched || [];
        acceptor.matched.push({ user: requesterId, tripId, status: 'accepted' });

        requester.matched = requester.matched || [];
        requester.matched.push({ user: acceptorId, tripId, status: 'accepted' });

        await acceptor.save();
        await requester.save();

        res.status(200).json({ message: 'Request accepted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reject Request
router.post('/rejectRequest', authenticateToken, async (req, res) => {
    try {
        const { requesterId, tripId } = req.body;
        const rejectorId = req.userId;

        const rejector = await User.findById(rejectorId);
        const requester = await User.findById(requesterId);

        if (!rejector || !requester) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find request in rejector's recievedReq array
        const rejectorRequest = rejector.recievedReq?.find(
            (req) => req.user.toString() === requesterId && req.trips.some((t) => t.tripId.toString() === tripId)
        );
        if (!rejectorRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const tripIndex = rejectorRequest.trips.findIndex((t) => t.tripId.toString() === tripId);
        rejectorRequest.trips[tripIndex].status = 'rejected';

        // Find request in requester's requested array
        const requesterRequest = requester.requested?.find(
            (req) => req.user.toString() === rejectorId && req.trips.some((t) => t.tripId.toString() === tripId)
        );
        if (!requesterRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const requesterTripIndex = requesterRequest.trips.findIndex((t) => t.tripId.toString() === tripId);
        requesterRequest.trips[requesterTripIndex].status = 'rejected';

        await rejector.save();
        await requester.save();

        res.status(200).json({ message: 'Request rejected successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
