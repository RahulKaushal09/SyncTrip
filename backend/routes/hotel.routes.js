const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotelModel');
const Location = require('../models/locationModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads/hotels';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/addNewHotel', upload.array('hotel_images', 6), async (req, res) => {
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
                hotel_images: req.files.map(file => `/uploads/hotels/${file.filename}`)
            });
            await hotel.save();
        }

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
