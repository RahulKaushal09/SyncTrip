const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/userModel');
const authenticateToken = require('../middleware/middleware.js').authenticateToken;

// get user data using token 
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.userId; // Extract userId from the token
        const user = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
);
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

        if (senderId === receiverId) {
            return res.status(400).json({ message: 'Cannot send request to yourself' });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the receiver has already requested the sender
        const receiverTrip = receiver.friends.find(f => f.tripId.toString() === tripId);
        const receiverHasRequestedSender = receiverTrip?.users.some(
            u => u.userId.toString() === senderId && u.status === 1
        );
        if (receiverHasRequestedSender) {
            return res.status(400).json({ message: 'This user has already sent you a request' });
        }

        // Check if sender already sent a request
        let senderTrip = sender.friends.find(f => f.tripId.toString() === tripId);
        if (!senderTrip) {
            senderTrip = { tripId, users: [] };
            sender.friends.push(senderTrip);
        }

        const existingRequest = senderTrip.users.find(u => u.userId.toString() === receiverId);
        if (existingRequest) {
            return res.status(400).json({ message: 'Request already sent' });
        }

        // Add to sender
        senderTrip.users.push({ userId: receiverId, status: 1 });

        // Add to receiver
        let receiverTripEntry = receiver.friends.find(f => f.tripId.toString() === tripId);
        if (!receiverTripEntry) {
            receiverTripEntry = { tripId, users: [] };
            receiver.friends.push(receiverTripEntry);
        }

        receiverTripEntry.users.push({ userId: senderId, status: -1 });

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: 'Request sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/acceptRequest', authenticateToken, async (req, res) => {
    try {
        const { requesterId, tripId } = req.body;
        const acceptorId = req.userId;

        const acceptor = await User.findById(acceptorId);
        const requester = await User.findById(requesterId);

        if (!acceptor || !requester) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the requester had actually sent a request
        const acceptorTrip = acceptor.friends.find(f => f.tripId.toString() === tripId);
        const hasRequest = acceptorTrip?.users.find(
            u => u.userId.toString() === requesterId && u.status === -1
        );
        if (!hasRequest) {
            return res.status(400).json({ message: 'No incoming request from this user' });
        }

        // Update acceptor's status to matched (0)
        hasRequest.status = 0;

        // Update requester's entry to matched (0)
        const requesterTrip = requester.friends.find(f => f.tripId.toString() === tripId);
        const requesterEntry = requesterTrip?.users.find(
            u => u.userId.toString() === acceptorId && u.status === 1
        );
        if (!requesterEntry) {
            return res.status(400).json({ message: 'Invalid state: requester did not send request' });
        }
        requesterEntry.status = 0;

        await acceptor.save();
        await requester.save();

        res.status(200).json({ message: 'Request accepted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // Reject Request
// router.post('/rejectRequest', authenticateToken, async (req, res) => {
//     try {
//         const { requesterId, tripId } = req.body;
//         const rejectorId = req.userId;

//         const rejector = await User.findById(rejectorId);
//         const requester = await User.findById(requesterId);

//         if (!rejector || !requester) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Find request in rejector's recievedReq array
//         const rejectorRequest = rejector.recievedReq?.find(
//             (req) => req.user.toString() === requesterId && req.trips.some((t) => t.tripId.toString() === tripId)
//         );
//         if (!rejectorRequest) {
//             return res.status(404).json({ message: 'Request not found' });
//         }

//         const tripIndex = rejectorRequest.trips.findIndex((t) => t.tripId.toString() === tripId);
//         rejectorRequest.trips[tripIndex].status = 'rejected';

//         // Find request in requester's requested array
//         const requesterRequest = requester.requested?.find(
//             (req) => req.user.toString() === rejectorId && req.trips.some((t) => t.tripId.toString() === tripId)
//         );
//         if (!requesterRequest) {
//             return res.status(404).json({ message: 'Request not found' });
//         }

//         const requesterTripIndex = requesterRequest.trips.findIndex((t) => t.tripId.toString() === tripId);
//         requesterRequest.trips[requesterTripIndex].status = 'rejected';

//         await rejector.save();
//         await requester.save();

//         res.status(200).json({ message: 'Request rejected successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


module.exports = router;
