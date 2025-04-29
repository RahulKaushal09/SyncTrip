const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotelModel');
const Location = require('../models/locationModel');
const supabase = require('../config/supabaseClient.js'); // Import supabase client
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB per image
        files: 10, // Limit to 10 images
        fields: 10, // Limit number of non-file fields
    },
    fileFilter: (req, file, cb) => {
        // Ensure only images are allowed
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
}).fields([{ name: 'hotel_images', maxCount: 10 }]); // Expect 'hotel_images' field, up to 10 images
// CRUD operations for Hotel
// router.post('/', async (req, res) => {
//     try {
//         const hotel = new Hotel(req.body);
//         await hotel.save();
//         res.status(201).json(hotel);
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const dir = './uploads/hotels';
//         if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//         cb(null, dir);
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

router.post('/addNewHotel', upload, async (req, res) => {
    try {
        const {
            hotel_name,
            hotel_description,
            hotel_link,
            hotel_location,
            price,
            location
        } = req.body;

        // Parse nested fields (sent as JSON strings)
        const parsedLocation = JSON.parse(hotel_location || '{}');
        const parsedPrice = JSON.parse(price || '{}');

        // Check if hotel already exists
        let hotel = await Hotel.findOne({ hotel_name: hotel_name.trim() });
        if (!hotel) {
            hotel = new Hotel({
                hotel_name,
                hotel_description,
                hotel_link,
                hotel_location: parsedLocation,
                price: parsedPrice,
                location,
                hotel_images: []
            });

            // Process and upload hotel images to Supabase
            const hotelImages = req.files['hotel_images'];  // Assuming the images are sent under the 'hotel_images' key
            if (hotelImages && hotelImages.length > 0) {
                const uploadedFiles = [];
                for (let i = 0; i < hotelImages.length; i++) {
                    const file = hotelImages[i];
                    const ext = file.originalname.split('.').pop();
                    const fileName = `${hotel_name}_${Date.now()}_${i}.${ext}`;

                    // Upload image to Supabase
                    const { data, error } = await supabase.storage
                        .from('hotel-images')
                        .upload(fileName, file.buffer, {
                            contentType: file.mimetype,
                            upsert: true,
                        });

                    if (error) {
                        console.error('Error uploading hotel image to Supabase:', error);
                        return res.status(500).json({ error: 'Error uploading file to Supabase' });
                    }

                    // Get the public URL of the uploaded image
                    const { data: publicUrlData } = supabase.storage
                        .from('hotel-images')
                        .getPublicUrl(fileName);

                    // Store the public URL of the image
                    uploadedFiles.push(publicUrlData.publicUrl);
                }
                // Assign uploaded image URLs to the hotel
                hotel.hotel_images = uploadedFiles;
            }

            // Save the hotel to the database
            await hotel.save();
        }

        // Return the hotel ID in the response
        res.json({ hotelId: hotel._id });
    } catch (err) {
        console.error('Error in /addNewHotel:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/getHotelsByIds', async (req, res) => {
    try {
        // const limit = parseInt(req.body.limit) || 4;
        // console.log('Hotel IDs:', req.body.hotelIds); // Log the hotel IDs received in the request body

        const hotelIds = req.body.hotelIds;
        const hotels = await Hotel.find({ _id: { $in: hotelIds } });

        // const hotels = await Hotel.find().limit(limit);

        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error });
    }
});
router.get('/', async (req, res) => {
    try {

        const hotels = await Hotel.find().populate('booking_info');
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error });
    }
});
router.get('/getallhotelsFromLocationId/:locationId', async (req, res) => {
    try {
        const locationId = req.params.locationId;
        const location = await Location.findById(locationId).populate('hotels');
        if (!location) return res.status(404).json({ message: 'Location not found' });
        // console.log('Location:', location); // Log the location object for debugging
        const hotels = location.hotels; // Get the hotels from the location object
        if (!hotels || hotels.length === 0) return res.status(404).json({ message: 'No hotels found for this location' });

        // const hotels = await Hotel.find({ locationId })
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error });
    }
}
);

// router.put('/:id', async (req, res) => {
//     try {
//         const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedHotel);
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

// router.delete('/:id', async (req, res) => {
//     try {
//         await Hotel.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Deleted Successfully' });
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

module.exports = router;
