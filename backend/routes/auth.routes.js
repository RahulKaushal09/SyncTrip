const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js'); // Adjust the path as necessary
const multer = require('multer'); // For handling file uploads
const path = require('path');
const fs = require('fs'); // Add fs module for file system operations
// Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const uploadDir = path.join(__dirname, '../uploads'); // Adjust path based on your project structure
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create folder if it doesn't exist
}
// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use absolute path
    },
    filename: (req, file, cb) => {
        const userId = req.user.id; // From authenticateToken middleware
        const timestamp = Date.now();
        const ext = path.extname(file.originalname); // Get file extension
        cb(null, `${userId}_${timestamp}${ext}`); // Format: userId_time.ext
    },
});
const upload = multer({ storage });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'No token provided' });
    // console.log(`Token: ${token}`); // Debugging line

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user; // { id: user._id }
        next();
    });
};

// Google Login Route
router.post('/google-login', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email: rawEmail, name, picture } = payload;
        const email = rawEmail.toLowerCase(); // normalize email

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                profile_picture: [picture],
                // Phone and password will be added later
            });
            await user.save();
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({ user, token: accessToken });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid token' });
    }
});

// Google Complete Route (Phone Number)
router.post('/google-complete', async (req, res) => {
    const { userId, phone } = req.body;

    try {
        // check if no user have same phone number
        const existingUser = await User
            .findOne({

                phone,
            });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already in use' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.phone = phone;
        await user.save();

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Complete Profile Route
router.post('/complete-profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    const userId = req.user.id;
    const {
        travelStyles,
        travelerType,
        preferredDestinations,
        dreamDestinations,
        matchGender,
        ageGroup,
        showProfile,
        allowInvites,
        instagram,
        travelGoal,
        languages,
        dateOfBirth, // New field
    } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        user.persona = [
            ...(travelStyles ? JSON.parse(travelStyles) : []),
            ...(travelerType ? JSON.parse(travelerType) : []),
        ];
        user.preferred_destinations = preferredDestinations ? JSON.parse(preferredDestinations) : [];
        if (req.file) {
            const BACKEND_URL = process.env.BACKEND_URL || 'https://synctrip-backend.vercel.app/';
            const pictureURL = `${BACKEND_URL}uploads/${req.file.filename}`;
            user.profile_picture.unshift(pictureURL);
        }
        user.showProfile = showProfile === 'true';
        user.socialMedias.instagram = instagram || '';
        user.travelGoal = travelGoal || '';
        user.languages = languages ? languages.split(',').map(lang => lang.trim()) : [];
        user.interestedSex = matchGender ? [matchGender] : []; // Map matchGender to interestedSex
        user.interestedAgeGroups = ageGroup ? [ageGroup] : []; // Map ageGroup to interestedAgeGroups
        user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;

        // Mark profile as completed
        user.profileCompleted = true;

        await user.save();

        // Return user with calculated age
        const userWithAge = user.toJSON(); // Includes virtual 'age' field
        res.status(200).json({ success: true, user: userWithAge });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;