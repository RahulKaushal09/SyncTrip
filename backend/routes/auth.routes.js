const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js'); // Adjust the path as necessary
const supabase = require('../config/supabaseClient.js'); // Import supabase client

const multer = require('multer'); // For handling file uploads
// const path = require('path');
// const fs = require('fs'); // Add fs module for file system operations
// const { log } = require('console');
// Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// const uploadDir = path.join(__dirname, '../uploads'); // Adjust path based on your project structure

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true }); // Create folder if it doesn't exist
// }
// // Multer setup for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir); // Use absolute path
//     },
//     filename: (req, file, cb) => {
//         const userId = req.user.id; // From authenticateToken middleware
//         const timestamp = Date.now();
//         const ext = path.extname(file.originalname); // Get file extension
//         cb(null, `${userId}_${timestamp}${ext}`); // Format: userId_time.ext
//     },
// });
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
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
}).fields([{ name: 'profilePicture', maxCount: 1 }]); // Expect 'profilePicture' field
// const upload = multer({ storage });

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

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ user, token: accessToken });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Invalid token' });
    }
});

// Google Complete Route (Phone Number)
router.post('/google-complete', authenticateToken, async (req, res) => {
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
router.post('/complete-profile', authenticateToken, upload, async (req, res) => {
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

        // If file is uploaded, save it to Supabase
        if (req.files && req.files.profilePicture) {
            // Check if the file is an image
            const fileType = req.files.profilePicture[0].mimetype.split('/')[0];
            if (fileType !== 'image') {
                return res.status(400).json({ message: 'Only image files are allowed' });
            }
            // Check if the file size is less than 5MB
            const fileSize = req.files.profilePicture[0].size; // Size in bytes
            if (fileSize > 5 * 1024 * 1024) { // 5MB in bytes
                return res.status(400).json({ message: 'File size exceeds 5MB' });
            }

            const file = req.files.profilePicture[0];  // Assuming file is in the `profilePicture` field
            const ext = file.originalname.split('.').pop();
            const fileName = `${userId}_${Date.now()}.${ext}`;

            const { data, error } = await supabase.storage
                .from('profile-pictures')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });
            console.log('File uploaded:', data, 'Error:', error); // Debugging line

            if (error) {
                console.error('Error uploading to Supabase:', error);
                return res.status(500).json({ error: 'Error uploading file to Supabase' });
            }

            // Get the public URL
            const { data: publicUrlData } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);
            console.log('Public URL:', publicUrlData); // Debugging line
            if (!publicUrlData) {
                return res.status(500).json({ error: 'Error getting public URL' });
            }
            // Save the public URL
            user.profile_picture.unshift(publicUrlData.publicUrl);
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
        // console.log(user);
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