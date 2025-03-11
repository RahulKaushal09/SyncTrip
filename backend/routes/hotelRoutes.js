const express = require('express');
const Hotel = require('../models/hotelModel');
const router = express.Router();

// GET all hotels
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST a new hotel
router.post('/', async (req, res) => {
    const { hotel_name, hotel_link, hotel_location, price, hotel_images, hotel_description, rating } = req.body;
    const newHotel = new Hotel({
        hotel_name,
        hotel_link,
        hotel_location,
        price,
        hotel_images,
        hotel_description,
        rating
    });

    try {
        const savedHotel = await newHotel.save();
        res.json(savedHotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
